"""Synthesise the small UI sound effects (pop, typing) used in the video.

Usage (from video-oumar/):  python scripts/generate_sfx.py   (needs numpy)
"""

import pathlib
import wave

import numpy as np

SR = 44100
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(3)


def write(name: str, sig: np.ndarray):
    sig = sig / (np.max(np.abs(sig)) + 1e-9) * 0.9
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((sig * 32767).astype("<i2").tobytes())


def pop():
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f = 380 + 900 * (1 - np.exp(-t * 60))
    phase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(phase) * np.exp(-t * 32) * np.minimum(1, t / 0.002)


def key_click():
    n = int(0.035 * SR)
    t = np.arange(n) / SR
    noise = rng.uniform(-1, 1, n)
    body = np.sin(2 * np.pi * rng.uniform(1700, 2600) * t)
    return (0.6 * noise + 0.5 * body) * np.exp(-t * 160)


def typing(duration=3.0, cps=15):
    out = np.zeros(int(duration * SR))
    t = 0.02
    while t < duration - 0.05:
        c = key_click() * rng.uniform(0.5, 1.0)
        i = int(t * SR)
        out[i : i + len(c)] += c[: len(out) - i]
        t += rng.uniform(0.6, 1.4) / cps
    return out


OUT.mkdir(parents=True, exist_ok=True)
write("pop.wav", pop())
write("typing.wav", typing())
print("Wrote pop.wav, typing.wav")
