import voiceover from "./voiceover.json";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1080;

/** A scene starts this many seconds before its first spoken word. */
const LEAD_IN = 0.12;
/** How long the last spoken scene holds after its last word. */
const TAIL = 0.55;
/** Length of the closing name card (no voice). */
export const OUTRO_SECONDS = 3.3;

export type SceneId =
  | "intro"
  | "name"
  | "challenge"
  | "stepper"
  | "years"
  | "prompt"
  | "dropdown"
  | "segmented"
  | "messages"
  | "platforms"
  | "keep"
  | "client"
  | "calendar"
  | "exciting"
  | "outro";

type Word = { text: string; start: number; end: number };

const spoken = voiceover.scenes as { id: SceneId; text: string; words: Word[] }[];

const startSeconds = spoken.map((s, i) =>
  i === 0 ? 0 : s.words[0].start - LEAD_IN,
);
const lastWordEnd = spoken[spoken.length - 1].words.slice(-1)[0].end;
const endSeconds = spoken.map((_, i) =>
  i < spoken.length - 1 ? startSeconds[i + 1] : lastWordEnd + TAIL,
);

export type SceneTiming = {
  id: SceneId;
  /** First frame of the scene on the main timeline. */
  from: number;
  durationInFrames: number;
  /** Word timings in frames, relative to the start of the scene. */
  words: { text: string; at: number; end: number }[];
};

const spokenTimings: SceneTiming[] = spoken.map((s, i) => {
  const from = Math.round(startSeconds[i] * FPS);
  const to = Math.round(endSeconds[i] * FPS);
  return {
    id: s.id,
    from,
    durationInFrames: to - from,
    words: s.words.map((w) => ({
      text: w.text,
      at: Math.round(w.start * FPS) - from,
      end: Math.round(w.end * FPS) - from,
    })),
  };
});

const outroFrom = Math.round(endSeconds[endSeconds.length - 1] * FPS);

export const SCENES: SceneTiming[] = [
  ...spokenTimings,
  {
    id: "outro",
    from: outroFrom,
    durationInFrames: Math.round(OUTRO_SECONDS * FPS),
    words: [],
  },
];

export const TOTAL_FRAMES = outroFrom + Math.round(OUTRO_SECONDS * FPS);

export const scene = (id: SceneId): SceneTiming => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) {
    throw new Error(`Unknown scene ${id}`);
  }
  return s;
};

/** Frame (relative to the scene) at which word `i` of a scene starts. */
export const wordAt = (id: SceneId, i: number) => scene(id).words[i].at;

/** Absolute frame on the main timeline at which word `i` of a scene starts. */
export const wordAbs = (id: SceneId, i: number) =>
  scene(id).from + scene(id).words[i].at;
