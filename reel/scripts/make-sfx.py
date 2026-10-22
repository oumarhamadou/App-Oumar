"""Synthesize the reel's sound-design kit into public/sfx/.

Everything is generated procedurally (no samples, no licensing), 48 kHz stereo.
Run: python3 scripts/make-sfx.py
"""

import os
import wave

import numpy as np

SR = 48_000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)


def t_axis(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR)) / SR


def pink_noise(n: int) -> np.ndarray:
    # Voss-McCartney-ish approximation via spectral shaping.
    white = rng.standard_normal(n)
    spec = np.fft.rfft(white)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    freqs[0] = 1
    spec /= np.sqrt(freqs)
    out = np.fft.irfft(spec, n)
    return out / np.max(np.abs(out))


def bandpass_sweep(signal: np.ndarray, f_start: np.ndarray, q: float) -> np.ndarray:
    """Time-varying biquad band-pass. f_start is a per-sample centre frequency."""
    out = np.zeros_like(signal)
    x1 = x2 = y1 = y2 = 0.0
    for i, x in enumerate(signal):
        w0 = 2 * np.pi * f_start[i] / SR
        alpha = np.sin(w0) / (2 * q)
        b0, b2 = alpha, -alpha
        a0, a1, a2 = 1 + alpha, -2 * np.cos(w0), 1 - alpha
        y = (b0 * x + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1 = x1, x
        y2, y1 = y1, y
        out[i] = y
    return out


def lowpass(signal: np.ndarray, cutoff: float) -> np.ndarray:
    rc = 1 / (2 * np.pi * cutoff)
    alpha = (1 / SR) / (rc + 1 / SR)
    out = np.zeros_like(signal)
    acc = 0.0
    for i, x in enumerate(signal):
        acc += alpha * (x - acc)
        out[i] = acc
    return out


def env_ad(n: int, attack: float, curve_in: float = 2.0, curve_out: float = 2.5) -> np.ndarray:
    """Attack/decay envelope, attack given as fraction of length."""
    x = np.linspace(0, 1, n)
    a = np.clip(x / attack, 0, 1) ** curve_in
    d = np.clip((1 - x) / (1 - attack), 0, 1) ** curve_out
    return np.where(x < attack, a, d)


def fade(sig: np.ndarray, ms_in: float = 2, ms_out: float = 8) -> np.ndarray:
    n_in, n_out = int(ms_in * SR / 1000), int(ms_out * SR / 1000)
    sig = sig.copy()
    if n_in:
        sig[:n_in] *= np.linspace(0, 1, n_in)[:, None] if sig.ndim == 2 else np.linspace(0, 1, n_in)
    if n_out:
        sig[-n_out:] *= np.linspace(1, 0, n_out)[:, None] if sig.ndim == 2 else np.linspace(1, 0, n_out)
    return sig


def pan_sweep(mono: np.ndarray, start: float, end: float) -> np.ndarray:
    """Equal-power pan from start to end (-1 = left, 1 = right)."""
    p = np.linspace(start, end, len(mono))
    angle = (p + 1) * np.pi / 4
    return np.stack([mono * np.cos(angle), mono * np.sin(angle)], axis=1)


def write(name: str, stereo: np.ndarray, peak_db: float = -3.0) -> None:
    if stereo.ndim == 1:
        stereo = np.stack([stereo, stereo], axis=1)
    stereo = fade(stereo)
    stereo = stereo / np.max(np.abs(stereo)) * 10 ** (peak_db / 20)
    data = (stereo * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"  {name}.wav  {len(stereo) / SR:.2f}s")


def whoosh(seconds: float, f_lo: float, f_hi: float, attack: float) -> np.ndarray:
    n = int(seconds * SR)
    x = np.linspace(0, 1, n)
    # Centre frequency rises to the peak then falls back a little: air passing by.
    shape = np.where(x < attack, (x / attack) ** 1.6, 1 - 0.55 * ((x - attack) / (1 - attack)))
    centre = f_lo + (f_hi - f_lo) * shape
    body = bandpass_sweep(pink_noise(n), centre, q=1.4)
    air = bandpass_sweep(rng.standard_normal(n) * 0.25, centre * 2.6, q=3.0)
    mono = (body + air) * env_ad(n, attack, 2.2, 1.8)
    return pan_sweep(mono, -0.7, 0.7)


def sine(freq, t):
    return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(freq, t.shape)) / SR)


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    print("Synthesizing SFX kit ->", os.path.abspath(OUT))

    # Transition whooshes.
    write("whoosh", whoosh(0.75, 260, 2600, 0.55), -2)
    write("whoosh-fast", whoosh(0.38, 400, 3600, 0.5), -3)

    # Riser: rising filtered noise + detuned saw-ish chord gliding up an octave.
    t = t_axis(1.6)
    x = t / t[-1]
    noise = bandpass_sweep(pink_noise(len(t)), 300 + 5200 * x**2.2, q=2.2)
    glide = 220 * 2 ** (x**1.8)
    chord = sum(np.sin(2 * np.pi * np.cumsum(glide * m) / SR) / (k + 1) for k, m in enumerate([1, 1.5, 2, 3.01]))
    riser = (noise * 0.9 + chord * 0.18) * x**2.4
    write("riser", pan_sweep(riser, -0.2, 0.2), -4)

    # Cinematic impact: sub drop + transient crack + dark tail.
    t = t_axis(1.4)
    sub_f = 38 + 72 * np.exp(-t * 9)
    sub = sine(sub_f, t) * np.exp(-t * 2.6)
    crack = rng.standard_normal(len(t)) * np.exp(-t * 90)
    tail = lowpass(pink_noise(len(t)), 900) * np.exp(-t * 4.5) * 0.6
    impact = np.tanh((sub * 1.4 + crack * 0.5 + tail) * 1.6)
    write("impact", impact, -1.5)

    # Text pop: short pitched blip with a soft tick.
    t = t_axis(0.14)
    pop = sine(1100 * np.exp(-t * 18) + 520, t) * np.exp(-t * 38)
    pop += rng.standard_normal(len(t)) * np.exp(-t * 400) * 0.25
    write("pop", pop, -6)

    # UI click: two stacked micro transients, like a premium trackpad click.
    t = t_axis(0.09)
    click = bandpass_sweep(rng.standard_normal(len(t)), np.full(len(t), 3200.0), q=4) * np.exp(-t * 160)
    click += sine(np.full(len(t), 2100.0), t) * np.exp(-t * 120) * 0.35
    second = np.zeros_like(click)
    offset = int(0.028 * SR)
    second[offset:] = click[: len(click) - offset] * 0.45
    write("click", click + second, -6)

    # Typing tick for the search-bar typewriter.
    t = t_axis(0.035)
    tick = bandpass_sweep(rng.standard_normal(len(t)), np.full(len(t), 4800.0), q=5) * np.exp(-t * 260)
    write("tick", tick, -10)

    # Notification chime: two bell-like tones with inharmonic partials.
    t = t_axis(1.1)

    def bell(f0, start):
        tt = np.clip(t - start, 0, None)
        on = (t >= start).astype(float)
        partials = [(1, 1.0, 3.2), (2.76, 0.35, 5.5), (5.4, 0.12, 9.0), (2.0, 0.25, 4.0)]
        return on * sum(a * np.sin(2 * np.pi * f0 * r * tt) * np.exp(-tt * d) for r, a, d in partials)

    chime = bell(1318.5, 0) + bell(1975.5, 0.11) * 0.85
    chime *= np.clip(t / 0.004, 0, 1)
    write("ding", np.stack([chime * 0.9, np.roll(chime, int(0.006 * SR))], axis=1), -5)

    # Shimmer: sparkling high partials for gradient flashes.
    t = t_axis(1.2)
    shimmer = np.zeros_like(t)
    for _ in range(14):
        f = rng.uniform(2400, 7800)
        start = rng.uniform(0, 0.35)
        tt = np.clip(t - start, 0, None)
        shimmer += (t >= start) * np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(4, 9)) * rng.uniform(0.3, 1)
    shimmer *= 1 + 0.4 * np.sin(2 * np.pi * 11 * t)
    write("shimmer", pan_sweep(shimmer, 0.5, -0.5), -9)

    # Soft swipe for UI cards sliding in.
    write("swipe", whoosh(0.28, 900, 5200, 0.35) * 0.8, -9)


if __name__ == "__main__":
    main()
