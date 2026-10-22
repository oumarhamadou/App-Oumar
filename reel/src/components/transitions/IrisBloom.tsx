import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ease, PaletteName, palettes } from "../../theme";
import { useLayout } from "../../lib/layout";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Concentric gradient rings bloom out of a point, cover the frame, then each
 * ring opens a soft hole from its centre, rippling the next shot into view.
 */
export const IrisBloom: React.FC<{
  palette?: PaletteName;
  /** Origin in % of the frame. */
  cx?: number;
  cy?: number;
}> = ({ palette = "ocean", cx = 50, cy = 45 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { width, height, u } = useLayout();
  // Light rings bloom first; the deepest ring lands on top at the peak.
  const colors = [...palettes[palette]].reverse();

  const n = colors.length;
  const half = durationInFrames / 2;
  const stagger = Math.max(1, Math.round(half * 0.12));
  const travel = half - stagger * (n - 1);

  // Radius that reaches the farthest corner from the origin.
  const ox = (cx / 100) * width;
  const oy = (cy / 100) * height;
  const radius = Math.max(
    Math.hypot(ox, oy),
    Math.hypot(width - ox, oy),
    Math.hypot(ox, height - oy),
    Math.hypot(width - ox, height - oy),
  ) * 1.08;
  const soft = 70 * u;

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {colors.map((color, i) => {
        const inStart = i * stagger;
        const outStart = half + (n - 1 - i) * stagger;
        const grow = interpolate(frame, [inStart, inStart + travel], [0, 1], {
          ...clamp,
          easing: Easing.bezier(...ease.inOut),
        });
        const hole = interpolate(frame, [outStart, outStart + travel], [0, radius + soft], {
          ...clamp,
          easing: Easing.bezier(...ease.inOut),
        });
        const inner = colors[Math.max(i - 1, 0)];
        return (
          <div
            key={color}
            style={{
              position: "absolute",
              left: ox - radius,
              top: oy - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: "50%",
              scale: String(grow),
              background: `radial-gradient(circle, ${inner} 0%, ${color} 70%)`,
              boxShadow: `0 0 ${60 * u}px ${10 * u}px ${color}99`,
              maskImage:
                hole > 0
                  ? `radial-gradient(circle, transparent ${Math.max(0, hole - soft)}px, black ${hole}px)`
                  : undefined,
              WebkitMaskImage:
                hole > 0
                  ? `radial-gradient(circle, transparent ${Math.max(0, hole - soft)}px, black ${hole}px)`
                  : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
