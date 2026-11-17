import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { outro, pop, reveal } from "../anim";
import { EMOJI_FONT, FONT } from "../fonts";
import { useCopy, useScene } from "../locales";

const EMOJIS = [
  { char: "👋", x: 190, y: 230, delay: 0, rotate: -18 },
  { char: "🎨", x: 880, y: 250, delay: 5, rotate: 14 },
  { char: "😎", x: 210, y: 820, delay: 9, rotate: 10 },
  { char: "🖥️", x: 870, y: 800, delay: 13, rotate: -8 },
];

/** "Salut, je suis motion designer." — words pop in with the voice; the last one flashes pink. */
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("intro");
  const exit = outro(frame, durationInFrames, 8);

  const { lines, accentWord, fontSize } = useCopy().intro;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F7F7F9", fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          scale: String(1 + exit * 0.35),
          filter: `blur(${exit * 18}px)`,
          opacity: 1 - exit * 0.6,
        }}
      >
        {EMOJIS.map((e) => {
          const p = pop(frame, e.delay, { damping: 11, stiffness: 150 });
          return (
            <div
              key={e.char}
              style={{
                position: "absolute",
                left: e.x - 60,
                top: e.y - 60,
                width: 120,
                height: 120,
                fontSize: 96,
                lineHeight: "120px",
                textAlign: "center",
                fontFamily: EMOJI_FONT,
                opacity: Math.min(1, p * 1.5),
                scale: String(Math.max(0, p)),
                rotate: `${(1 - p) * e.rotate * 3 + Math.sin((frame + e.delay * 7) / 14) * 6}deg`,
                translate: `0px ${Math.sin((frame + e.delay * 5) / 11) * 10}px`,
              }}
            >
              {e.char}
            </div>
          );
        })}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {lines.map((line, li) => (
            <div key={li} style={{ display: "flex", gap: 26 }}>
              {line.map(({ label, word: i }) => {
                const p = pop(frame, words[i].at - 2);
                const isDesigner = i === accentWord;
                return (
                  <span
                    key={label}
                    style={{
                      display: "inline-block",
                      fontSize,
                      fontWeight: 800,
                      letterSpacing: "-0.035em",
                      color: isDesigner
                        ? interpolateColors(
                            frame,
                            [words[i].at + 8, words[i].at + 22],
                            ["#FF2D78", "#111111"],
                          )
                        : "#111111",
                      ...reveal(p),
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
