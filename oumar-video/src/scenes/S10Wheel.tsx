import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { clamp, sans } from "../theme";

const WORDS = ["Моушн", "Дизайн", "Идеи"];
const STEP = 180;

// Vertical word wheel: Motion / Design / Ideas
export const S10Wheel: React.FC = () => {
  const frame = useCurrentFrame();
  const spring = Easing.spring({ damping: 15, stiffness: 140 });
  const index =
    interpolate(frame, [18, 32], [0, 1], { ...clamp, easing: spring }) +
    interpolate(frame, [40, 54], [0, 1], { ...clamp, easing: spring });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
        opacity:
          interpolate(frame, [0, 10], [0, 1], clamp) *
          interpolate(frame, [66, 75], [1, 0], clamp),
        filter: `blur(${interpolate(frame, [66, 75], [0, 24], clamp)}px)`,
      }}
    >
      {WORDS.map((w, i) => {
        const d = i - index;
        const dist = Math.min(Math.abs(d), 2);
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              fontSize: 150,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              translate: `0px ${d * STEP}px`,
              scale: `${1 - dist * 0.28}`,
              opacity: 1 - dist * 0.55,
              filter: `blur(${dist * 9}px)`,
              color:
                i === WORDS.length - 1
                  ? interpolateColors(dist, [0, 1], ["#0A84FF", "#86868B"])
                  : interpolateColors(dist, [0, 1], ["#1D1D1F", "#86868B"]),
            }}
          >
            {w}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
