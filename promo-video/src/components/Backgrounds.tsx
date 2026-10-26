import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

const blob = (x: number, y: number, r: number, color: string) =>
  `radial-gradient(circle ${r}px at ${x}px ${y}px, ${color}, transparent)`;

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/** Slowly drifting "intelligence glow" on near-black, like Apple keynote stills. */
export const Aurora: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const { width: w, height: h } = useVideoConfig();
  const t = frame / 30;
  const m = Math.max(w, h);
  const a = 0.42 * intensity;
  const layers = [
    blob(
      w * (0.18 + 0.05 * Math.sin(t * 0.5)),
      h * (0.9 + 0.04 * Math.cos(t * 0.4)),
      m * 0.55,
      hexA(C.blue, a),
    ),
    blob(
      w * (0.5 + 0.06 * Math.cos(t * 0.35)),
      h * (1.05 + 0.03 * Math.sin(t * 0.6)),
      m * 0.5,
      hexA(C.violet, a),
    ),
    blob(
      w * (0.82 + 0.05 * Math.sin(t * 0.45 + 1)),
      h * (0.92 + 0.04 * Math.sin(t * 0.3)),
      m * 0.5,
      hexA(C.pink, a * 0.9),
    ),
    blob(
      w * (0.95 + 0.03 * Math.cos(t * 0.5)),
      h * (0.2 + 0.05 * Math.sin(t * 0.4)),
      m * 0.38,
      hexA(C.orange, a * 0.45),
    ),
    blob(
      w * (0.05 + 0.03 * Math.sin(t * 0.3)),
      h * (0.08 + 0.04 * Math.cos(t * 0.5)),
      m * 0.4,
      hexA(C.blue, a * 0.35),
    ),
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#030305" }}>
      <AbsoluteFill style={{ background: layers.join(",") }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};

/** Apple "mist" white with pastel glow and a fading dot grid. */
export const Mist: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: w, height: h } = useVideoConfig();
  const t = frame / 30;
  const m = Math.max(w, h);
  const layers = [
    blob(
      w * (0.12 + 0.03 * Math.sin(t * 0.4)),
      h * 0.15,
      m * 0.42,
      hexA(C.blue, 0.16),
    ),
    blob(
      w * (0.9 + 0.03 * Math.cos(t * 0.35)),
      h * 0.85,
      m * 0.45,
      hexA(C.pink, 0.14),
    ),
    blob(
      w * 0.75,
      h * (0.1 + 0.04 * Math.sin(t * 0.5)),
      m * 0.35,
      hexA(C.violet, 0.12),
    ),
    blob(
      w * 0.2,
      h * (0.95 + 0.03 * Math.cos(t * 0.4)),
      m * 0.35,
      hexA(C.orange, 0.1),
    ),
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.mist }}>
      <AbsoluteFill style={{ background: layers.join(",") }} />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(29,29,31,0.13) 1.6px, transparent 1.6px)",
          backgroundSize: "34px 34px",
          backgroundPosition: `${(frame * 0.25) % 34}px ${(frame * 0.15) % 34}px`,
          maskImage:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,0,0,0.9), transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='256' height='256' filter='url(#n)'/></svg>`,
)}")`;

/** Subtle animated film grain. */
export const Grain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const x = (frame * 73) % 256;
  const y = (frame * 151) % 256;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE,
        backgroundSize: "256px 256px",
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
};
