"""Synthesise the montage sound effects (no music) into public/sfx/*.wav.

Run:  python3 scripts/make_sfx.py
Only numpy is required. Every sound is generated procedurally, so there are
no licensing issues and the result is fully reproducible (fixed seeds).
"""

import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(OUT, exist_ok=True)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def save(name, left, right=None, peak_db=-1.0):
    if right is None:
        right = left
    st = np.stack([left, right], axis=1)
    peak = np.max(np.abs(st)) + 1e-9
    st = st / peak * (10 ** (peak_db / 20))
    # tiny fades to avoid clicks at the edges
    fade = min(64, len(st) // 4)
    st[:fade] *= np.linspace(0, 1, fade)[:, None]
    st[-fade:] *= np.linspace(1, 0, fade)[:, None]
    data = (st * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print("wrote", name, f"{len(st) / SR:.2f}s")


def svf(x, fc, q=0.8, mode="bp"):
    """Chamberlin state-variable filter with per-sample cutoff."""
    fc = np.broadcast_to(np.asarray(fc, dtype=np.float64), x.shape)
    f = 2 * np.sin(np.pi * np.clip(fc, 20, SR / 6) / SR)
    damp = 1.0 / q
    low = band = 0.0
    out = np.empty_like(x)
    for i in range(len(x)):
        high = x[i] - low - damp * band
        band = band + f[i] * high
        low = low + f[i] * band
        out[i] = band if mode == "bp" else (low if mode == "lp" else high)
    return out


def reverb(x, seconds=1.2, wet=0.35, seed=7, bright=4000):
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * seconds / 6.5))
    ir = svf(ir, bright, 0.7, "lp")
    ir /= np.sqrt(np.sum(ir**2)) + 1e-9
    size = len(x) + n
    nfft = 1 << (size - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[:size]
    dry = np.concatenate([x, np.zeros(n)])
    return dry * (1 - wet) + y * wet * 3


def pad(x, n):
    return np.concatenate([x, np.zeros(max(0, n - len(x)))])[:n]


# ---------------------------------------------------------------- word ticks
def tick(freq, seed):
    rng = np.random.default_rng(seed)
    t = t_axis(0.09)
    sweep = freq * (1 + 0.7 * np.exp(-t / 0.004))
    phase = 2 * np.pi * np.cumsum(sweep) / SR
    body = np.sin(phase) * np.exp(-t / 0.014)
    click = svf(rng.standard_normal(len(t)), 5200, 1.5, "bp") * np.exp(-t / 0.0025)
    thump = np.sin(2 * np.pi * 180 * t) * np.exp(-t / 0.02) * 0.5
    x = body * 0.8 + click * 0.5 + thump
    return reverb(x, 0.35, 0.18, seed)


for i, f in enumerate([1500, 1750, 2000, 1650]):
    y = tick(f, i)
    save(f"tick{i + 1}", y, np.roll(y, 18), -3)

# ---------------------------------------------------------------- pop (bold words)
t = t_axis(0.18)
f = 230 + 520 * np.exp(-t / 0.018)
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.05)
x += 0.25 * np.sin(4 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.03)
x = np.tanh(2.2 * x)
x = reverb(x, 0.4, 0.15, 3)
save("pop", x, np.roll(x, 25), -2)


# ---------------------------------------------------------------- whooshes
def whoosh(dur, f0, f1, f2, peak_at, seed, q=1.1, bright=1.0):
    rng = np.random.default_rng(seed)
    t = t_axis(dur)
    u = t / dur
    fc = np.where(
        u < peak_at,
        f0 * (f1 / f0) ** (u / peak_at),
        f1 * (f2 / f1) ** ((u - peak_at) / (1 - peak_at)),
    ) * bright
    env = np.where(u < peak_at, (u / peak_at) ** 2.2, np.exp(-(u - peak_at) / (1 - peak_at) * 4.5))
    nl = svf(rng.standard_normal(len(t)), fc, q) * env
    nr = svf(rng.standard_normal(len(t)), fc * 1.04, q) * env
    pan = np.clip(u * 1.3 - 0.15, 0, 1)  # left -> right pass-by
    left = nl * np.cos(pan * np.pi / 2) * 1.2 + nr * 0.25
    right = nr * np.sin(pan * np.pi / 2) * 1.2 + nl * 0.25
    return reverb(left, 0.6, 0.22, seed), reverb(right, 0.6, 0.22, seed + 1)


save("whoosh", *whoosh(0.7, 250, 2600, 500, 0.55, 11))
save("whoosh_fast", *whoosh(0.38, 400, 4200, 900, 0.5, 12, q=1.4), peak_db=-2)
save("swipe", *whoosh(0.3, 1800, 8000, 3000, 0.35, 13, q=1.6), peak_db=-4)


# ---------------------------------------------------------------- sub boom
def boom(dur, seed, crack=0.0, tail=0.3):
    rng = np.random.default_rng(seed)
    t = t_axis(dur)
    f = 38 + 85 * np.exp(-t / 0.09)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sub = np.sin(ph) * np.exp(-t / 0.5) * np.clip(t / 0.003, 0, 1)
    sub += 0.35 * np.sin(2 * ph) * np.exp(-t / 0.25)
    thump = svf(rng.standard_normal(len(t)), 700, 0.7, "lp") * np.exp(-t / 0.05) * 1.6
    x = np.tanh(1.8 * (sub + thump))
    if crack:
        cr = svf(rng.standard_normal(len(t)), 3500, 0.9, "hp") * np.exp(-t / 0.035)
        x += crack * cr
    left = reverb(x, 1.6, tail, seed, 2500)
    right = reverb(x, 1.6, tail, seed + 9, 2500)
    return left, right


save("boom", *boom(1.8, 21))
save("impact", *boom(2.0, 22, crack=0.9, tail=0.45))

# ---------------------------------------------------------------- riser
rng = np.random.default_rng(31)
t = t_axis(1.3)
u = t / t[-1]
env = u**2.6
fc = 300 * (7000 / 300) ** u
noise_l = svf(rng.standard_normal(len(t)), fc, 2.0) * env
noise_r = svf(rng.standard_normal(len(t)), fc * 1.03, 2.0) * env
tone_f = 140 * (950 / 140) ** (u**1.4)
trem = 0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(6 + 26 * u**2) / SR)
tone = (np.sin(2 * np.pi * np.cumsum(tone_f) / SR) + 0.3 * np.sin(2 * np.pi * np.cumsum(tone_f * 1.5) / SR)) * env * trem * 0.35
save("riser", noise_l + tone, noise_r + tone, -2)

# ---------------------------------------------------------------- shimmer (gold words)
rng = np.random.default_rng(41)
dur = 1.8
t = t_axis(dur)
left = np.zeros(len(t))
right = np.zeros(len(t))
for k in range(16):
    f0 = rng.uniform(2200, 6800)
    on = rng.uniform(0, 0.35)
    tau = rng.uniform(0.18, 0.5)
    tt = np.clip(t - on, 0, None)
    vib = 1 + 0.003 * np.sin(2 * np.pi * rng.uniform(4, 7) * t)
    p = np.sin(2 * np.pi * np.cumsum(f0 * vib) / SR) * np.exp(-tt / tau) * (t >= on) * np.clip(tt / 0.004, 0, 1)
    pan = rng.uniform(0.15, 0.85)
    amp = rng.uniform(0.4, 1.0)
    left += p * amp * np.cos(pan * np.pi / 2)
    right += p * amp * np.sin(pan * np.pi / 2)
air = svf(rng.standard_normal(len(t)), 9000, 0.8, "bp") * np.exp(-t / 0.25) * 0.25
save("shimmer", reverb(left + air, 1.4, 0.4, 42, 9000), reverb(right + air, 1.4, 0.4, 43, 9000), -3)

# ---------------------------------------------------------------- glitch (difference text)
rng = np.random.default_rng(51)
segs_l, segs_r = [], []
total = 0
while total < int(0.42 * SR):
    n = int(rng.uniform(0.012, 0.045) * SR)
    kind = rng.integers(0, 4)
    tt = np.arange(n) / SR
    if kind == 0:
        s = np.sign(np.sin(2 * np.pi * rng.uniform(180, 1400) * tt)) * 0.6
    elif kind == 1:
        s = np.round(rng.standard_normal(n) * 3) / 3 * 0.5
    elif kind == 2:
        s = np.sin(2 * np.pi * rng.uniform(2000, 5000) * tt) * 0.5
    else:
        s = np.zeros(n)
    s = s * np.hanning(n) ** 0.3
    g = rng.uniform(0.4, 1.0)
    segs_l.append(s * g)
    segs_r.append(np.roll(s, rng.integers(0, 40)) * g * rng.uniform(0.6, 1.0))
    total += n
gl = np.concatenate(segs_l)
gr = np.concatenate(segs_r)
gl = svf(gl, 3000, 0.6, "lp") * 0.7 + gl * 0.3
gr = svf(gr, 3000, 0.6, "lp") * 0.7 + gr * 0.3
save("glitch", gl, gr, -4)

# ---------------------------------------------------------------- reverse swell
rng = np.random.default_rng(61)
t = t_axis(0.75)
u = t / t[-1]
env = u**3.2
x = svf(rng.standard_normal(len(t)), 2500 + 5000 * u, 1.2) * env
tone = np.sin(2 * np.pi * 440 * t) * 0.25 * env + np.sin(2 * np.pi * 660 * t) * 0.15 * env
save("swell", x + tone, np.roll(x, 30) + tone, -3)

# ---------------------------------------------------------------- tape-stop "breath" (soft low drop)
t = t_axis(0.6)
f = 220 * np.exp(-t / 0.25) + 40
x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22) * 0.8
x = reverb(x, 0.8, 0.3, 71, 1500)
save("drop", x, x, -4)
