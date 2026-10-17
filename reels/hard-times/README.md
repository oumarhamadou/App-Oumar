# Hard Times: Instagram Reel edit

`hard-times-reel.mp4` is a 1080×1920, 30 fps H.264/AAC file, loudness-normalized to −14 LUFS. It runs 34.9 s and keeps the original cuts and the original English audio.
`hard-times-reel.srt` contains the cleaned captions, which you can upload as native Instagram captions.
`cover.jpg` is a suggested Reel cover.

## Edit map

| Time | Line | Visual |
| --- | --- | --- |
| 0.0–2.6 | "There's something about the…" | Card reveal, hook headline ("History runs in a 4-step loop. We're in step 4.") |
| 2.6–4.4 | "What's that lovely quote?" | ⌘K command palette types the search; the cursor clicks the quote |
| 4.4–13.8 | "Strong men make good times… and so it goes." | Zoom into a workflow canvas with 4 nodes holding stock B-roll. The camera pans between the nodes, the connectors draw, then it zooms out to the full loop. The speaker stays visible in a Loom-style bubble |
| 15.0–18.9 | "…a very tumultuous time now." | `status.world` status page flips to MAJOR OUTAGE, followed by an RGB-glitch cut to a stormy sea |
| 19.0–20.2 | Host: "Do you think this is hard times?" | HOST tag |
| 20.2–23.4 | "Yeah. I think this is hard times." | Punch-in, then a phase stepper drops a YOU ARE HERE pin on step 4 |
| 23.4–25.4 | "…very tough out there for people." | Difficulty selector slams to HARD |
| 26.3–29.0 | "…a lack of leadership." | Search for "leadership" returns 0 results, and the panel shakes |
| 29.5–31.6 | "…how countries are being run" | Rotating wireframe globe with alert pins |
| 33.7–34.9 | "These are hard times." | Flash and impact. The stepper returns with "NEXT ↻" on step 1 so the video loops |

Captions use Regular weight for normal words and Heavy for keywords. Keywords are color-coded by phase: blue for strong men, green for good times, orange for weak men and red for hard times.

## Assets and licenses

- **Stock footage and music:** licensed through the invideo stock library from the project "Hard Times Reel — B-roll": a fighter training, a rooftop champagne toast, a man on a couch with his phone, a lightning storm over a city, a stormy sea, and the track "Dark Ambient Hip-Hop Beat". The raw clips are not committed.
- **Sound effects:** synthesized from scratch (`project/tools/sfx.py`).
- **3D emoji:** Microsoft Fluent Emoji (MIT).
- **Globe:** Natural Earth via `world-atlas` (public domain / ISC) rendered with d3-geo.
- **Font:** Inter (SIL OFL), with optical sizing used as a stand-in for SF Pro. Apple's SF Pro download isn't reachable from the build environment, and its license limits it to Apple-platform UI mockups. If you hold a license, set `@font-face` in `project/comp.html` to `SF-Pro-Display-Regular` / `SF-Pro-Display-Heavy` and re-render.

## Re-rendering

The project is an HTML/JS motion-graphics timeline (`project/comp.html` + `project/comp.js`). It is a pure function of time, and Playwright captures it frame by frame (`project/render.mjs`).

1. Put the source frames in `frames/src/0000.jpg…` (`ffmpeg -i source.mov -vf fps=30 -q:v 2 -start_number 0 frames/src/%04d.jpg`). Put the B-roll pack frames in `frames/broll/`, and the assets in `assets/` (fonts, emoji, `d3`, `topojson-client`, `countries-110m.json`, `grain.png`).
2. Serve the folder: `python3 -m http.server 8765 --bind 127.0.0.1`.
3. Run `node render.mjs out/frames 4`.
4. Mix the audio with `python3 tools/mix.py <dir>`. It expects `voice.wav`, `broll/music.wav` and `sfx/*.wav`.
5. Encode: `ffmpeg -framerate 30 -i out/frames/%04d.jpg -i mix_final.wav -c:v libx264 -profile:v high -crf 17 -pix_fmt yuv420p -c:a aac -b:a 320k -movflags +faststart hard-times-reel.mp4`.
