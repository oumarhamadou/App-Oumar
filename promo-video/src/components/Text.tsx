import React from "react";
import { useCurrentFrame } from "remotion";
import { rise } from "../anim";
import { C } from "../theme";

/** Words fade up out of a blur, one after another (Apple keynote style). */
export const Words: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ text, start, stagger = 4, duration = 22, style }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "0.26em",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const p = rise(frame, start + i * stagger, duration);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              translate: `0 ${(1 - p) * 0.45}em`,
              filter: `blur(${(1 - p) * 14}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const SHIMMER = `linear-gradient(90deg, ${C.blue}, ${C.violet}, ${C.pink}, ${C.orange}, ${C.pink}, ${C.violet}, ${C.blue})`;

/** A gradient headline revealed by a soft left-to-right sweep, with a slow colour drift. */
export const GradientLine: React.FC<{
  text: string;
  start: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ text, start, duration = 30, style }) => {
  const frame = useCurrentFrame();
  const p = rise(frame, start, duration);
  const edge = p * 140 - 20;
  return (
    <div
      style={{
        display: "inline-block",
        backgroundImage: SHIMMER,
        backgroundSize: "300% 100%",
        backgroundPosition: `${(frame * 0.35) % 100}% 0`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitMaskImage: `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 20}%)`,
        maskImage: `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 20}%)`,
        filter: `blur(${(1 - p) * 10}px)`,
        scale: `${1.04 - 0.04 * p}`,
        paddingBottom: "0.08em",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Letters rise one by one; each letter carries its slice of the glow gradient. */
export const GradientLetters: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ text, start, stagger = 3, duration = 24, style }) => {
  const frame = useCurrentFrame();
  const letters = Array.from(text);
  const n = letters.length;
  return (
    <div style={{ display: "flex", ...style }}>
      {letters.map((ch, i) => {
        const p = rise(frame, start + i * stagger, duration);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              backgroundImage: SHIMMER,
              backgroundSize: `${n * 300}% 100%`,
              backgroundPosition: `${((i / Math.max(1, n - 1)) * 33 + frame * 0.35) % 100}% 0`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: p,
              translate: `0 ${(1 - p) * 0.5}em`,
              filter: `blur(${(1 - p) * 16}px)`,
              paddingBottom: "0.08em",
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
