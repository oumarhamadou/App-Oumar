"""Generate the French voiceover with per-word timestamps.

Usage (from video-oumar/):
    pip install edge-tts
    python scripts/generate_voiceover.py fr      # or: ru

Outputs (for language <lang>):
    public/voiceover/voix-oumar-<lang>.mp3   the narration, one continuous take
    src/voiceover-<lang>.json                 scene ids, word timings (seconds)

The whole script is synthesised in one take so the intonation flows like the
reference; scene boundaries are recovered from the word timestamps.
"""

import asyncio
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import wave

# Behind a TLS-inspecting proxy, edge-tts must trust the proxy's CA bundle.
_ca = os.environ.get("SSL_CERT_FILE")
if _ca:
    import certifi

    certifi.where = lambda: _ca

import edge_tts  # noqa: E402

# Scene ids must match the scenes in src/Video.tsx. The on-screen words of each
# language live in src/locales.ts and refer to the spoken words by index.
LANGS = {
    "fr": {
        "voice": "fr-FR-RemyMultilingualNeural",
        "rate": "+3%",
        # Extra silence (s) after each scene, and an optional cap on any gap.
        "pause_after_comma": 0.08,
        "pause_after_sentence": 0.32,
        "max_gap": None,
        "script": [
            ("intro", "Salut, je suis motion designer,"),
            ("name", "je m'appelle Oumar,"),
            ("challenge", "et je me lance un défi :"),
            ("stepper", "gagner mille dollars grâce au montage vidéo."),
            ("years", "Depuis quelques années,"),
            ("prompt", "je fais ce que j'aime le plus : monter des vidéos."),
            ("dropdown", "Aujourd'hui, j'ai zéro client,"),
            ("segmented", "pas d'audience, pas d'agence derrière moi,"),
            ("messages", "juste une obsession : créer de meilleures vidéos."),
            ("platforms", "Alors, à partir d'aujourd'hui, je publie sur Instagram, X et YouTube."),
            ("keep", "Je vais continuer à créer, continuer à publier, et voir ce qui se passe,"),
            ("client", "jusqu'à décrocher mon premier client."),
            ("calendar", "Honnêtement, je ne sais pas combien de temps ça va prendre."),
            ("exciting", "Et c'est justement ça qui est excitant."),
        ],
    },
    "ru": {
        "voice": "ru-RU-DmitryNeural",
        "rate": "+7%",
        # This voice already pauses for a long time between sentences: shorten those.
        "pause_after_comma": 0.0,
        "pause_after_sentence": 0.1,
        "max_gap": 0.62,
        # Let "Последнее время" finish typing before the next scene.
        "scene_pauses": {"years": 0.35},
        "script": [
            ("intro", "Привет, я моушн-дизайнер,"),
            ("name", "меня зовут Умар,"),
            ("challenge", "и я бросаю себе вызов:"),
            ("stepper", "заработать тысячу долларов на монтаже видео."),
            ("years", "Последнее время"),
            ("prompt", "я занимаюсь тем, что люблю больше всего: монтирую видео."),
            ("dropdown", "Сейчас у меня ноль клиентов,"),
            ("segmented", "ни аудитории, ни агентства за спиной,"),
            ("messages", "только одержимость: делать видео лучше."),
            # Cyrillic spelling so the voice pronounces the names clearly; the screen shows the logos.
            ("platforms", "Поэтому с сегодняшнего дня я публикую в Инстаграм, Тредс и Фейсбук."),
            ("keep", "Я буду продолжать создавать, продолжать публиковать и смотреть, что будет,"),
            ("client", "пока не найду своего первого клиента."),
            ("calendar", "Честно говоря, я не знаю, сколько времени это займёт."),
            ("exciting", "И именно в этом весь азарт."),
        ],
    },
}

LANG = sys.argv[1] if len(sys.argv) > 1 else "fr"
if LANG not in LANGS:
    raise SystemExit(f"Unknown language {LANG!r}; choose one of {', '.join(LANGS)}")
VOICE = LANGS[LANG]["voice"]
RATE = LANGS[LANG]["rate"]
PITCH = "+0Hz"
SCRIPT = LANGS[LANG]["script"]

# Extra silence inserted after each scene, so the edit can breathe like the
# reference. Sentence ends get a longer pause than commas.
PAUSE_AFTER_COMMA = LANGS[LANG]["pause_after_comma"]
PAUSE_AFTER_SENTENCE = LANGS[LANG]["pause_after_sentence"]
MAX_GAP = LANGS[LANG]["max_gap"]
TARGET_LUFS = -16.0

ROOT = pathlib.Path(__file__).resolve().parent.parent
MP3 = ROOT / "public" / "voiceover" / f"voix-oumar-{LANG}.mp3"
JSON_OUT = ROOT / "src" / f"voiceover-{LANG}.json"


async def synthesize(text: str):
    words = []
    communicate = edge_tts.Communicate(
        text, VOICE, rate=RATE, pitch=PITCH, boundary="WordBoundary"
    )
    MP3.parent.mkdir(parents=True, exist_ok=True)
    with open(MP3, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 1e7
                words.append(
                    {
                        "text": chunk["text"],
                        "start": round(start, 3),
                        "end": round(start + chunk["duration"] / 1e7, 3),
                    }
                )
    return words


def ffprobe_duration(path: pathlib.Path) -> float:
    return float(
        subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]
        ).strip()
    )


def integrated_loudness(path: pathlib.Path) -> float:
    log = subprocess.run(
        ["ffmpeg", "-v", "info", "-i", str(path), "-af", "ebur128=framelog=quiet", "-f", "null", "-"],
        capture_output=True,
        text=True,
    ).stderr
    summary = log[log.rfind("Integrated loudness") :]
    return float(summary.split("I:")[1].split("LUFS")[0])


def insert_pauses(scene_words, pauses):
    """Cut the take between scenes, insert (or remove) silence, shift word timings."""
    with tempfile.TemporaryDirectory() as tmp:
        raw = pathlib.Path(tmp) / "raw.wav"
        out = pathlib.Path(tmp) / "out.wav"
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", str(MP3), "-ac", "1", "-ar", "44100", str(raw)])
        with wave.open(str(raw)) as w:
            params = w.getparams()
            data = w.readframes(w.getnframes())
        rate, width = params.framerate, params.sampwidth

        ids = [i for i in scene_words if scene_words[i]]
        chunks, prev, shift = [], 0, 0.0
        for a, b in zip(ids, ids[1:]):
            # Positions in the original take: scene `a` was already shifted, `b` not yet.
            gap_start = scene_words[a][-1]["end"] - shift
            gap_end = scene_words[b][0]["start"]
            cut_t = (gap_start + gap_end) / 2
            pause = pauses[a]
            if MAX_GAP is not None and (gap_end - gap_start) + pause > MAX_GAP:
                pause = MAX_GAP - (gap_end - gap_start)
            cut = int(cut_t * rate) * width
            if pause >= 0:
                chunks.append(data[prev:cut])
                chunks.append(b"\x00" * (int(pause * rate) * width))
                prev = cut
            else:
                # Drop -pause seconds of silence from the middle of the gap.
                half = int(-pause / 2 * rate) * width
                chunks.append(data[prev : cut - half])
                prev = cut + half
            shift += pause
            for w in scene_words[b]:
                w["start"] = round(w["start"] + shift, 3)
                w["end"] = round(w["end"] + shift, 3)
        chunks.append(data[prev:])
        with wave.open(str(out), "wb") as w:
            w.setparams(params)
            w.writeframes(b"".join(chunks))
        # Normalise the narration to ~-16 LUFS (a plain gain + limiter keeps timings intact).
        gain = TARGET_LUFS - integrated_loudness(out)
        subprocess.check_call(
            [
                "ffmpeg", "-v", "error", "-y", "-i", str(out),
                "-af", f"volume={gain:.2f}dB,alimiter=limit=0.9:latency=1",
                "-c:a", "libmp3lame", "-b:a", "160k", str(MP3),
            ]
        )


def main():
    full = ""
    ranges = []
    for scene_id, line in SCRIPT:
        if full:
            full += " "
        ranges.append((scene_id, len(full), len(full) + len(line)))
        full += line

    words = asyncio.run(synthesize(full))

    # Map each spoken word back to the line it came from.
    cursor = 0
    scenes = {scene_id: [] for scene_id, _, _ in ranges}
    for w in words:
        idx = full.find(w["text"], cursor)
        if idx < 0:
            raise SystemExit(f"Could not place word {w['text']!r} after offset {cursor}")
        cursor = idx + len(w["text"])
        scene_id = next(s for s, a, b in ranges if a <= idx < b)
        scenes[scene_id].append(w)

    pauses = {
        scene_id: PAUSE_AFTER_SENTENCE if line.rstrip().endswith((".", ":")) else PAUSE_AFTER_COMMA
        for scene_id, line in SCRIPT
    }
    pauses.update(LANGS[LANG].get("scene_pauses", {}))
    insert_pauses(scenes, pauses)
    duration = ffprobe_duration(MP3)

    out = {
        "lang": LANG,
        "voice": VOICE,
        "durationInSeconds": round(duration, 3),
        "scenes": [
            {"id": scene_id, "text": line, "words": scenes[scene_id]}
            for scene_id, line in SCRIPT
        ],
    }
    JSON_OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    print(f"{MP3.relative_to(ROOT)}: {duration:.2f}s, {len(words)} words")
    for s in out["scenes"]:
        if s["words"]:
            print(f"  {s['id']:<10} {s['words'][0]['start']:6.2f} -> {s['words'][-1]['end']:6.2f}  {s['text']}")


if __name__ == "__main__":
    main()
