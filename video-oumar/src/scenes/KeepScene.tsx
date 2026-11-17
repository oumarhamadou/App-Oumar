import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_OUT, pop, ramp, reveal } from "../anim";
import { FONT } from "../fonts";
import { KeepToken, useCopy, useScene } from "../locales";

const Line: React.FC<{ tokens: KeepToken[]; frame: number; at: (i: number) => number }> = ({
  tokens,
  frame,
  at,
}) => (
  <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
    {tokens.map((t) => {
      const p = pop(frame, at(t.word) - 3);
      const wipe = ramp(frame, at(t.word) - 3, at(t.word) + 7, EASE_OUT);
      return (
        <span
          key={t.label + t.word}
          style={{
            display: "inline-block",
            color: t.color,
            ...(t.wipe
              ? { clipPath: `inset(-20% ${(1 - wipe) * 100}% -20% 0%)`, translate: `${(1 - wipe) * 12}px 0px` }
              : t.wave
                ? {
                    ...reveal(p, { distance: -70, blur: 12 }),
                    rotate: `${(1 - Math.min(1, p)) * (t.word % 2 === 0 ? 14 : -14)}deg`,
                  }
                : reveal(p)),
          }}
        >
          {t.label}
        </span>
      );
    })}
  </div>
);

// Light, then dark, then dark: the rhythm of the reference.
const LOOKS = [
  { bg: "#F7F7F9", ink: "#0E1116" },
  { bg: "#000000", ink: "#FFFFFF" },
  { bg: "#000000", ink: "#FFFFFF" },
];

/** "Je vais continuer à créer, continuer à publier, et voir ce qui se passe" */
export const KeepScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("keep");
  const copy = useCopy().keep;
  const at = (i: number) => words[i].at;
  const exit = ramp(frame, durationInFrames - 7, durationInFrames, EASE_IN);

  const phases = copy.phases.map((ph, i) => ({
    ...LOOKS[i],
    lines: ph.lines,
    from: i === 0 ? 0 : at(ph.startWord) - 3,
    to: i < copy.phases.length - 1 ? at(copy.phases[i + 1].startWord) - 3 : durationInFrames,
  }));

  const current = phases.find((ph) => frame >= ph.from && frame < ph.to) ?? phases[phases.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: current.bg, fontFamily: FONT }}>
      {phases.map((ph, i) => {
        if (frame < ph.from - 1 || frame >= ph.to + 6) {
          return null;
        }
        const enter = interpolate(frame, [ph.from, ph.from + 6], [0, 1], { ...CLAMP, easing: EASE_OUT });
        const leave = i < phases.length - 1 ? ramp(frame, ph.to - 1, ph.to + 5, EASE_IN) : exit;
        return (
          <AbsoluteFill
            key={i}
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 4,
              color: ph.ink,
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.12,
              translate: `${(1 - enter) * 140 - leave * 260}px 0px`,
              filter: `blur(${(1 - enter) * 10 + leave * 18}px)`,
              opacity: (i === 0 ? 1 : enter) * (1 - leave),
              scale: String(1 + (frame - ph.from) * 0.0015),
            }}
          >
            {ph.lines.map((tokens, li) => (
              <Line key={li} tokens={tokens} frame={frame} at={at} />
            ))}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
