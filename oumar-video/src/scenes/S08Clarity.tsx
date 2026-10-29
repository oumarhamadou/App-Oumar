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

const Eye: React.FC<{ open: number; look: number }> = ({ open, look }) => (
  <svg width={240} height={140} viewBox="0 0 240 140">
    <defs>
      <radialGradient id="iris" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#64D2FF" />
        <stop offset="55%" stopColor="#0A84FF" />
        <stop offset="100%" stopColor="#0040A8" />
      </radialGradient>
      <clipPath id="lid">
        <path
          d={`M 10 70 Q 120 ${70 - 66 * open} 230 70 Q 120 ${70 + 66 * open} 10 70 Z`}
        />
      </clipPath>
    </defs>
    <path
      d={`M 10 70 Q 120 ${70 - 66 * open} 230 70 Q 120 ${70 + 66 * open} 10 70 Z`}
      fill="#FFFFFF"
      stroke="#1D1D1F"
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <g clipPath="url(#lid)">
      <circle cx={120 + look} cy={70} r={40} fill="url(#iris)" />
      <circle cx={120 + look} cy={70} r={17} fill="#0B0B0F" />
      <circle cx={108 + look} cy={58} r={8} fill="#FFFFFF" opacity={0.9} />
    </g>
  </svg>
);

// "Ясность — не преимущество. Это рычаг." (Clarity isn't an advantage. It's leverage.)
export const S08Clarity: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [20, 32], [0.05, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const look = interpolate(frame, [40, 60, 80, 100], [0, -14, 12, 0], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const beam = interpolate(frame, [30, 54], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const half = 60 + beam * 420;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        fontFamily: sans,
        opacity: interpolate(frame, [124, 135], [1, 0], clamp),
        filter: `blur(${interpolate(frame, [124, 135], [0, 24], clamp)}px)`,
      }}
    >
      {/* Light beam */}
      <div
        style={{
          position: "absolute",
          top: "36%",
          left: "50%",
          width: 1100,
          height: "64%",
          translate: "-50% 0px",
          clipPath: `polygon(${550 - 34}px 0px, ${550 + 34}px 0px, ${550 + half}px 100%, ${550 - half}px 100%)`,
          background:
            "linear-gradient(180deg, rgba(52,199,89,0.85) 0%, rgba(52,199,89,0.35) 45%, rgba(52,199,89,0) 100%)",
          opacity: beam * (0.92 + Math.sin(frame / 3) * 0.08),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "13%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Letters
          text="Ясность"
          delay={6}
          stagger={2}
          dy={-60}
          style={{
            fontSize: 176,
            fontWeight: 800,
            letterSpacing: "-0.055em",
            color: "#1D1D1F",
          }}
        />
        <div style={{ marginTop: 4, opacity: interpolate(frame, [18, 24], [0, 1], clamp) }}>
          <Eye open={open} look={look} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "66%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Reveal delay={54} exitAt={86} dy={30}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              color: "#1D1D1F",
            }}
          >
            — не преимущество.
          </div>
        </Reveal>
      </div>
      <Interactive.Div
        name="Leverage"
        style={{
          position: "absolute",
          top: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [94, 104], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [94, 112], [0.7, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            color: "#1D1D1F",
          }}
        >
          Это
        </div>
        <div
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 190,
            lineHeight: 1,
            color: "#0B7A2C",
          }}
        >
          рычаг.
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
