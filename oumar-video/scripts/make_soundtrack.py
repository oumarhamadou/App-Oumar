#!/usr/bin/env python3
"""Original SaaS-style soundtrack for OumarReel, synthesised from scratch.

Bright marimba/pluck melody over F – Am – Dm – Bb at 112.5 BPM, a riser and a
short silence before the drop, a sidechained groove after it, and UI sounds
(ticks, pops, swishes, click, whooshes, impacts) placed on the exact frames of
the edit. Frame numbers mirror src/timeline.ts and the scene files.

Usage: python3 scripts/make_soundtrack.py public/audio/soundtrack.wav
Then master: see README.md (ffmpeg loudnorm, two passes).
"""

import sys
import wave

import numpy as np

SR = 44100
FPS = 30
BEAT = 16  # frames per beat
END = 544  # last frame of the video
rng = np.random.default_rng(7)


def idx(frame):
    return int(round(frame / FPS * SR))


N = idx(END) + SR
BUS = {name: np.zeros((2, N)) for name in ("dry", "pump", "send")}


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def fft_filter(x, response):
    n = 1 << int(np.ceil(np.log2(len(x) + 1)))
    spec = np.fft.rfft(x, n)
    f = np.fft.rfftfreq(n, 1 / SR)
    return np.fft.irfft(spec * response(f), n)[: len(x)]


def hp(fc, order=2):
    return lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order))


def lp(fc, order=2):
    return lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order))


def bp(lo, hi, order=2):
    return lambda f: hp(lo, order)(f) * lp(hi, order)(f)


def norm(x):
    return x / (np.abs(x).max() + 1e-9)


def place(sig, frame, gain=1.0, pan=0.0, send=0.0, bus="dry"):
    """Mix a mono (n,) or stereo (2, n) signal in at a frame."""
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.vstack([sig * np.cos(a), sig * np.sin(a)]) * np.sqrt(2)
    start = idx(frame)
    if start < 0:
        sig = sig[:, -start:]
        start = 0
    end = min(N, start + sig.shape[1])
    if end <= start:
        return
    chunk = sig[:, : end - start] * gain
    BUS[bus][:, start:end] += chunk
    if send:
        BUS["send"][:, start:end] += chunk * send


def sweep_noise(dur, f0, f1, width=0.6, curve=1.0):
    """Noise through a band-pass whose centre glides from f0 to f1 (STFT)."""
    x = noise(dur + 0.1)
    n_fft, hop = 2048, 512
    win = np.hanning(n_fft)
    pad = np.concatenate([np.zeros(n_fft), x, np.zeros(n_fft)])
    frames = np.lib.stride_tricks.sliding_window_view(pad, n_fft)[::hop] * win
    spec = np.fft.rfft(frames, axis=1)
    f = np.fft.rfftfreq(n_fft, 1 / SR)
    prog = np.clip((np.arange(len(frames)) * hop - n_fft) / SR / dur, 0, 1) ** curve
    fc = f0 * (f1 / f0) ** prog
    mask = np.exp(-0.5 * (np.log2(np.maximum(f, 1)[None, :] / fc[:, None]) / width) ** 2)
    out_frames = np.fft.irfft(spec * mask, axis=1) * win
    out = np.zeros(len(pad))
    wsum = np.zeros(len(pad))
    for i, fr in enumerate(out_frames):
        out[i * hop : i * hop + n_fft] += fr
        wsum[i * hop : i * hop + n_fft] += win**2
    out = out / np.maximum(wsum, 1e-3)
    return out[n_fft : n_fft + int(dur * SR)]


# ---------------------------------------------------------------- instruments


def marimba(m, vel=1.0, dur=1.0):
    f = mtof(m)
    t = t_(dur)
    s = (
        np.sin(2 * np.pi * f * t) * np.exp(-t / 0.42)
        + 0.30 * np.sin(2 * np.pi * 3.93 * f * t) * np.exp(-t / 0.07)
        + 0.07 * np.sin(2 * np.pi * 9.4 * f * t) * np.exp(-t / 0.022)
    )
    s *= np.minimum(1, t / 0.0015)
    return s * vel


def pluck(m, vel=1.0, dur=0.8, bright=1.0):
    f = mtof(m)
    t = t_(dur)
    voices = []
    for cents in (-8, 8):
        fd = f * 2 ** (cents / 1200)
        v = np.zeros(len(t))
        for k in range(1, 40):
            if k * fd > 11000:
                break
            v += (1 / k) * np.sin(2 * np.pi * k * fd * t + rng.random() * 6.28) * np.exp(
                -t * (4 + 5.5 * k * bright)
            )
        voices.append(v * np.minimum(1, t / 0.002))
    st = np.vstack([voices[0] * 0.8 + voices[1] * 0.2, voices[1] * 0.8 + voices[0] * 0.2])
    return st / (np.abs(st).max() + 1e-9) * vel


def pad(chord, dur, bright=1.0, attack=0.35, release=0.5):
    t = t_(dur)
    out = np.zeros((2, len(t)))
    for m in chord:
        f = mtof(m)
        for ch, cents in ((0, -10), (1, 10), (0, 3), (1, -3)):
            fd = f * 2 ** (cents / 1200)
            for k in range(1, 14):
                if k * fd > 2600 * bright:
                    break
                out[ch] += (1 / k) * np.exp(-k * fd / (1500 * bright)) * np.sin(
                    2 * np.pi * k * fd * t + rng.random() * 6.28
                )
    env = np.minimum(1, t / attack) * np.clip((dur - t) / release, 0, 1)
    return out / (np.abs(out).max() + 1e-9) * env


def bass(m, dur, decay=None):
    f = mtof(m)
    t = t_(dur)
    s = (
        np.sin(2 * np.pi * f * t)
        + 0.35 * np.sin(2 * np.pi * 2 * f * t)
        + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    )
    env = np.minimum(1, t / 0.006) * np.clip((dur - t) / 0.04, 0, 1)
    if decay:
        env *= np.exp(-t / decay)
    return np.tanh(1.3 * s * env) / np.tanh(1.3)


def kick():
    t = t_(0.5)
    f = 46 + 135 * np.exp(-t / 0.03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.28)
    click = fft_filter(noise(0.006), hp(2500)) * 0.3
    s[: len(click)] += click
    return np.tanh(1.5 * s) / np.tanh(1.5)


def clap(vel=1.0):
    t = t_(0.4)
    env = np.zeros(len(t))
    for d in (0.0, 0.009, 0.019):
        env += np.where(t >= d, np.exp(-(t - d) / 0.005), 0)
    env += 0.55 * np.where(t >= 0.028, np.exp(-(t - 0.028) / 0.12), 0)
    return norm(fft_filter(noise(0.4) * env, bp(900, 6500))) * vel


def snare(vel=1.0):
    t = t_(0.25)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05)
    rattle = fft_filter(noise(0.25), bp(1800, 8000)) * np.exp(-t / 0.075)
    return norm(0.6 * body + rattle) * vel


def hat(open_=False, vel=1.0):
    dur = 0.35 if open_ else 0.08
    t = t_(dur)
    return norm(fft_filter(noise(dur), hp(7500, 3)) * np.exp(-t / (0.16 if open_ else 0.022))) * vel


def shaker(vel=1.0):
    t = t_(0.09)
    env = np.minimum(1, t / 0.006) * np.exp(-t / 0.035)
    return norm(fft_filter(noise(0.09), bp(5000, 13000)) * env) * vel


def riser(dur):
    t = t_(dur)
    prog = t / dur
    air = sweep_noise(dur, 350, 9000, width=0.7, curve=1.6) * prog**2.2
    tone = np.zeros(len(t))
    for ratio in (1.0, 1.006, 1.5):
        f = 180 * ratio * 4 ** (prog**1.8)
        tone += np.sin(2 * np.pi * np.cumsum(f) / SR)
    tone *= prog**2.5 * 0.25
    return norm(air) * 0.8 + tone


def impact(size=1.0):
    t = t_(2.2)
    f = 36 + 50 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.9 * size))
    thump = fft_filter(noise(2.2), lp(1800)) * np.exp(-t / 0.12)
    crash_l = fft_filter(noise(2.2), hp(4500)) * np.exp(-t / (1.1 * size))
    crash_r = fft_filter(noise(2.2), hp(4500)) * np.exp(-t / (1.1 * size))
    mono = boom + 0.35 * norm(thump)
    return np.vstack([mono + 0.22 * norm(crash_l), mono + 0.22 * norm(crash_r)])


def tick(freq=2600, vel=1.0):
    t = t_(0.05)
    s = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.01)
    s[:90] += fft_filter(rng.standard_normal(90), hp(3000)) * 0.4
    return s * vel


def pop(f0=1000, f1=330, vel=1.0):
    t = t_(0.14)
    f = f1 + (f0 - f1) * np.exp(-t / 0.016)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.05) * np.minimum(1, t / 0.001)
    return s * vel


def swish(dur=0.28, up=True, vel=1.0):
    a, b = (900, 6000) if up else (6000, 900)
    t = t_(dur)
    env = np.sin(np.pi * t / dur) ** 1.6
    return norm(sweep_noise(dur, a, b, width=0.55) * env) * vel


def whoosh(dur=0.6, vel=1.0, pan_from=-0.7, pan_to=0.7):
    t = t_(dur)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2
    s = norm(sweep_noise(dur, 300, 3500, width=0.9, curve=0.8) * env) * vel
    pan = pan_from + (pan_to - pan_from) * t / dur
    a = (pan + 1) * np.pi / 4
    return np.vstack([s * np.cos(a), s * np.sin(a)]) * np.sqrt(2)


def suck(dur=0.5, vel=1.0):
    t = t_(dur)
    env = (t / dur) ** 3
    return norm(sweep_noise(dur, 6000, 500, width=0.8) * env) * vel


def click(vel=1.0):
    t = t_(0.03)
    s = np.sin(2 * np.pi * 4200 * t) * np.exp(-t / 0.003)
    s[:60] += fft_filter(rng.standard_normal(60), hp(2000)) * 0.6
    return s * vel


def bloop(vel=1.0):
    t = t_(0.18)
    f = 260 + 420 * (1 - np.exp(-t / 0.03))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.07) * np.minimum(1, t / 0.002) * vel


# ---------------------------------------------------------------- arrangement

CHORDS = {
    "F": ([53, 57, 60, 64], 41),
    "Am": ([52, 57, 60, 64], 45),
    "Dm": ([50, 53, 57, 60], 38),
    "Bb": ([50, 53, 58, 60], 46),
}
PROGRESSION = ["F", "Am", "Dm", "Bb"]
MELODY = {
    "F": [81, 84, 77, 84, 88, 84, 79, 81],
    "Am": [76, 81, 84, 81, 88, 84, 79, 81],
    "Dm": [74, 81, 77, 81, 86, 81, 77, 79],
    "Bb": [74, 82, 77, 82, 86, 82, 84, 86],
}
ACCENT = [1.0, 0.55, 0.72, 0.92, 0.6, 0.78, 0.95, 0.6]

BAR0 = -32  # bars start at -32 + 64k → drop (224) and reveal (480) on bar lines
DROP, IMPACT, BUILD, REVEAL = 224, 352, 448, 480
BREAK = 212  # music cuts here; silence until the drop


def bar_start(k):
    return BAR0 + 64 * k


for k in range(9):
    b = bar_start(k)
    name = PROGRESSION[k % 4]
    chord, root = CHORDS[name]
    drop = b >= DROP
    final = b >= REVEAL

    # Pad + bass
    if final:
        place(pad(chord + [72], 2.6, bright=1.3, attack=0.05, release=1.2), b, gain=0.16, send=0.5)
        place(bass(root, 2.1), b, gain=0.5)
    elif drop:
        place(pad(chord, 64 / FPS + 0.05, bright=1.2, attack=0.02, release=0.08), b, gain=0.13, bus="pump", send=0.3)
        place(bass(root, 64 / FPS), b, gain=0.55, bus="pump")
    else:
        length = (min(b + 64, BREAK) - max(b, 0)) / FPS
        if length > 0:
            place(pad(chord, length + 0.01, bright=0.8, attack=0.5, release=0.3), max(b, 0), gain=0.22, send=0.4)
        if k >= 1:
            for half in (0, 32):
                if b + half < BREAK:
                    place(bass(root, 0.9, decay=0.32), b + half, gain=0.2 if half == 0 else 0.12)

    # Melody
    if final:
        for i, (m, at) in enumerate(zip([77, 81, 84, 88, 89], [0, 4, 8, 12, 20])):
            place(marimba(m, 0.9 - i * 0.05, dur=1.6), b + at, gain=0.3, pan=-0.3 + i * 0.15, send=0.45)
            place(pluck(m - 12, 0.7, dur=1.2, bright=0.5), b + at, gain=0.14, send=0.35)
        continue
    for step, m in enumerate(MELODY[name]):
        at = b + step * 8
        if at < 0 or BREAK <= at < DROP or at >= REVEAL - 6:
            continue
        v = ACCENT[step]
        place(marimba(m, v), at, gain=0.26 if drop else 0.58, pan=0.25 if step % 2 else -0.25, send=0.35)
        if drop:
            place(pluck(m - 12, v, bright=0.8), at, gain=0.13, send=0.25, bus="pump")

# Drums after the drop (the build drops to half time)
for f in range(DROP, REVEAL, BEAT):
    if f < BUILD or f in (BUILD, BUILD + 16):
        place(kick(), f, gain=0.95)
    beat_in_bar = ((f - BAR0) // BEAT) % 4
    if f < BUILD and beat_in_bar in (1, 3):
        place(clap(), f, gain=0.32, send=0.25)
    if f < BUILD:
        place(hat(vel=0.9), f + 8, gain=0.11, pan=0.3)
        for s16 in range(4):
            place(shaker(0.5 + 0.5 * (s16 % 2)), f + s16 * 4, gain=0.05, pan=-0.35)
    if f < BUILD and beat_in_bar == 3:
        place(hat(open_=True), f + 8, gain=0.07, pan=0.3)

# Intro percussion: soft shaker, then snaps, then a roll into the break
for f in range(96, BREAK, 8):
    place(shaker(0.6 + 0.4 * ((f // 8) % 2)), f, gain=0.07, pan=-0.3)
for f in (176, 208):
    place(clap(0.6), f, gain=0.16, send=0.3)
for i, f in enumerate([192, 196, 200, 202, 204, 206, 208, 209, 210, 211]):
    place(snare(0.35 + i * 0.06), f, gain=0.12, send=0.2)

# Build into the reveal
for i, f in enumerate(list(range(456, 468, 4)) + list(range(468, 476, 2))):
    place(snare(0.4 + i * 0.05), f, gain=0.13, send=0.2)

# Risers, breaks, impacts
place(riser((BREAK - 160) / FPS), 160, gain=0.2, send=0.2)
place(suck(0.45), DROP - 0.45 * FPS, gain=0.22)
place(impact(1.0), DROP, gain=0.7, send=0.3)
place(impact(0.6), IMPACT, gain=0.42, send=0.3)
place(riser((476 - 448) / FPS), 448, gain=0.2, send=0.2)
place(impact(1.2), REVEAL, gain=0.75, send=0.35)

# UI sound design, frame-accurate to the scenes
for f, freq in [(6, 2400), (122, 2200), (130, 2500), (136, 2300), (142, 2700), (154, 2200), (158, 2500), (246, 2600), (256, 2300), (260, 2500), (264, 2700)]:
    place(tick(freq), f, gain=0.24, pan=rng.uniform(-0.3, 0.3), send=0.2)
for f, g in [(14, 0.22), (146, 0.26), (164, 0.24), (250, 0.26), (276, 0.24), (282, 0.2), (360, 0.3), (406, 0.16)]:
    place(pop(vel=1.0), f, gain=g, send=0.25)
for f, up in [(48, False), (60, True), (76, True), (92, True), (110, False), (270, True), (394, False)]:
    place(swish(0.26, up), f - 3, gain=0.2, pan=0.2 if up else -0.2)
place(suck(0.4), 206, gain=0.12)
place(pop(1800, 700, 0.6), 220, gain=0.12)
place(whoosh(0.45, pan_from=-0.2, pan_to=0.2), 232, gain=0.2)
place(whoosh(0.7, pan_from=0.5, pan_to=-0.2), 318, gain=0.22)
place(click(), 342, gain=0.5)
place(click(0.7), 348, gain=0.4)
place(whoosh(0.95, pan_from=-0.8, pan_to=0.8), 360, gain=0.24)
place(bloop(), 388, gain=0.3, send=0.2)
place(whoosh(0.85, pan_from=-0.3, pan_to=0.6), 454, gain=0.26)
for i, f in enumerate([484, 487, 490, 493, 496, 502]):
    place(tick(3000 + i * 150, 0.6), f, gain=0.1, send=0.4)
for i, m in enumerate([89, 93, 96, 100]):
    place(marimba(m, 0.5, dur=1.4), 486 + i * 2, gain=0.08, pan=-0.4 + i * 0.25, send=0.7)

# ---------------------------------------------------------------- mixdown

# Sidechain pump from every kick after the drop.
gain = np.ones(N)
seg_t = t_(BEAT / FPS)
duck = 1 - 0.78 * np.exp(-seg_t / 0.1)
for f in range(DROP, BUILD, BEAT):
    s0 = idx(f)
    gain[s0 : s0 + len(duck)] = np.minimum(gain[s0 : s0 + len(duck)], duck)
for f in (BUILD, BUILD + 16):
    s0 = idx(f)
    gain[s0 : s0 + len(duck)] = np.minimum(gain[s0 : s0 + len(duck)], duck)

mix = BUS["dry"] + BUS["pump"] * gain

# Plate-ish reverb: decaying stereo noise impulse response.
ir_t = t_(2.4)
ir = np.vstack([fft_filter(noise(2.4), bp(250, 7000)) for _ in range(2)]) * np.exp(-ir_t / 0.32)
ir[:, : int(0.015 * SR)] = 0
ir /= np.sqrt((ir**2).sum(axis=1, keepdims=True))
n_fft = 1 << int(np.ceil(np.log2(N + ir.shape[1])))
wet = np.vstack(
    [np.fft.irfft(np.fft.rfft(BUS["send"][c], n_fft) * np.fft.rfft(ir[c], n_fft), n_fft)[:N] for c in range(2)]
)
mix = mix + 0.35 * wet

length = idx(END)
mix = mix[:, :length]
fade = np.ones(length)
fade[-int(0.35 * SR) :] = np.linspace(1, 0, int(0.35 * SR)) ** 2
mix *= fade
mix /= np.abs(mix).max()
mix = np.tanh(1.6 * mix) / np.tanh(1.6) * 0.89

out = np.clip(mix.T * 32767, -32768, 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print(f"wrote {sys.argv[1]} ({length / SR:.2f}s)")
