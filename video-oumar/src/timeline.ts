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

/** Shape of src/voiceover-<lang>.json, written by scripts/generate_voiceover.py. */
export type Voiceover = {
  lang: string;
  voice: string;
  durationInSeconds: number;
  scenes: { id: string; text: string; words: Word[] }[];
};

export type SceneTiming = {
  id: SceneId;
  /** What the voice says during this scene. */
  text: string;
  /** First frame of the scene on the main timeline. */
  from: number;
  durationInFrames: number;
  /** Word timings in frames, relative to the start of the scene. */
  words: { text: string; at: number; end: number }[];
};

/** Derive every scene's position and word timings from a voiceover. */
export const buildTimeline = (voiceover: Voiceover) => {
  const spoken = voiceover.scenes as { id: SceneId; text: string; words: Word[] }[];

  const startSeconds = spoken.map((s, i) => (i === 0 ? 0 : s.words[0].start - LEAD_IN));
  const lastWordEnd = spoken[spoken.length - 1].words.slice(-1)[0].end;
  const endSeconds = spoken.map((_, i) =>
    i < spoken.length - 1 ? startSeconds[i + 1] : lastWordEnd + TAIL,
  );

  const spokenTimings: SceneTiming[] = spoken.map((s, i) => {
    const from = Math.round(startSeconds[i] * FPS);
    const to = Math.round(endSeconds[i] * FPS);
    return {
      id: s.id,
      text: s.text,
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
  const scenes: SceneTiming[] = [
    ...spokenTimings,
    {
      id: "outro",
      text: "",
      from: outroFrom,
      durationInFrames: Math.round(OUTRO_SECONDS * FPS),
      words: [],
    },
  ];

  const scene = (id: SceneId): SceneTiming => {
    const s = scenes.find((x) => x.id === id);
    if (!s) {
      throw new Error(`Unknown scene ${id}`);
    }
    return s;
  };

  return {
    scenes,
    totalFrames: outroFrom + Math.round(OUTRO_SECONDS * FPS),
    scene,
    /** Absolute frame on the main timeline at which word `i` of a scene starts. */
    wordAbs: (id: SceneId, i: number) => scene(id).from + scene(id).words[i].at,
  };
};

export type Timeline = ReturnType<typeof buildTimeline>;
