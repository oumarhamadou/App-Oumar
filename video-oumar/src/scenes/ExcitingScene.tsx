import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, outro, pop } from "../anim";
import { FONT } from "../fonts";
import { useCopy, useScene } from "../locales";

const slideIn = (p: number): React.CSSProperties => ({
  display: "inline-block",
  opacity: Math.min(1, Math.max(0, p) * 1.6),
  translate: `${(1 - p) * 90}px 0px`,
  filter: `blur(${Math.max(0, 1 - p) * 14}px)`,
});

/** "Et c'est justement ça qui est excitant." */
export const ExcitingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("exciting");
  const { lines, big: bigWord } = useCopy().exciting;
  const exit = outro(frame, durationInFrames, 8);
  const p = (i: number) => pop(frame, words[i].at - 3, { damping: 16, stiffness: 180 });
  const big = pop(frame, words[bigWord.word].at - 3, { damping: 11, stiffness: 160 });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 50% 64%, rgba(42,168,255,0.28) 0%, rgba(0,0,0,0) 70%)",
          opacity: Math.max(0, Math.min(1, big)),
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          scale: String(1 + frame * 0.0012),
          filter: `blur(${interpolate(exit, [0, 1], [0, 16], { ...CLAMP, easing: EASE_IN })}px)`,
          opacity: 1 - exit,
        }}
      >
        {lines.map((line, li) => (
          <div key={li} style={{ display: "flex", gap: 20, fontSize: 74, marginTop: li === 0 ? 0 : 4 }}>
            {line.map(({ label, word }) => (
              <span key={label + word} style={slideIn(p(word))}>
                {label}
              </span>
            ))}
          </div>
        ))}
        <div
          style={{
            fontSize: 170,
            marginTop: -6,
            color: "#2AA8FF",
            textShadow: "0 0 40px rgba(42,168,255,0.55), 0 0 90px rgba(42,168,255,0.35)",
            ...slideIn(big),
            scale: String(0.7 + 0.3 * big),
          }}
        >
          {bigWord.label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
