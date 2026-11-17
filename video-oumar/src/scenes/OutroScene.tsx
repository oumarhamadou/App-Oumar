import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, pop, ramp } from "../anim";
import { FONT } from "../fonts";
import { scene } from "../timeline";

/** Closing card: the name, glowing, letter by letter. */
export const OutroScene: React.FC<{ signature: string; tagline: string }> = ({
  signature,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = scene("outro");
  const fadeOut = interpolate(frame, [durationInFrames - 14, durationInFrames], [0, 1], {
    ...CLAMP,
    easing: EASE_IN,
  });
  const halo = ramp(frame, 0, 24);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 38% 16% at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)",
          opacity: halo * (1 - fadeOut),
          scale: String(0.6 + 0.4 * halo),
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: 1 - fadeOut,
          scale: String(1 + frame * 0.0015),
        }}
      >
        <div style={{ display: "flex" }}>
          {signature.split("").map((ch, i) => {
            const p = pop(frame, 2 + i * 3, { damping: 18, stiffness: 120 });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontSize: 170,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "white",
                  textShadow:
                    "0 0 24px rgba(255,255,255,0.75), 0 0 60px rgba(255,255,255,0.45), 0 0 120px rgba(255,255,255,0.25)",
                  opacity: Math.min(1, Math.max(0, p) * 1.4),
                  filter: `blur(${Math.max(0, 1 - p) * 22}px)`,
                  translate: `0px ${(1 - p) * 26}px`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 40,
            fontWeight: 600,
            color: "#9AA3B2",
            letterSpacing: "0.01em",
            opacity: ramp(frame, 22, 36),
            translate: `0px ${(1 - ramp(frame, 22, 36)) * 16}px`,
          }}
        >
          {tagline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
