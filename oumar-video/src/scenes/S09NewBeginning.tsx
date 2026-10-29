import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Letters } from "../components/Reveal";
import { clamp, sans, serif } from "../theme";

// "Новое начало" (A new beginning)
export const S09NewBeginning: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
        opacity: interpolate(frame, [50, 60], [1, 0], clamp),
        filter: `blur(${interpolate(frame, [50, 60], [0, 24], clamp)}px)`,
        scale: `${interpolate(frame, [0, 60], [0.97, 1.04])}`,
      }}
    >
      <Letters
        text="Новое"
        delay={2}
        stagger={2}
        dx={50}
        dy={0}
        style={{
          fontSize: 140,
          fontWeight: 700,
          letterSpacing: "-0.05em",
          color: "#1D1D1F",
        }}
      />
      <Letters
        text="начало"
        delay={12}
        stagger={2}
        dx={50}
        dy={0}
        style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 190,
          lineHeight: 1.05,
          color: "#0A84FF",
        }}
      />
    </AbsoluteFill>
  );
};
