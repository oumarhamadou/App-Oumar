#!/usr/bin/env bash
# Synthesise the soundtrack, then master it to -14 LUFS / -1 dBTP (two-pass loudnorm).
set -euo pipefail
cd "$(dirname "$0")/.."
raw="$(mktemp --suffix=.wav)"
python3 scripts/make_soundtrack.py "$raw"
stats=$(ffmpeg -hide_banner -i "$raw" -af loudnorm=I=-14:TP=-1.0:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
read -r i tp lra th off < <(python3 -c 'import json,sys; d=json.loads(sys.argv[1]); print(d["input_i"], d["input_tp"], d["input_lra"], d["input_thresh"], d["target_offset"])' "$stats")
ffmpeg -hide_banner -loglevel error -y -i "$raw" \
  -af "loudnorm=I=-14:TP=-1.0:LRA=9:measured_I=$i:measured_TP=$tp:measured_LRA=$lra:measured_thresh=$th:offset=$off:linear=true,aresample=44100" \
  -c:a pcm_s16le public/audio/soundtrack.wav
rm -f "$raw"
echo "public/audio/soundtrack.wav ready"
