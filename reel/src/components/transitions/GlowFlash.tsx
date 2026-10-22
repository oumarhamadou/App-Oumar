import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PaletteName, palettes } from "../../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Soft "dip to light": drifting gradient orbs bloom over the footage with a
 * screen blend and a brief white core. It never fully covers the frame, so it
 * works on a continuous take without hiding the speaker.
 */
export const GlowFlash: React.FC<{ palette?: PaletteName }> = ({ palette = "aurora" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = palettes[palette];
  const mid = durationInFrames / 2;

  const bloom = interpolate(frame, [0, mid, durationInFrames], [0, 1, 0], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const core = interpolate(frame, [mid - 3, mid, mid + 4], [0, 0.4, 0], clamp);
  const drift = interpolate(frame, [0, durationInFrames], [-8, 8]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: bloom,
          scale: String(1.25 - bloom * 0.2),
          background: [
            `radial-gradient(circle at ${20 + drift}% 18%, ${p[1]} 0%, transparent 46%)`,
            `radial-gradient(circle at ${82 - drift}% 40%, ${p[3]} 0%, transparent 44%)`,
            `radial-gradient(circle at ${35 + drift}% 82%, ${p[2]} 0%, transparent 48%)`,
            `radial-gradient(circle at 60% 60%, ${p[4]} 0%, transparent 38%)`,
          ].join(", "),
        }}
      />
      <AbsoluteFill style={{ background: "white", opacity: core, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
