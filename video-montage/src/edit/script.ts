/**
 * Edit decision list for the montage (25 fps, 1920x1440).
 * Word timings come from a word-level transcription of the source clip,
 * snapped to the speech onsets in the audio envelope.
 *
 * Transcript: "There's a quote that I've fallen in love with.
 *              The magic you are looking for is in the work you're avoiding.
 *              Fuck, dude."
 */

export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1440;
export const DURATION = 196; // 7.84 s, the full source clip

/**
 * sm    small white grotesk (connective words)
 * md    medium white grotesk
 * lg    large white grotesk
 * serif gold condensed italic serif (accent words, like the reference)
 * diff  heavy white grotesk with the "Difference" blend mode
 */
export type WordStyle = "sm" | "md" | "lg" | "serif" | "diff";

export type Word = {
  text: string;
  /** Frame at which the word pops in. */
  at: number;
  style: WordStyle;
  /** Optional font-size override in px. */
  size?: number;
};

export type Line = {
  words: Word[];
  /** Horizontal offset of the line inside its stack, in px. */
  x?: number;
  /** Vertical nudge (usually negative: stacked lines overlap like the reference). */
  y?: number;
};

export type Stack = {
  name: string;
  /** Frame the stack is cleared. */
  until: number;
  left: number;
  top: number;
  lines: Line[];
};

export const STACKS: Stack[] = [
  {
    name: "There's a quote",
    until: 66,
    left: 1350,
    top: 540,
    lines: [
      { words: [{ text: "There's", at: 2, style: "sm" }, { text: "a", at: 6, style: "sm" }], x: 14 },
      { words: [{ text: "quote", at: 14, style: "serif", size: 250 }], x: 40, y: -58 },
    ],
  },
  {
    name: "that I've fallen in love with",
    until: 66,
    left: 1360,
    top: 800,
    lines: [
      { words: [{ text: "that", at: 22, style: "sm" }, { text: "I've", at: 24, style: "sm" }], x: 150 },
      { words: [{ text: "fallen", at: 28, style: "md" }, { text: "in", at: 39, style: "md" }], x: 0, y: -16 },
      { words: [{ text: "love", at: 44, style: "diff", size: 190 }], x: 40, y: -40 },
      { words: [{ text: "with.", at: 48, style: "sm" }], x: 330, y: -36 },
    ],
  },
  {
    name: "The",
    until: 97,
    left: 1420,
    top: 250,
    lines: [{ words: [{ text: "The", at: 68, style: "sm" }] }],
  },
  {
    name: "you are looking for",
    until: 97,
    left: 1400,
    top: 760,
    lines: [
      { words: [{ text: "you", at: 78, style: "sm" }, { text: "are", at: 83, style: "sm" }], x: 20 },
      { words: [{ text: "looking", at: 87, style: "md", size: 140 }], x: 0, y: -18 },
      { words: [{ text: "for", at: 92, style: "sm" }], x: 260, y: -26 },
    ],
  },
  {
    name: "is in the work you're avoiding",
    until: 147,
    left: 1350,
    top: 380,
    lines: [
      {
        words: [
          { text: "is", at: 98, style: "sm" },
          { text: "in", at: 108, style: "sm" },
          { text: "the", at: 112, style: "sm" },
        ],
        x: 40,
      },
      { words: [{ text: "work", at: 116, style: "diff", size: 236 }], x: 0, y: -40 },
      { words: [{ text: "you're", at: 125, style: "sm" }], x: 300, y: -14 },
      { words: [{ text: "avoiding.", at: 130, style: "serif", size: 160 }], x: -10, y: -44 },
    ],
  },
  {
    name: "Fuck, dude",
    until: DURATION + 10,
    left: 1300,
    top: 700,
    lines: [
      // Censored on screen only (the audio is untouched) to keep reach on IG/TikTok.
      { words: [{ text: "F*ck,", at: 170, style: "diff", size: 220 }] },
      { words: [{ text: "dude.", at: 188, style: "serif", size: 210 }], x: 190, y: -30 },
    ],
  },
];

/** Big words placed BEHIND the speaker (between the plate and the cut-out), in Difference mode. */
export type BackgroundWord = {
  name: string;
  text: string;
  from: number;
  until: number;
  left: number;
  top: number;
  size: number;
  font: "sans" | "serif";
};

export const BACKGROUND_WORDS: BackgroundWord[] = [
  { name: "Quote mark", text: "\u201C", from: 14, until: 66, left: 1035, top: -52, size: 2040, font: "serif" },
  { name: "magic", text: "magic", from: 70, until: 97, left: 1150, top: 250, size: 300, font: "serif" },
];

/** Scrolling wall of "AVOIDING" behind the speaker during the silent beat. */
export const WALL = { from: 141, until: 170, text: "AVOIDING" };

/**
 * Virtual camera: punch-ins and pushes on the single source shot.
 * Each segment interpolates `scale` linearly between `from`/`to`;
 * transitions between segments are fast eased zooms with a touch of blur.
 */
export type CameraKey = { frame: number; scale: number; ox: number; oy: number; cut?: boolean };

export const CAMERA: CameraKey[] = [
  { frame: 0, scale: 1.1, ox: 1250, oy: 450 },
  { frame: 9, scale: 1.02, ox: 1250, oy: 450 },
  { frame: 64, scale: 1.05, ox: 1250, oy: 450 },
  // zoom in: "The magic"
  { frame: 68, scale: 1.15, ox: 1250, oy: 450 },
  { frame: 95, scale: 1.18, ox: 1250, oy: 450 },
  // zoom out: "is in the work"
  { frame: 99, scale: 1.02, ox: 1250, oy: 450 },
  { frame: 126, scale: 1.06, ox: 1250, oy: 450 },
  // zoom in: "you're avoiding" + slow push through the silent beat
  { frame: 130, scale: 1.12, ox: 1250, oy: 450 },
  { frame: 169, scale: 1.24, ox: 1250, oy: 450 },
  // hard punch-in on the face: "Fuck, dude."
  { frame: 170, scale: 1.3, ox: 760, oy: 560, cut: true },
  { frame: 196, scale: 1.35, ox: 760, oy: 560 },
];

/** Frames where a fast zoom transition happens (used for motion blur + whoosh). */
export const ZOOM_TRANSITIONS: [number, number][] = [
  [0, 9],
  [64, 68],
  [95, 99],
  [126, 130],
];

/** Sound design: kept well under the voice. Volumes are linear gain on files peaking at -3 dBFS. */
export type Sfx = { file: string; at: number; volume: number };

export const SFX: Sfx[] = [
  { file: "whoosh.wav", at: 0, volume: 0.1 },
  { file: "boom.wav", at: 14, volume: 0.22 },
  { file: "pop.wav", at: 14, volume: 0.1 },
  { file: "pop.wav", at: 44, volume: 0.08 },
  { file: "whoosh.wav", at: 61, volume: 0.14 },
  { file: "boom.wav", at: 70, volume: 0.2 },
  { file: "pop.wav", at: 87, volume: 0.07 },
  { file: "whoosh.wav", at: 92, volume: 0.12 },
  { file: "pop.wav", at: 116, volume: 0.09 },
  { file: "whoosh.wav", at: 123, volume: 0.12 },
  { file: "pop.wav", at: 130, volume: 0.08 },
  { file: "boom.wav", at: 141, volume: 0.24 },
  { file: "riser.wav", at: 143, volume: 0.13 },
  { file: "swish.wav", at: 169, volume: 0.12 },
  { file: "pop.wav", at: 188, volume: 0.07 },
];
