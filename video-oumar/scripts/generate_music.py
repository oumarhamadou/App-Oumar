"""Synthesise an original, royalty-free lo-fi music bed for the video.

Usage (from video-oumar/):
    pip install numpy
    python scripts/generate_music.py

Writes public/music/fond.mp3 (stereo, 44.1 kHz).
"""

import pathlib
import subprocess
import tempfile
import wave

import numpy as np

SR = 44100
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
DURATION = 41.0
rng = np.random.default_rng(7)

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "music" / "fond.mp3"


def midi(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


# Fmaj9 - Am7 - Dm9 - Bbmaj7(#11): warm, hopeful, a little restless.
CHORDS = [
    [53, 57, 60, 64, 67],
    [57, 60, 64, 67, 71],
    [50, 57, 60, 64, 65],
    [46, 53, 57, 62, 64],
]

t_total = int(DURATION * SR)
left = np.zeros(t_total)
right = np.zeros(t_total)


def add(sig: np.ndarray, start_s: float, pan: float = 0.0, gain: float = 1.0):
    i = int(start_s * SR)
    if i >= t_total:
        return
    sig = sig[: t_total - i] * gain
    left[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
    right[i : i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def one_pole_lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def pad(notes, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for note in notes:
        f = midi(note)
        for detune in (-0.12, 0.0, 0.12):
            ff = f * 2 ** (detune / 12)
            sig += np.sin(2 * np.pi * ff * t) + 0.25 * np.sin(4 * np.pi * ff * t + 0.3)
    env = np.minimum(1, t / 0.6) * np.minimum(1, (length - t) / 0.5)
    return sig * env / (len(notes) * 3)


def pluck(freq, length=0.9):
    """Karplus-Strong plucked string."""
    n = int(length * SR)
    period = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, period)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % period]
        buf[i % period] = 0.497 * (buf[i % period] + buf[(i + 1) % period])
    return out * np.exp(-np.arange(n) / SR * 2.2)


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 48 + 90 * np.exp(-t * 30)
    phase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(phase) * np.exp(-t * 9)


def hat():
    n = int(0.06 * SR)
    noise = rng.uniform(-1, 1, n)
    noise = noise - one_pole_lowpass(noise, 6000)
    return noise * np.exp(-np.arange(n) / SR * 70)


def bass(note, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = midi(note)
    sig = np.sin(2 * np.pi * f * t) + 0.2 * np.sin(4 * np.pi * f * t)
    env = np.minimum(1, t / 0.02) * np.exp(-t * 1.2)
    return sig * env


ARP = [0, 2, 3, 4, 3, 2, 1, 2]
bar = 0
start = 0.0
while start < DURATION:
    chord = CHORDS[bar % len(CHORDS)]
    add(pad(chord, BAR + 0.4), start, gain=0.22)
    add(bass(chord[0] - 12, BAR * 0.9), start, gain=0.38)
    add(bass(chord[0] - 12, BEAT * 1.5), start + 2.5 * BEAT, gain=0.25)
    for step, idx in enumerate(ARP):
        note = chord[idx] + 12
        add(pluck(midi(note)), start + step * BEAT / 2, pan=0.35 if step % 2 else -0.35, gain=0.16)
    if bar >= 1:  # drums enter after the first bar
        for b in range(4):
            if b in (0, 2):
                add(kick(), start + b * BEAT, gain=0.45)
            add(hat(), start + b * BEAT + BEAT / 2, pan=0.2, gain=0.12)
            add(hat(), start + b * BEAT, pan=-0.2, gain=0.06)
    bar += 1
    start += BAR

mix = np.stack([left, right], axis=1)
mix = np.tanh(mix * 1.1)  # gentle saturation / glue
t = np.arange(t_total) / SR
fade = np.minimum(1, t / 0.8) * np.clip((DURATION - t) / 3.0, 0, 1)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89

OUT.parent.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    wav = pathlib.Path(tmp) / "fond.wav"
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype("<i2").tobytes())
    subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-b:a", "192k", str(OUT)])
print(f"Wrote {OUT} ({DURATION:.1f}s)")
