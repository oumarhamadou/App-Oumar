import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { exitStyle } from "../components/Reveal";
import { clamp, didone, greenInk, sans, script } from "../theme";

const STEP = 210;

// Word wheel from the motion reference, set in the "My Creation" type mix:
// grotesk → condensed Didone → script.
const WORDS: { text: string; style: React.CSSProperties }[] = [
  {
    text: "Моушн",
    style: { fontFamily: sans, fontSize: 160, fontWeight: 800, letterSpacing: "-0.055em", color: "#0B0B0C" },
  },
  {
    text: "Дизайн",
    style: { fontFamily: didone, fontSize: 250, lineHeight: 1, ...greenInk },
  },
  {
    text: "Идеи",
    style: { fontFamily: script, fontSize: 230, lineHeight: 1, color: "#0B0B0C" },
  },
];

export const S2Wheel: React.FC = () => {
  const frame = useCurrentFrame();
  const spring = Easing.spring({ damping: 16, stiffness: 170 });
  // Each beat (16 frames) rolls the wheel one step.
  const index =
    interpolate(frame, [0, 10], [-0.9, 0], { ...clamp, easing: spring }) +
    interpolate(frame, [16, 27], [0, 1], { ...clamp, easing: spring }) +
    interpolate(frame, [32, 43], [0, 1], { ...clamp, easing: spring });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        ...exitStyle(frame, 50),
      }}
    >
      {WORDS.map((w, i) => {
        const d = i - index;
        const dist = Math.min(Math.abs(d), 2);
        return (
          <div
            key={w.text}
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              translate: `0px ${d * STEP}px`,
              scale: `${1 - dist * 0.32}`,
              opacity: 1 - dist * 0.62,
              filter: `blur(${dist * 12}px)`,
            }}
          >
            <span style={w.style}>{w.text}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
