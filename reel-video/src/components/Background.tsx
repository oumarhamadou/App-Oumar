import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useLayout } from "../layout";
import { COLORS } from "../theme";

const GRID = 90; // grid cell in px

// Slowly drifting glow positions (pure functions of the frame => deterministic render)
const glows = (frame: number, boost: number, w: number, h: number) => {
  const t = frame / 30;
  const wide = w > h;
  const gx = w * 0.24 + Math.sin(t * 0.55) * 140;
  const gy = h * 0.74 + Math.cos(t * 0.42) * 160;
  const g2x = w * 0.8 + Math.cos(t * 0.37) * 120;
  const g2y = h * 0.2 + Math.sin(t * 0.5) * 120;
  const bx = w * 0.59 + Math.cos(t * 0.33) * 180;
  const by = h * 0.4 + Math.sin(t * 0.29) * 220;
  const blue = wide ? "1300px 900px" : "900px 1100px";
  const a = (v: number) => Math.min(1, v * boost).toFixed(3);
  return [
    // blurred Apple green, lower left
    `radial-gradient(620px 620px at ${gx}px ${gy}px, rgba(48,209,88,${a(0.55)}) 0%, rgba(48,209,88,${a(0.18)}) 38%, rgba(48,209,88,0) 70%)`,
    // smaller green, upper right
    `radial-gradient(420px 420px at ${g2x}px ${g2y}px, rgba(48,209,88,${a(0.3)}) 0%, rgba(48,209,88,0) 70%)`,
    // deep Apple blue body
    `radial-gradient(${blue} at ${bx}px ${by}px, rgba(10,132,255,${a(0.42)}) 0%, rgba(11,63,158,${a(0.35)}) 35%, rgba(11,63,158,0) 72%)`,
  ].join(", ");
};

export const Background: React.FC<{ boost?: number }> = ({ boost = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  const drift = (frame * 0.6) % GRID;

  const gridMask = `repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent ${GRID}px), repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent ${GRID}px)`;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {/* Base navy gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(170deg, ${COLORS.navyMid} 0%, ${COLORS.navy} 45%, ${COLORS.ink} 100%)`,
        }}
      />
      {/* Soft blurred color glows */}
      <AbsoluteFill style={{ background: glows(frame, boost, width, height) }} />
      {/* Diagonal light streak (nod to the reference's blue sweep) */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${118 + Math.sin(frame / 70) * 6}deg, rgba(10,132,255,0) 30%, rgba(10,132,255,0.16) 46%, rgba(120,190,255,0.12) 50%, rgba(10,132,255,0) 64%)`,
          filter: "blur(40px)",
        }}
      />
      {/* Grid lit by the glows: blue grid where blue, green grid where green */}
      <AbsoluteFill
        style={{
          background: glows(frame, boost * 2.2, width, height),
          WebkitMaskImage: gridMask,
          maskImage: gridMask,
          WebkitMaskPosition: `${drift}px ${drift}px`,
          maskPosition: `${drift}px ${drift}px`,
          opacity: 0.55,
        }}
      />
      {/* Faint neutral grid so it reads in dark zones too */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(245,245,247,0.045)",
          WebkitMaskImage: gridMask,
          maskImage: gridMask,
          WebkitMaskPosition: `${drift}px ${drift}px`,
          maskPosition: `${drift}px ${drift}px`,
        }}
      />
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      {/* Film grain */}
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed={frame % 12}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
