import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS, SERIF } from "./fonts";
import type { Stack, Word, WordStyle } from "./script";

const GOLD = "#F4C542";
const SHADOW = "0 6px 28px rgba(0,0,0,0.38), 0 2px 6px rgba(0,0,0,0.28)";
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

const base: Record<WordStyle, React.CSSProperties> = {
  sm: { fontFamily: SANS, fontWeight: 700, fontSize: 78, letterSpacing: "-0.045em", color: "white", textShadow: SHADOW },
  md: { fontFamily: SANS, fontWeight: 800, fontSize: 126, letterSpacing: "-0.055em", color: "white", textShadow: SHADOW },
  lg: { fontFamily: SANS, fontWeight: 900, fontSize: 160, letterSpacing: "-0.06em", color: "white", textShadow: SHADOW },
  serif: { fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 220, letterSpacing: "-0.015em", color: GOLD, textShadow: "0 8px 30px rgba(0,0,0,0.35)" },
  // Premiere-style "Difference" blend: pure white inverts whatever is underneath.
  diff: { fontFamily: SANS, fontWeight: 900, fontSize: 200, letterSpacing: "-0.06em", color: "white", mixBlendMode: "difference" },
};

const WordView: React.FC<{ word: Word; until: number; last: boolean }> = ({ word, until, last }) => {
  const frame = useCurrentFrame();
  const t = frame - word.at;
  const accent = word.style === "serif" || word.style === "diff";
  const enterDur = accent ? 9 : 6;

  const enter = interpolate(t, [0, enterDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: outExpo,
  });
  const exit = interpolate(frame, [until - 4, until], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const visible = interpolate(t, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const style = base[word.style];
  return (
    <span
      style={{
        ...style,
        fontSize: word.size ?? style.fontSize,
        display: "inline-block",
        marginRight: last ? 0 : "0.2em",
        opacity: visible * (1 - exit),
        filter: `blur(${(1 - enter) * 12 + exit * 10}px)`,
        translate: `0px ${(1 - enter) * 28 - exit * 16}px`,
        scale: String(1 + (1 - enter) * (accent ? 0.28 : 0.14)),
        transformOrigin: "50% 70%",
      }}
    >
      {word.text}
    </span>
  );
};

export const StackView: React.FC<{ stack: Stack }> = ({ stack }) => {
  return (
    // No opacity/transform here: the stack must not create a stacking context,
    // otherwise the "difference" words could not blend with the footage.
    <div style={{ position: "absolute", left: stack.left, top: stack.top }}>
      {stack.lines.map((line, i) => (
        <div
          key={i}
          style={{
            marginLeft: line.x ?? 0,
            marginTop: line.y ?? 0,
            whiteSpace: "nowrap",
            lineHeight: 0.92,
          }}
        >
          {line.words.map((w, j) => (
            <WordView key={j} word={w} until={stack.until} last={j === line.words.length - 1} />
          ))}
        </div>
      ))}
    </div>
  );
};
