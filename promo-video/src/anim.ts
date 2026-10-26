import { Easing, interpolate } from "remotion";
import { EASE_IN_OUT, EASE_OUT } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 between `start` and `start + duration`, Apple-style ease-out. */
export const rise = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE_OUT),
  });

/** 0 → 1 with a symmetric ease, for camera moves. */
export const glide = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...EASE_IN_OUT),
  });

/** 0 → 1 with a slightly overshooting spring, for pops. */
export const pop = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 12, stiffness: 140, mass: 0.8 }),
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
