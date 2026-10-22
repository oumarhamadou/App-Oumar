import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Shared enter/exit envelope for UI cards: a springy arrival with blur and a
 * quick lift-off at the end of the sequence.
 */
export const useCardMotion = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const start = Math.round(delay * fps);
  const k = interpolate(frame, [start, start + Math.round(0.6 * fps)], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 14, mass: 0.7, stiffness: 120 }),
  });
  const blurIn = interpolate(frame, [start, start + Math.round(0.3 * fps)], [1, 0], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });
  const outDur = Math.round(0.3 * fps);
  const out = interpolate(frame, [durationInFrames - outDur, durationInFrames], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.in),
  });
  return { frame, fps, durationInFrames, k, blurIn, out, start };
};
