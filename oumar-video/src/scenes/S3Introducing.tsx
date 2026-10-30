import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Line, Word, exitStyle } from "../components/Reveal";
import { didone, greenInk, sans } from "../theme";

const body: React.CSSProperties = {
  fontSize: 100,
  fontWeight: 700,
  letterSpacing: "-0.05em",
  color: "#0B0B0C",
};
const small: React.CSSProperties = {
  ...body,
  fontSize: 64,
  fontWeight: 500,
  color: "#86868B",
};
const boxed: React.CSSProperties = {
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
};

// "Представляю новую страницу в Instagram с моим моушн-дизайном"
// (Introducing my new Instagram page with my motion design)
// Same words and timing in both formats; only the line breaks change.
export const S3Introducing: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const landscape = width > height;

  const w = {
    present: (space: boolean) => (
      <Word at={2} space={space} style={body}>
        Представляю
      </Word>
    ),
    new: (
      <Word at={10} style={body}>
        новую
      </Word>
    ),
    page: (
      <Word at={16} space={false} style={body}>
        страницу
      </Word>
    ),
    in: (
      <Word at={22} style={body}>
        в
      </Word>
    ),
    instagram: (
      <Word at={26} space={false} tint="#FFFFFF" style={boxed}>
        Instagram
      </Word>
    ),
    with: (
      <Word at={34} style={small}>
        с
      </Word>
    ),
    my: (space: boolean) => (
      <Word at={38} space={space} style={small}>
        моим
      </Word>
    ),
    motion: (size: number) => (
      <Word
        at={44}
        space={false}
        tint="#0B0B0C"
        style={{ fontFamily: didone, fontSize: size, lineHeight: 1.05, ...greenInk }}
      >
        моушн-дизайном
      </Word>
    ),
  };

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
      {landscape ? (
        <>
          <Line at={0}>
            {w.present(true)}
            {w.new}
            {w.page}
          </Line>
          <Line at={20} style={{ marginTop: 22, marginBottom: 10 }}>
            {w.in}
            {w.instagram}
          </Line>
          <Line at={34}>
            {w.with}
            {w.my(true)}
            {w.motion(170)}
          </Line>
        </>
      ) : (
        <>
          <Line at={0}>{w.present(false)}</Line>
          <Line at={8}>
            {w.new}
            {w.page}
          </Line>
          <Line at={20} style={{ marginTop: 18, marginBottom: 18 }}>
            {w.in}
            {w.instagram}
          </Line>
          <Line at={34}>
            {w.with}
            {w.my(false)}
          </Line>
          <Line at={42}>{w.motion(132)}</Line>
        </>
      )}
    </AbsoluteFill>
  );
};
