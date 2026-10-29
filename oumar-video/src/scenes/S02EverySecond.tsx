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

const TICKS = 31;
const R = 300;
const CX = 360;
const CY = 340;

// Gauge + "Каждая секунда" (Every second)
export const S02EverySecond: React.FC = () => {
  const frame = useCurrentFrame();

  // Needle sweeps left → right with an overshoot, then trembles.
  const sweep = interpolate(frame, [6, 40], [-88, 62], {
    ...clamp,
    easing: Easing.spring({ damping: 9, stiffness: 120 }),
  });
  const tremble = frame > 40 ? Math.sin(frame * 1.7) * 1.6 : 0;
  const needle = sweep + tremble;

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
        name="Gauge"
        style={{
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
          scale: interpolate(frame, [0, 18], [0.85, 1], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <svg width={720} height={400} viewBox="0 0 720 400">
          {new Array(TICKS).fill(0).map((_, i) => {
            const angle = -90 + (180 * i) / (TICKS - 1);
            const rad = ((angle - 90) * Math.PI) / 180;
            const major = i % 5 === 0;
            const len = major ? 46 : 24;
            const active = angle <= needle;
            const tickIn = interpolate(frame, [i * 0.6, i * 0.6 + 8], [0, 1], clamp);
            return (
              <line
                key={i}
                x1={CX + Math.cos(rad) * R}
                y1={CY + Math.sin(rad) * R}
                x2={CX + Math.cos(rad) * (R - len)}
                y2={CY + Math.sin(rad) * (R - len)}
                stroke={active ? "#0A84FF" : "#C7C7CC"}
                strokeWidth={major ? 10 : 6}
                strokeLinecap="round"
                opacity={tickIn}
              />
            );
          })}
          <g
            style={{
              transform: `rotate(${needle}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
            }}
          >
            <path
              d={`M ${CX - 14} ${CY} L ${CX} ${CY - 250} L ${CX + 14} ${CY} Z`}
              fill="#1D1D1F"
            />
          </g>
          <circle cx={CX} cy={CY} r={30} fill="#1D1D1F" />
          <circle cx={CX} cy={CY} r={11} fill="#FFFFFF" />
        </svg>
      </Interactive.Div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <Letters
          text="Каждая"
          delay={14}
          style={{
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            color: "#1D1D1F",
          }}
        />
        <Reveal delay={24} dy={60} blur={20}>
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 150,
              lineHeight: 1.05,
              color: "#0A84FF",
            }}
          >
            секунда
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
