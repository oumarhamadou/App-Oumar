"""Build RGBA foreground cutouts (person + mic) used to put words *behind* the subject.

Usage:
  1. ffmpeg -i public/source.mp4 -start_number 0 FRAMES/%04d.png
  2. Segment every frame with RMBG-1.4 (briaai/RMBG-1.4, onnx/model.onnx) into MASKS/%04d.png
  3. python3 scripts/make_cutouts.py FRAMES MASKS public/fg

Masks are smoothed over time (inside each shot only, so the 9.6 s cut is not
blurred together) and slightly tightened to avoid a halo around the hair.
"""

import os
import sys

import numpy as np
from PIL import Image

frames_dir, masks_dir, out_dir = sys.argv[1:4]
CUT = 288  # first frame of the close-up shot
os.makedirs(out_dir, exist_ok=True)

names = sorted(os.listdir(masks_dir))
masks = [np.asarray(Image.open(os.path.join(masks_dir, n))).astype(np.float32) / 255 for n in names]
n = len(masks)

for i, name in enumerate(names):
    shot_lo, shot_hi = (0, CUT - 1) if i < CUT else (CUT, n - 1)
    acc = np.zeros_like(masks[i])
    wsum = 0.0
    for d, w in ((-2, 0.1), (-1, 0.2), (0, 0.4), (1, 0.2), (2, 0.1)):
        j = min(max(i + d, shot_lo), shot_hi)
        acc += masks[j] * w
        wsum += w
    m = acc / wsum
    m = np.clip((m - 0.18) / 0.72, 0, 1)  # tighten edges
    rgb = Image.open(os.path.join(frames_dir, name)).convert("RGB")
    rgba = rgb.copy()
    rgba.putalpha(Image.fromarray((m * 255).astype(np.uint8)))
    rgba.save(os.path.join(out_dir, os.path.splitext(name)[0] + ".webp"), quality=88, method=4)
print("done", n)
