import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useLayout } from "../../lib/layout";

/**
 * Final polish stacked over everything: soft vignette, caption scrim and an
 * animated film grain (re-seeded every 2 frames, like real stock).
 */
export const Finish: React.FC<{ grain?: number; vignette?: number }> = ({
  grain = 0.09,
  vignette = 0.55,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  const seed = Math.floor(frame / 2) % 97;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 16%, transparent 58%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute", opacity: grain, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
