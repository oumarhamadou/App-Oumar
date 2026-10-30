import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Line, Word, exitStyle } from "../components/Reveal";
import { didone, greenInk, sans } from "../theme";

const body: React.CSSProperties = {
  fontSize: 100,
  fontWeight: 700,
  letterSpacing: "-0.05em",
  color: "#0B0B0C",
};

// "Представляю новую страницу в Instagram с моим моушн-дизайном"
// (Introducing my new Instagram page with my motion design)
export const S3Introducing: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
        lineHeight: 1.16,
        ...exitStyle(frame, 86, 12),
      }}
    >
      <Line at={0}>
        <Word at={2} space={false} style={body}>
          Представляю
        </Word>
      </Line>
      <Line at={8}>
        <Word at={10} style={body}>
          новую
        </Word>
        <Word at={16} space={false} style={body}>
          страницу
        </Word>
      </Line>
      <Line at={20} style={{ marginTop: 18, marginBottom: 18 }}>
        <Word at={22} style={body}>
          в
        </Word>
        <Word
          at={26}
          space={false}
          tint="#FFFFFF"
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            background: "#34C759",
            border: "5px solid #0B0B0C",
            borderRadius: 14,
            padding: "0 22px 8px",
            rotate: "-2deg",
            boxShadow: "6px 6px 0 #0B0B0C",
          }}
        >
          Instagram
        </Word>
      </Line>
      <Line at={34}>
        <Word at={34} style={{ ...body, fontSize: 64, fontWeight: 500, color: "#86868B" }}>
          с
        </Word>
        <Word
          at={38}
          space={false}
          style={{ ...body, fontSize: 64, fontWeight: 500, color: "#86868B" }}
        >
          моим
        </Word>
      </Line>
      <Line at={42}>
        <Word
          at={44}
          space={false}
          tint="#0B0B0C"
          style={{ fontFamily: didone, fontSize: 132, lineHeight: 1.05, ...greenInk }}
        >
          моушн-дизайном
        </Word>
      </Line>
    </AbsoluteFill>
  );
};
