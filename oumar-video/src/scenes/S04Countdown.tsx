import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Reveal } from "../components/Reveal";
import { clamp, sans, serif } from "../theme";

const R = 200;
const C = 2 * Math.PI * R;

// Ring countdown: "Всего 3 секунды, чтобы зацепить" (Only 3 seconds to hook)
export const S04Countdown: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [8, 66], [1, 0], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const seconds = (3 * progress).toFixed(1).replace(".", ",");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
        opacity: interpolate(frame, [64, 75], [1, 0], clamp),
        filter: `blur(${interpolate(frame, [64, 75], [0, 22], clamp)}px)`,
      }}
    >
      <Interactive.Div
        name="Ring"
        style={{
          position: "relative",
          width: 480,
          height: 480,
          opacity: interpolate(frame, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 18], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <svg width={480} height={480} viewBox="0 0 480 480">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34C759" />
              <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
          </defs>
          <circle cx={240} cy={240} r={R} fill="none" stroke="#E8E8ED" strokeWidth={28} />
          <circle
            cx={240}
            cy={240}
            r={R}
            fill="none"
            stroke="url(#ring)"
            strokeWidth={28}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            transform="rotate(-90 240 240)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 150,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              color: "#1D1D1F",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {seconds}
          </div>
          <div style={{ fontSize: 44, fontWeight: 500, color: "#86868B", marginTop: 8 }}>
            сек
          </div>
        </div>
      </Interactive.Div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 70,
        }}
      >
        <Reveal delay={12}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              color: "#1D1D1F",
            }}
          >
            Всего 3 секунды,
          </div>
        </Reveal>
        <Reveal delay={20} dy={50} blur={20}>
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 104,
              lineHeight: 1.1,
              color: "#0A84FF",
              whiteSpace: "nowrap",
            }}
          >
            чтобы зацепить
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
