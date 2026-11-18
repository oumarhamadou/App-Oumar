import { createContext, useContext } from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const overshoot = Easing.bezier(0.34, 1.56, 0.64, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 progress between two frames. */
export const prog = (
  f: number,
  start: number,
  dur: number,
  easing: (t: number) => number = easeOut,
) => interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing });

type Key = readonly [frame: number, value: number, easing?: (t: number) => number];

/** Piecewise keyframes, each segment with its own easing (easing applies to the segment ending at that key). */
export const keys = (f: number, ks: readonly Key[]) => {
  if (f <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    const [f1, v1, e] = ks[i];
    const [f0, v0] = ks[i - 1];
    if (f <= f1) {
      return interpolate(f, [f0, f1], [v0, v1], { ...clamp, easing: e ?? easeInOut });
    }
  }
  return ks[ks.length - 1][1];
};

/** Deterministic camera-shake style jitter that decays after `start`. */
export const jitter = (f: number, start: number, dur: number, amp: number, seed: string) => {
  if (f < start || f > start + dur) return 0;
  const decay = 1 - (f - start) / dur;
  return (random(`${seed}-${f}`) - 0.5) * 2 * amp * decay * decay;
};

// Phrases are <Sequence>s (named in the Studio timeline) but words keep using
// absolute frame numbers from constants.ts, so we pass the sequence offset down.
export const OffsetContext = createContext(0);
export const useGlobalFrame = () => useCurrentFrame() + useContext(OffsetContext);
