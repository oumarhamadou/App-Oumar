import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// Grain argentique + vignettage : donne la matière « papier » des fonds unis.
export const Texture: React.FC = () => {
  const frame = useCurrentFrame();
  // Le grain change toutes les deux images, comme une pellicule.
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        style={{ mixBlendMode: "soft-light", opacity: 0.38 }}
      >
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 62%, rgba(35,6,6,0.10) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};
