import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Background } from "../theme";

/** Grain argentique discret, renouvelé toutes les deux images. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity }}
    >
      <svg width={width} height={height}>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={Math.floor(frame / 2)}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

const vignettes: Record<Background, string> = {
  maroon: "rgba(10, 0, 0, 0.45)",
  cream: "rgba(120, 70, 40, 0.10)",
  blush: "rgba(120, 50, 40, 0.12)",
};

export const Vignette: React.FC<{ bg: Background }> = ({ bg }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 70% at 50% 48%, transparent 55%, ${vignettes[bg]} 100%)`,
    }}
  />
);
