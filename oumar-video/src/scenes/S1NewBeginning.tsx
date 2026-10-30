import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Line, Word, exitStyle } from "../components/Reveal";
import { didone, greenInk, sans } from "../theme";

// "Новое начало" (A new beginning)
export const S1NewBeginning: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
        ...exitStyle(frame, 48),
      }}
    >
      <Line at={0}>
        <Word
          at={6}
          style={{
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            color: "#0B0B0C",
          }}
        >
          Новое
        </Word>
        <Word
          at={14}
          space={false}
          tint="#0B0B0C"
          style={{
            fontFamily: didone,
            fontSize: 196,
            lineHeight: 1,
            ...greenInk,
          }}
        >
          начало
        </Word>
      </Line>
    </AbsoluteFill>
  );
};
