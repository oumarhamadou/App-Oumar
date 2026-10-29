import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Reveal } from "../components/Reveal";
import { clamp, sans, serif } from "../theme";

const word: React.CSSProperties = {
  fontSize: 100,
  fontWeight: 700,
  letterSpacing: "-0.045em",
  color: "#1D1D1F",
};

// "Новая страница в Instagram о моушн-дизайне"
// (A new Instagram page about motion design)
export const S11NewPage: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
        lineHeight: 1.12,
        opacity: interpolate(frame, [80, 90], [1, 0], clamp),
        filter: `blur(${interpolate(frame, [80, 90], [0, 24], clamp)}px)`,
        scale: `${interpolate(frame, [80, 90], [1, 0.9], clamp)}`,
      }}
    >
      <div style={{ display: "flex", gap: 26 }}>
        <Reveal delay={0} dx={40} dy={0}>
          <span style={word}>Новая</span>
        </Reveal>
        <Reveal delay={5} dx={40} dy={0}>
          <span style={word}>страница</span>
        </Reveal>
      </div>
      <div style={{ display: "flex", gap: 26 }}>
        <Reveal delay={10} dx={40} dy={0}>
          <span style={word}>в</span>
        </Reveal>
        <Reveal delay={14} dx={40} dy={0}>
          <span style={{ ...word, color: "#0A84FF" }}>Instagram</span>
        </Reveal>
      </div>
      <Reveal delay={22} dy={50} blur={20}>
        <span
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 112,
            color: "#1FAE48",
          }}
        >
          о моушн-дизайне
        </span>
      </Reveal>
    </AbsoluteFill>
  );
};
