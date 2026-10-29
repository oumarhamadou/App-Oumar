import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeIn, easeOut } from "../theme";

// Apple-style blur reveal: text sharpens into place, then dissolves.
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  exitAt?: number;
  exitDuration?: number;
  dx?: number;
  dy?: number;
  blur?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  delay = 0,
  duration = 18,
  exitAt,
  exitDuration = 10,
  dx = 0,
  dy = 40,
  blur = 16,
  style,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [delay, delay + duration], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const exit =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + exitDuration], [0, 1], {
          ...clamp,
          easing: easeIn,
        });

  return (
    <div
      style={{
        display: "inline-block",
        opacity: enter * (1 - exit),
        filter: `blur(${(1 - enter) * blur + exit * blur}px)`,
        translate: `${(1 - enter) * dx}px ${(1 - enter) * dy - exit * dy * 0.6}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Splits a word into letters that rise in one after another.
export const Letters: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  exitAt?: number;
  dx?: number;
  dy?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 2, exitAt, dx = 0, dy = 60, style }) => {
  return (
    <span style={{ display: "inline-flex", whiteSpace: "pre", ...style }}>
      {text.split("").map((ch, i) => (
        <Reveal
          key={i}
          delay={delay + i * stagger}
          exitAt={exitAt === undefined ? undefined : exitAt + i}
          dx={dx}
          dy={dy}
          blur={14}
        >
          {ch}
        </Reveal>
      ))}
    </span>
  );
};
