import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ease, PaletteName, palettes, sans, serif } from "../../theme";
import { useLayout } from "../../lib/layout";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Layered gradient wipe. Bands cascade across the frame, fully cover it at the
 * midpoint (where the cut underneath happens), then peel away in the same
 * direction. Optional chapter label rides on top at the peak.
 */
export const GradientSweep: React.FC<{
  palette?: PaletteName;
  angle?: number;
  label?: string;
  index?: string;
}> = ({ palette = "aurora", angle = -16, label, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { width, height, u } = useLayout();
  const colors = palettes[palette];

  const n = colors.length;
  const half = durationInFrames / 2;
  const stagger = Math.max(1, Math.round(half * 0.12));
  const travel = half - stagger * (n - 1);
  const diag = Math.hypot(width, height) * 1.25;

  // Lightest band enters first; the darkest, richest band lands on top so the
  // covered frame is a deep gradient that white labels read against.
  const order = [...colors].reverse();
  const bands = order.map((color, i) => {
    const next = order[Math.min(i + 1, n - 1)];
    const top = i === n - 1;
    const inStart = i * stagger;
    const outStart = half + (n - 1 - i) * stagger;
    const enter = interpolate(frame, [inStart, inStart + travel], [-102, 0], {
      ...clamp,
      easing: Easing.bezier(...ease.inOut),
    });
    const exit = interpolate(frame, [outStart, outStart + travel], [0, 102], {
      ...clamp,
      easing: Easing.bezier(...ease.inOut),
    });
    const x = frame < half + (n - 1 - i) * stagger ? enter : exit;
    return (
      <div
        key={color}
        style={{
          position: "absolute",
          inset: 0,
          translate: `${x}% 0%`,
          borderRadius: diag * 0.32,
          background: top
            ? `radial-gradient(ellipse 40% 30% at 62% 46%, ${colors[2]}cc 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 30% 60%, ${colors[3]}66 0%, transparent 70%), linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 60%, ${colors[2]} 100%)`
            : `linear-gradient(90deg, ${color} 0%, ${next} 100%)`,
          boxShadow: `0 0 ${80 * u}px ${18 * u}px ${color}88, inset -${3 * u}px 0 0 rgba(255,255,255,0.35)`,
        }}
      />
    );
  });

  const labelIn = interpolate(frame, [half - stagger * 3, half + stagger], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });
  const labelOut = interpolate(frame, [half + stagger * 2, half + stagger * 5], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.in),
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          width: diag,
          height: diag,
          left: (width - diag) / 2,
          top: (height - diag) / 2,
          rotate: `${angle}deg`,
        }}
      >
        {bands}
      </div>
      {label ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 18 * u,
            opacity: labelIn * (1 - labelOut),
            translate: `0px ${(1 - labelIn) * 40 * u - labelOut * 40 * u}px`,
            filter: `blur(${(1 - labelIn) * 12 * u + labelOut * 14 * u}px)`,
          }}
        >
          {index ? (
            <div
              style={{
                fontFamily: sans,
                fontWeight: 600,
                fontSize: 30 * u,
                letterSpacing: "0.32em",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {index}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: 132 * u,
              lineHeight: 1,
              color: "white",
              letterSpacing: "-0.01em",
              textShadow: `0 ${10 * u}px ${40 * u}px rgba(0,0,0,0.25)`,
            }}
          >
            {label}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
