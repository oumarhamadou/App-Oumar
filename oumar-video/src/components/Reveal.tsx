import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { clamp, easeOut } from "../theme";

// Word arrival from the motion reference: the word slides in from the right,
// sharpens from a blur and arrives tinted before settling to its colour.
// Its layout width grows from 0 (inline-grid fr trick), so a centred line
// glides sideways to make room for every new word.
export const Word: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  tint?: string;
  space?: boolean;
}> = ({ at, children, style, tint = "#34C759", space = true }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [at, at + 9], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const settle = interpolate(frame, [at, at + 14], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const base = (style?.color as string | undefined) ?? "#0B0B0C";
  const color =
    base === "transparent"
      ? base
      : interpolateColors(settle, [0, 0.55, 1], [tint, tint, base]);

  return (
    <span style={{ display: "inline-grid", gridTemplateColumns: `${grow}fr` }}>
      <span
        style={{
          minWidth: 0,
          whiteSpace: "nowrap",
          paddingRight: space ? "0.24em" : 0,
          ...style,
          color,
          opacity: settle,
          filter: `blur(${(1 - settle) * 14}px)`,
          translate: `${(1 - settle) * 0.6}em ${(1 - settle) * 0.22}em`,
        }}
      >
        {children}
      </span>
    </span>
  );
};

// A line whose height grows from 0 when it starts, so the whole text block
// re-centres vertically as lines are added.
export const Line: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [at, at + 9], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  return (
    <div style={{ display: "grid", gridTemplateRows: `${grow}fr` }}>
      <div
        style={{
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Whole-block exit used between beats: blur + fade + slight drift.
export const exitStyle = (
  frame: number,
  at: number,
  duration = 10,
): React.CSSProperties => {
  const t = interpolate(frame, [at, at + duration], [0, 1], clamp);
  return {
    opacity: 1 - t,
    filter: `blur(${t * 26}px)`,
    scale: `${1 + t * 0.06}`,
  };
};
