import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SANS, SERIF } from "./fonts";
import { WALL, type BackgroundWord } from "./script";

const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

/** A huge word sitting between the plate and the speaker cut-out, blended in Difference mode. */
export const BackgroundWordView: React.FC<{ word: BackgroundWord }> = ({ word }) => {
  const frame = useCurrentFrame();
  const t = frame - word.from;
  const enter = interpolate(t, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: outExpo,
  });
  const exit = interpolate(frame, [word.until - 4, word.until], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(t, [10, word.until - word.from], [0, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (t < 0 || frame >= word.until) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: word.left,
        top: word.top,
        fontFamily: word.font === "serif" ? SERIF : SANS,
        fontStyle: word.font === "serif" ? "italic" : "normal",
        fontWeight: word.font === "serif" ? 400 : 900,
        fontSize: word.size,
        letterSpacing: word.font === "serif" ? "-0.02em" : "-0.06em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        color: "white",
        mixBlendMode: "difference",
        opacity: interpolate(t, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - exit),
        filter: `blur(${(1 - enter) * 16 + exit * 12}px)`,
        scale: String(1.14 - enter * 0.14 + drift),
        transformOrigin: "30% 50%",
      }}
    >
      {word.text}
    </div>
  );
};

/** Rows of AVOIDING scrolling in opposite directions behind the speaker during the silent beat. */
export const TextWall: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - WALL.from;
  if (t < 0 || frame >= WALL.until) {
    return null;
  }

  const rows = 5;
  const unit = `${WALL.text}\u2009\u2009`;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {new Array(rows).fill(0).map((_, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const appear = interpolate(t, [i * 2, i * 2 + 7], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: outExpo,
        });
        const outline = i % 2 === 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: -70 + i * 300,
              left: -600 + (i % 2) * 380,
              whiteSpace: "nowrap",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 290,
              lineHeight: 1,
              letterSpacing: "-0.055em",
              color: outline ? "transparent" : "white",
              WebkitTextStroke: outline ? "5px white" : undefined,
              mixBlendMode: "difference",
              opacity: appear,
              translate: `${dir * (t * 9 + (1 - appear) * 260)}px 0px`,
            }}
          >
            {unit.repeat(4)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
