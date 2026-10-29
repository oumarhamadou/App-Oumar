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
import { sans, serif } from "../theme";

const SWOOSH = "M 40 40 C 220 10, 460 0, 640 30";

// "Внимание — это дорого" (Attention is expensive)
export const S01Attention: React.FC = () => {
  const frame = useCurrentFrame();
  const swoosh = evolvePath(
    interpolate(frame, [40, 58], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    }),
    SWOOSH,
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
      }}
    >
      <Interactive.Div
        name="Title group"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: interpolate(frame, [0, 90], [0.96, 1.06]),
          opacity: interpolate(frame, [78, 90], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          filter: `blur(${interpolate(frame, [78, 90], [0, 24], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
        }}
      >
        <Letters
          text="Внимание"
          delay={2}
          stagger={2}
          style={{
            fontSize: 136,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            color: "#1D1D1F",
          }}
        />
        <Reveal delay={16} dy={20}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: "#86868B",
              margin: "18px 0 6px",
              letterSpacing: "-0.01em",
            }}
          >
            — это —
          </div>
        </Reveal>
        <div style={{ position: "relative" }}>
          <Letters
            text="дорого"
            delay={22}
            stagger={3}
            dy={90}
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 210,
              lineHeight: 1.05,
              color: "#1FAE48",
              letterSpacing: "-0.02em",
            }}
          />
          <svg
            width={680}
            height={70}
            viewBox="0 0 680 70"
            style={{ position: "absolute", left: -10, bottom: -40 }}
          >
            <path
              d={SWOOSH}
              fill="none"
              stroke="#34C759"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={swoosh.strokeDasharray}
              strokeDashoffset={swoosh.strokeDashoffset}
            />
          </svg>
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
