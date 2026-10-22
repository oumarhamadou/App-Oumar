// Transcribes the footage into word-level captions for the Reel composition.
// Usage: node scripts/transcribe.mjs [public/input.mp4]
// Env: WHISPER_MODEL (default "medium", multilingual), WHISPER_LANG (default auto).
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from "@remotion/install-whisper-cpp";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const input = path.resolve(process.argv[2] ?? "public/input.mp4");
const model = process.env.WHISPER_MODEL ?? "medium";
const language = process.env.WHISPER_LANG ?? null;
const whisperPath = path.resolve("whisper.cpp");
const version = "1.5.5";

if (!fs.existsSync(input)) {
  console.error(`Footage not found: ${input}`);
  process.exit(1);
}

await installWhisperCpp({ to: whisperPath, version });
await downloadWhisperModel({ model, folder: whisperPath });

const wav = path.join(whisperPath, "input-16k.wav");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", input, "-ar", "16000", "-ac", "1", wav]);

const output = await transcribe({
  inputPath: wav,
  whisperPath,
  whisperCppVersion: version,
  model,
  language,
  tokenLevelTimestamps: true,
  splitOnWord: true,
});

const { captions } = toCaptions({ whisperCppOutput: output });
const out = path.resolve("public/captions.json");
fs.writeFileSync(out, JSON.stringify(captions, null, 2));
console.log(`Wrote ${captions.length} words to ${out}`);
