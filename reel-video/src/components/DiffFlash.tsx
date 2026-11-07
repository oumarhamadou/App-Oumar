import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_IN_OUT } from "../theme";

// Full-frame inversion transition, as an expanding shockwave ring.
// A plain "difference" disc would turn the navy background orange, so the ring
// inverts the luminance and rotates the hue back (iOS "Smart Invert"):
// dark navy becomes light, white text becomes dark, blue/green keep their hue.
const MAX_R = 1200; // > half diagonal of 1080x1920

export const DiffFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const outer = interpolate(frame, [0, 9], [0, MAX_R], { ...CLAMP, easing: EASE_IN });
  const inner = interpolate(frame, [9, 21], [0, MAX_R], { ...CLAMP, easing: EASE_IN_OUT });
  const hole = `radial-gradient(circle at 50% 50%, transparent ${inner}px, #000 ${inner + 1}px)`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 540 - outer,
          top: 960 - outer,
          width: outer * 2,
          height: outer * 2,
          borderRadius: "50%",
          backdropFilter: "invert(1) hue-rotate(180deg)",
          WebkitBackdropFilter: "invert(1) hue-rotate(180deg)",
          WebkitMaskImage: hole,
          maskImage: hole,
        }}
      />
    </AbsoluteFill>
  );
};
