import { evolvePath } from "@remotion/paths";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { clamp, sans } from "../theme";

const LINES = [430, 830, 1230];
const SEG1 = "M 70 430 C 250 430, 240 830, 430 830";
const SEG2 = "M 430 830 C 620 830, 610 1230, 800 1230";
const SEG3 = "M 800 1230 C 880 1230, 900 1330, 960 1480";
const draw = Easing.bezier(0.65, 0, 0.35, 1);

const Dot: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [at, at + 12], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 10 }),
  });
  const pulse = interpolate(frame, [at, at + 24], [0, 1], clamp);
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={16 + pulse * 40}
        fill="#0A84FF"
        opacity={(1 - pulse) * 0.25}
      />
      <circle
        cx={x}
        cy={y}
        r={16 * s}
        fill="#FFFFFF"
        stroke="#0A84FF"
        strokeWidth={7 * s}
      />
    </g>
  );
};

const Label: React.FC<{
  x: number;
  y: number;
  at: number;
  noun: string;
  align?: "left" | "right";
}> = ({ x, y, at, noun, align = "left" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 16], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : undefined,
        right: align === "right" ? 920 - x : undefined,
        top: y,
        fontSize: 50,
        fontWeight: 600,
        letterSpacing: "-0.03em",
        whiteSpace: "nowrap",
        opacity: t,
        filter: `blur(${(1 - t) * 10}px)`,
        translate: `${(1 - t) * (align === "left" ? -30 : 30)}px 0px`,
      }}
    >
      <span style={{ color: "#86868B" }}>Теряете </span>
      <span style={{ color: "#1D1D1F" }}>{noun}</span>
    </div>
  );
};

// Falling curve: losing prospects → momentum → opportunities
export const S05Losing: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = evolvePath(interpolate(frame, [12, 40], [0, 1], { ...clamp, easing: draw }), SEG1);
  const p2 = evolvePath(interpolate(frame, [44, 72], [0, 1], { ...clamp, easing: draw }), SEG2);
  const p3 = evolvePath(interpolate(frame, [76, 98], [0, 1], { ...clamp, easing: draw }), SEG3);

  return (
    <AbsoluteFill
      style={{
        fontFamily: sans,
        opacity: interpolate(frame, [108, 120], [1, 0], clamp),
        filter: `blur(${interpolate(frame, [108, 120], [0, 22], clamp)}px)`,
      }}
    >
      <Interactive.Div
        name="Chart camera"
        style={{
          position: "absolute",
          inset: 0,
          translate: interpolate(frame, [0, 110], ["0px 160px", "-30px -150px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.45, 0, 0.55, 1),
          }),
        }}
      >
        <svg width={920} height={1640} viewBox="0 0 920 1640" style={{ position: "absolute" }}>
          {LINES.map((y, i) => (
            <line
              key={y}
              x1={0}
              x2={interpolate(frame, [i * 4, i * 4 + 18], [0, 920], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}
              y1={y}
              y2={y}
              stroke="#D2D2D7"
              strokeWidth={3}
            />
          ))}
          {[SEG1, SEG2, SEG3].map((d, i) => {
            const ev = [p1, p2, p3][i];
            return (
              <path
                key={d}
                d={d}
                fill="none"
                stroke="#0A84FF"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={ev.strokeDasharray}
                strokeDashoffset={ev.strokeDashoffset}
              />
            );
          })}
          <Dot x={70} y={430} at={8} />
          <Dot x={430} y={830} at={40} />
          <Dot x={800} y={1230} at={72} />
        </svg>
        <Label x={60} y={345} at={6} noun="клиентов" />
        <Label x={470} y={745} at={40} noun="импульс" />
        <Label x={860} y={1255} at={72} noun="возможности" align="right" />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
