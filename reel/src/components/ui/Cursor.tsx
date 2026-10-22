import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../../theme";
import { useLayout } from "../../lib/layout";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** macOS-style pointer gliding along an arc, then clicking with a ripple. */
export const Cursor: React.FC<{
  from: [number, number];
  to: [number, number];
  /** Seconds after the sequence start when the click lands. */
  clickAt?: number;
}> = ({ from, to, clickAt = 0.9 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { width, height, u } = useLayout();
  const click = Math.round(clickAt * fps);

  const move = interpolate(frame, [0, click - Math.round(0.08 * fps)], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.inOut),
  });
  // Bow the path upward so it feels hand-driven, not linear.
  const arc = Math.sin(move * Math.PI) * -6;
  const x = ((from[0] + (to[0] - from[0]) * move) / 100) * width;
  const y = ((from[1] + (to[1] - from[1]) * move + arc) / 100) * height;

  const press = interpolate(frame, [click - 2, click, click + 4], [1, 0.82, 1], clamp);
  const ripple = interpolate(frame, [click, click + Math.round(0.45 * fps)], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });
  const appear = interpolate(frame, [0, 6, durationInFrames - 6, durationInFrames], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: appear }}>
      {frame >= click ? (
        <div
          style={{
            position: "absolute",
            left: x - 70 * u,
            top: y - 70 * u,
            width: 140 * u,
            height: 140 * u,
            borderRadius: "50%",
            border: `${3 * u}px solid rgba(255,255,255,0.9)`,
            scale: String(0.2 + ripple * 0.8),
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg
        width={64 * u}
        height={64 * u}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x - 8 * u,
          top: y - 4 * u,
          scale: String(press),
          transformOrigin: "20% 15%",
          filter: `drop-shadow(0 ${6 * u}px ${10 * u}px rgba(0,0,0,0.45))`,
        }}
      >
        <path
          d="M5 2.5v17.2l4.4-4.1 2.9 6.6 2.7-1.2-2.9-6.5H18L5 2.5z"
          fill="black"
          stroke="white"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
