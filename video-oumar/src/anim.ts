import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./timeline";

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

/** Springy 0 → 1 (with a little overshoot) starting at `at`. */
export const pop = (
  frame: number,
  at: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) =>
  spring({
    frame: frame - at,
    fps: FPS,
    config: { damping: 14, stiffness: 170, mass: 0.7, ...config },
  });

/** Smooth 0 → 1 (no overshoot) starting at `at`. */
export const settle = (frame: number, at: number, damping = 200) =>
  spring({ frame: frame - at, fps: FPS, config: { damping } });

/** Eased 0 → 1 between two frames. */
export const ramp = (
  frame: number,
  a: number,
  b: number,
  easing: (t: number) => number = EASE_OUT,
) => interpolate(frame, [a, b], [0, 1], { ...CLAMP, easing });

/** Blurred "pop in" used for words and UI elements. */
export const reveal = (
  p: number,
  options: { distance?: number; blur?: number; fromScale?: number } = {},
): React.CSSProperties => {
  const { distance = 36, blur = 14, fromScale = 0.82 } = options;
  const q = Math.min(Math.max(p, 0), 1);
  return {
    opacity: Math.min(1, Math.max(0, p) * 1.6),
    translate: `0px ${(1 - p) * distance}px`,
    scale: String(fromScale + (1 - fromScale) * p),
    filter: `blur(${(1 - q) * blur}px)`,
  };
};

/** 0 → 1 over the last `length` frames of a scene: drive exit transitions. */
export const outro = (frame: number, durationInFrames: number, length = 7) =>
  ramp(frame, durationInFrames - length, durationInFrames, EASE_IN);

/**
 * How many characters of `text` are typed at `frame`, following the voice:
 * each word's letters appear while that word is spoken.
 */
export const typedCount = (
  text: string,
  words: { text: string; at: number; end: number }[],
  frame: number,
) => {
  let cursor = 0;
  let count = 0;
  for (const w of words) {
    const idx = text.indexOf(w.text, cursor);
    if (idx < 0) {
      continue;
    }
    if (frame < w.at) {
      break;
    }
    const len = w.text.length;
    const span = Math.max(2, w.end - w.at);
    const typed = Math.min(len, Math.floor(((frame - w.at) / span) * len) + 1);
    count = idx + typed;
    cursor = idx + len;
    if (typed === len) {
      // Include trailing punctuation right after a finished word.
      let j = cursor;
      while (j < text.length && /[,.:;!?]/.test(text[j])) {
        j++;
      }
      count = j;
    }
  }
  return count;
};

/** Index of the word being spoken at `frame` (-1 before the first). */
export const activeWord = (words: { at: number }[], frame: number) => {
  let active = -1;
  words.forEach((w, i) => {
    if (frame >= w.at) {
      active = i;
    }
  });
  return active;
};
