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
 * Pill-shaped gradient columns rise in sequence, lock together into a full
 * gradient wall, then continue upward and out: the classic SaaS "bars" wipe.
 */
export const PrismBars: React.FC<{
  palette?: PaletteName;
  bars?: number;
  direction?: "up" | "down";
}> = ({ palette = "sunset", bars = 6, direction = "up" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { width, height, u } = useLayout();
  const colors = palettes[palette];

  const half = durationInFrames / 2;
  const stagger = Math.max(1, Math.round(half * 0.1));
  const travel = half - stagger * (bars - 1);
  const barWidth = width / bars;
  const sign = direction === "up" ? 1 : -1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: bars }, (_, i) => {
        const inStart = i * stagger;
        const outStart = half + i * stagger;
        const enter = interpolate(frame, [inStart, inStart + travel], [115, 0], {
          ...clamp,
          easing: Easing.bezier(...ease.inOut),
        });
        const exit = interpolate(frame, [outStart, outStart + travel], [0, -115], {
          ...clamp,
          easing: Easing.bezier(...ease.inOut),
        });
        const y = (frame < outStart ? enter : exit) * sign;
        // Spread the palette across the columns so the wall reads as one gradient.
        const a = colors[Math.floor((i / bars) * (colors.length - 1))];
        const b = colors[Math.ceil(((i + 1) / bars) * (colors.length - 1))];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * barWidth - 1,
              width: barWidth + 2,
              top: -barWidth / 2,
              height: height + barWidth,
              translate: `0px ${y}%`,
              borderRadius: barWidth / 2,
              background: `linear-gradient(${direction === "up" ? 180 : 0}deg, ${b}, ${a} 60%, ${a})`,
              boxShadow: `0 0 ${40 * u}px ${a}aa, inset 0 ${4 * u * sign}px 0 rgba(255,255,255,0.3)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
