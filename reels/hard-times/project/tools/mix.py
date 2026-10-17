# Mixes the original voice with synthesized SFX on the edit's timeline.
# Music bed is off (voice-only mix); SFX are kept subtle and the busy typing/tick clusters are dropped.
import numpy as np, soundfile as sf, sys, os
S = sys.argv[1]; SR = 48000; DUR = 34.9; N = int(DUR * SR)
voice, sr = sf.read(f"{S}/voice.wav", dtype="float64"); assert sr == SR
voice = voice[:N] if len(voice) >= N else np.pad(voice, ((0, N - len(voice)), (0, 0)))
db = lambda d: 10 ** (d / 20)
USE_MUSIC = False     # background music bed
SFX_TRIM_DB = -10     # applied on top of each event's gain
KEEP_CLUSTERS = False # typing keys + repeated UI ticks
tt = np.arange(N) / SR

# --- music bed: drop of the track (14.83s) lands on "hard" (9.76s) ---
music = sf.read(f"{S}/broll/music.wav", dtype="float64")[0] if USE_MUSIC else np.zeros((N, 2))
OFF = 14.83 - 9.76
m = music[int(OFF * SR):int(OFF * SR) + N]
m = np.pad(m, ((0, N - len(m)), (0, 0)))
pts = [(0, -45), (0.5, -16), (9.70, -16), (9.76, -20), (33.22, -20), (33.42, -70), (33.66, -70), (33.68, -17), (34.3, -19), (34.9, -34)]
g = np.interp(tt, [p[0] for p in pts], [p[1] for p in pts])
# duck under speech (smoothed voice envelope)
v = np.abs(voice.mean(1)); w = int(0.08 * SR)
env = np.convolve(v, np.ones(w) / w, mode="same")
env = env / (np.percentile(env, 95) + 1e-9)
duck = -4.5 * np.clip(env * 1.4, 0, 1)
m = m * db(g + duck)[:, None] * USE_MUSIC

# --- sfx events: (time, name, gain dB) ---
E = [(0.0, "whoosh", -9), (0.22, "pop", -16), (2.62, "pop", -11), (3.95, "tick", -12), (4.08, "tick", -15),
     (4.33, "click", -6), (4.40, "whoosh", -5), (4.52, "pop", -13),
     (5.85, "swish", -7), (6.12, "pop", -13), (7.55, "swish", -7), (7.82, "pop", -13),
     (9.30, "swish", -7), (9.57, "pop", -13), (9.76, "impact", -11),
     (11.05, "swish", -7), (11.45, "tick", -12), (12.33, "whoosh", -7), (12.72, "pop", -14), (13.53, "whoosh", -8),
     (14.633, "swish", -17), (15.0, "pop", -11), (16.22, "glitch", -7), (16.30, "error", -10),
     (16.34, "tick", -16), (16.48, "tick", -16), (16.62, "tick", -16), (16.76, "tick", -16), (17.38, "glitch", -9),
     (18.55, "swish", -17), (19.02, "pop", -15), (20.20, "suck", -16), (20.24, "thump", -8),
     (21.86, "pop", -11), (21.98, "tick", -16), (22.08, "tick", -16), (22.18, "tick", -16), (22.28, "ding", -12), (22.30, "pop", -13),
     (23.367, "swish", -18), (23.63, "pop", -12), (23.93, "click", -9), (24.03, "click", -6), (24.04, "thump", -11),
     (25.22, "swish", -18), (26.31, "pop", -11), (28.25, "tick", -15), (28.45, "error", -7), (28.84, "swish", -17),
     (29.52, "whoosh", -7), (31.36, "whoosh", -6), (32.38, "riser", -10), (33.68, "impact", -3),
     (33.70, "pop", -13), (33.80, "ding", -15), (34.25, "pop", -13)]
if KEEP_CLUSTERS:
    E += [(3.26 + i * 0.76 / 12, f"key{i % 4}", -15) for i in range(12)]
    E += [(27.45 + i * 0.77 / 10, f"key{(i + 1) % 4}", -15) for i in range(10)]
    E += [(29.95 + i * 0.13, "tick", -19) for i in range(10)]
else:
    # drop the repeated ticks under the status-page rows and the stepper
    E = [e for e in E if not (e[1] == "tick" and any(abs(e[0] - c) < 0.5 for c in (16.5, 22.1)))]
fx = np.zeros((N, 2)); cache = {}
for t0, name, gdb in E:
    if name not in cache:
        x, sr = sf.read(f"{S}/sfx/{name}.wav", dtype="float64"); cache[name] = x
    x = cache[name] * db(gdb + SFX_TRIM_DB); i0 = int(t0 * SR); i1 = min(N, i0 + len(x))
    fx[i0:i1] += x[: i1 - i0]

mixd = voice + m + fx
peak = np.max(np.abs(mixd)); print("peak", peak, "events", len(E))
sf.write(f"{S}/mix_pre.wav", (mixd / max(1.0, peak / 0.98)).astype(np.float32), SR)
