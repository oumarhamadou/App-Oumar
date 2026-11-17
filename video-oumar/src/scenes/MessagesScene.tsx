import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, outro, pop, ramp } from "../anim";
import { FONT } from "../fonts";
import { scene } from "../timeline";

const Bubble: React.FC<{ text: string; p: number }> = ({ text, p }) => (
  <div
    style={{
      position: "relative",
      alignSelf: "flex-end",
      padding: "22px 36px",
      borderRadius: 46,
      background: "linear-gradient(180deg, #2C95FF 0%, #0A7CFF 100%)",
      color: "white",
      fontSize: 46,
      fontWeight: 600,
      letterSpacing: "-0.015em",
      whiteSpace: "nowrap",
      transformOrigin: "100% 100%",
      scale: String(Math.max(0, 0.35 + 0.65 * p)),
      opacity: Math.min(1, Math.max(0, p) * 2),
      filter: `blur(${Math.max(0, 1 - p) * 10}px)`,
      boxShadow: "0 10px 30px rgba(10,124,255,0.25)",
    }}
  >
    {text}
    <svg
      width={34}
      height={30}
      viewBox="0 0 34 30"
      style={{ position: "absolute", right: -9, bottom: 0 }}
    >
      <path d="M0 0 C2 18 14 28 34 29 C22 24 18 14 18 0 Z" fill="#0A7CFF" />
    </svg>
  </div>
);

/** "juste une obsession : créer de meilleures vidéos" — as sent text messages. */
export const MessagesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = scene("messages");
  const exit = outro(frame, durationInFrames, 8);

  const first = pop(frame, words[0].at - 4, { damping: 13, stiffness: 190 });
  const second = pop(frame, words[3].at - 4, { damping: 13, stiffness: 190 });
  const receipt1 = ramp(frame, words[0].at + 10, words[0].at + 18);
  const receipt2 = ramp(frame, words[3].at + 10, words[3].at + 18);
  // The stack slides up when the second message arrives.
  const lift = Math.min(1, pop(frame, words[3].at - 4, { damping: 18, stiffness: 160 }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#F7F7F9", fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          scale: String(1.04 + frame * 0.0009 + exit * 0.3),
          translate: `${Math.sin(frame / 40) * 14}px ${-lift * 66}px`,
          filter: `blur(${interpolate(exit, [0, 1], [0, 18], { ...CLAMP, easing: EASE_IN })}px)`,
          opacity: 1 - exit,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 120,
            top: 470,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0,
          }}
        >
          <Bubble text="Juste une obsession :" p={first} />
          <div
            style={{
              height: 44 * (1 - lift),
              marginTop: 10,
              fontSize: 24,
              fontWeight: 500,
              color: "#9097A3",
              opacity: receipt1 * (1 - lift),
              paddingRight: 10,
            }}
          >
            Lu à 15:15
          </div>
          <div style={{ height: 18 * lift }} />
          <Bubble text="créer de meilleures vidéos" p={second} />
          <div
            style={{
              marginTop: 10,
              fontSize: 24,
              fontWeight: 500,
              color: "#9097A3",
              opacity: receipt2,
              paddingRight: 10,
            }}
          >
            Lu à 15:15
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
