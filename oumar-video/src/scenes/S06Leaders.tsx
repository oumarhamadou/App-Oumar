import { evolvePath } from "@remotion/paths";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Letters, Reveal } from "../components/Reveal";
import { clamp, sans, serif } from "../theme";

const ARC = "M 20 60 C 160 -10, 420 -10, 560 50";

// "Бренды-лидеры рынка — не громче." (Market leaders aren't louder)
export const S06Leaders: React.FC = () => {
  const frame = useCurrentFrame();
  const arc = evolvePath(
    interpolate(frame, [60, 76], [0, 1], {
      ...clamp,
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    }),
    ARC,
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
        opacity: interpolate(frame, [80, 90], [1, 0], clamp),
        filter: `blur(${interpolate(frame, [80, 90], [0, 22], clamp)}px)`,
      }}
    >
      <Interactive.Div
        name="Leaders"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          translate: interpolate(frame, [42, 58], ["0px 0px", "0px -230px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          }),
          scale: interpolate(frame, [42, 58], [1, 0.72], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.65, 0, 0.35, 1),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [42, 58], [1, 0.45], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Reveal delay={0}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              color: "#1D1D1F",
            }}
          >
            Бренды-лидеры
          </div>
        </Reveal>
        <Letters
          text="рынка"
          delay={10}
          stagger={2}
          dy={70}
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 160,
            lineHeight: 1.05,
            color: "#1FAE48",
          }}
        />
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          top: "52%",
          display: "flex",
          alignItems: "baseline",
          gap: 28,
        }}
      >
        <Reveal delay={48} dy={50}>
          <span
            style={{
              fontSize: 128,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              color: "#1D1D1F",
            }}
          >
            не
          </span>
        </Reveal>
        <div style={{ position: "relative" }}>
          <Reveal delay={52} dy={50}>
            <span
              style={{
                fontSize: 128,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: "#1D1D1F",
              }}
            >
              громче.
            </span>
          </Reveal>
          <svg
            width={580}
            height={70}
            viewBox="0 0 580 70"
            style={{ position: "absolute", left: -20, top: -30 }}
          >
            <path
              d={ARC}
              fill="none"
              stroke="#0A84FF"
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={arc.strokeDashoffset}
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
