import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { outro, ramp, typedCount } from "../anim";
import { FONT } from "../fonts";
import { useCopy, useScene } from "../locales";

/** "Depuis quelques années" — typed on a dark, golden backdrop with a glowing caret. */
export const YearsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("years");
  const { text, fontSize } = useCopy().years;
  const typed = typedCount(text, words, frame);
  const done = typed >= text.length;
  const exit = outro(frame, durationInFrames, 6);
  const glow = ramp(frame, 0, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050403", fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 72% 28%, rgba(230,160,20,0.62) 0%, rgba(150,96,10,0.3) 40%, rgba(5,4,3,0) 75%)",
          opacity: 0.4 + 0.6 * glow,
          translate: `${(1 - glow) * 60}px ${(1 - glow) * -40}px`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          scale: String(1 + frame * 0.0012 + exit * 0.2),
          filter: `blur(${exit * 16}px)`,
          opacity: 1 - exit,
        }}
      >
        <div style={{ position: "relative", fontSize, fontWeight: 700, letterSpacing: "-0.03em" }}>
          {/* Invisible full line keeps the layout centred while typing. */}
          <span style={{ color: "transparent", whiteSpace: "pre" }}>{text}</span>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              display: "flex",
              alignItems: "center",
              whiteSpace: "pre",
            }}
          >
            <span
              style={{
                backgroundImage: "linear-gradient(180deg, #FFE7A8 0%, #E7B455 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {text.slice(0, typed)}
            </span>
            <span
              style={{
                display: "inline-block",
                width: 9,
                height: Math.round(fontSize * 1.3),
                marginLeft: 6,
                borderRadius: 5,
                backgroundColor: "#FFC21A",
                boxShadow: "0 0 18px #FFB800, 0 0 46px rgba(255,170,0,0.7)",
                opacity: !done || Math.floor(frame / 7) % 2 === 0 ? 1 : 0.15,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
