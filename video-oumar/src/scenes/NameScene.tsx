import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { outro, pop, ramp, reveal } from "../anim";
import { Sparkle } from "../components/shapes";
import { FONT } from "../fonts";
import { useCopy, useScene } from "../locales";

const SPARKLES = [
  { x: 205, y: 300, size: 46, delay: 2 },
  { x: 880, y: 330, size: 70, delay: 6 },
  { x: 175, y: 735, size: 64, delay: 10 },
  { x: 900, y: 760, size: 84, delay: 4 },
  { x: 760, y: 215, size: 30, delay: 12 },
];

/** "je m'appelle Oumar" on a soft blue gradient, with twinkling sparkles. */
export const NameScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("name");
  const enter = ramp(frame, 0, 9);
  const exit = outro(frame, durationInFrames, 8);
  const { lead, name, nameWord } = useCopy().name;

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background:
          "radial-gradient(circle at 50% 52%, #A9D0FF 0%, #5C9FF6 38%, #2F7BE8 72%, #2167D8 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          scale: String(1.12 - enter * 0.12 - exit * 0.45),
          filter: `blur(${(1 - enter) * 12 + exit * 16}px)`,
          opacity: 1 - exit,
        }}
      >
        {SPARKLES.map((s) => {
          const p = pop(frame, s.delay, { damping: 10, stiffness: 140 });
          return (
            <div
              key={`${s.x}-${s.y}`}
              style={{
                position: "absolute",
                left: s.x - s.size / 2,
                top: s.y - s.size / 2,
                scale: String(Math.max(0, p) * (0.85 + 0.15 * Math.sin((frame + s.delay * 9) / 6))),
                rotate: `${frame * 1.5 + s.delay * 20}deg`,
                filter: "drop-shadow(0 0 14px rgba(255,255,255,0.75))",
              }}
            >
              <Sparkle size={s.size} />
            </div>
          );
        })}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "white",
          }}
        >
          <div style={{ display: "flex", gap: 22 }}>
            {lead.map(({ label, word }, i) => (
              <span
                key={label}
                style={{
                  display: "inline-block",
                  fontSize: 78,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  translate: `0px ${i === 1 ? -8 : 6}px`,
                  textShadow: "0 6px 30px rgba(10,40,120,0.25)",
                  ...reveal(pop(frame, words[word].at - 3)),
                }}
              >
                {label}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: -6 }}>
            {name.split("").map((ch, i) => {
              const p = pop(frame, words[nameWord].at - 3 + i * 2, { damping: 11, stiffness: 190 });
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    fontSize: 210,
                    fontWeight: 800,
                    letterSpacing: "-0.045em",
                    textShadow: "0 10px 40px rgba(10,40,120,0.3)",
                    rotate: `${(1 - p) * -14}deg`,
                    ...reveal(p, { distance: 90, blur: 18, fromScale: 0.6 }),
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
