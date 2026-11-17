import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_OUT, pop, ramp, reveal } from "../anim";
import { FONT } from "../fonts";
import { scene } from "../timeline";

type Token = { text: string; word: number; color?: string; wipe?: boolean; wave?: boolean };

const Line: React.FC<{ tokens: Token[]; frame: number; at: (i: number) => number }> = ({
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
          key={t.text + t.word}
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
          {t.text}
        </span>
      );
    })}
  </div>
);

/** "Je vais continuer à créer, continuer à publier, et voir ce qui se passe" */
export const KeepScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = scene("keep");
  const at = (i: number) => words[i].at;
  const b1 = at(5) - 3;
  const b2 = at(8) - 3;
  const exit = ramp(frame, durationInFrames - 7, durationInFrames, EASE_IN);

  const phases: { from: number; to: number; bg: string; ink: string; lines: Token[][] }[] = [
    {
      from: 0,
      to: b1,
      bg: "#F7F7F9",
      ink: "#0E1116",
      lines: [
        [
          { text: "Je", word: 0 },
          { text: "vais", word: 1 },
          { text: "continuer", word: 2 },
        ],
        [
          { text: "à", word: 3 },
          { text: "créer", word: 4, color: "#F2665A", wipe: true },
        ],
      ],
    },
    {
      from: b1,
      to: b2,
      bg: "#000000",
      ink: "#FFFFFF",
      lines: [
        [{ text: "continuer", word: 5 }],
        [
          { text: "à", word: 6 },
          { text: "publier", word: 7, color: "#4C8DFF", wipe: true },
        ],
      ],
    },
    {
      from: b2,
      to: durationInFrames,
      bg: "#000000",
      ink: "#FFFFFF",
      lines: [
        [
          { text: "et", word: 8, wave: true },
          { text: "voir", word: 9, wave: true },
        ],
        [
          { text: "ce", word: 10, wave: true },
          { text: "qui", word: 11, wave: true },
          { text: "se", word: 12, wave: true, color: "#FF4D5E" },
          { text: "passe", word: 13, wave: true, color: "#FF4D5E" },
        ],
      ],
    },
  ];

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
