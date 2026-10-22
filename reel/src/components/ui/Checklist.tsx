import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { ease, PaletteName, palettes, sans } from "../../theme";
import { useLayout } from "../../lib/layout";
import { Glass } from "./Glass";
import { useCardMotion } from "./motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Task card whose items tick off one by one (gradient fill + drawn check). */
export const Checklist: React.FC<{
  title?: string;
  items: string[];
  /** Seconds between ticks. */
  every?: number;
  palette?: PaletteName;
  y?: number;
}> = ({ title, items, every = 0.45, palette = "aurora", y }) => {
  const { u, safe, safeWidth, anchors } = useLayout();
  const { frame, fps, k, blurIn, out, start } = useCardMotion();
  const c = palettes[palette];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y ?? anchors.upper,
          left: safe.left,
          width: safeWidth,
          translate: `0px ${(1 - k) * 110 * u - out * 80 * u}px`,
          scale: String(0.92 + k * 0.08),
          opacity: Math.min(1, k * 1.5) * (1 - out),
          filter: `blur(${blurIn * 10 * u + out * 8 * u}px)`,
        }}
      >
        <Glass palette={palette} radius={40} padding={38}>
          <div style={{ fontFamily: sans, color: "white" }}>
            {title ? (
              <div style={{ fontSize: 30 * u, fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 22 * u, letterSpacing: "0.02em" }}>
                {title}
              </div>
            ) : null}
            {items.map((item, i) => {
              const at = start + Math.round((0.5 + i * every) * fps);
              const row = interpolate(frame, [start + i * 3 + 4, start + i * 3 + 4 + 0.4 * fps], [0, 1], {
                ...clamp,
                easing: Easing.bezier(...ease.out),
              });
              const tick = interpolate(frame, [at, at + Math.round(0.22 * fps)], [0, 1], {
                ...clamp,
                easing: Easing.bezier(...ease.out),
              });
              const pop = interpolate(frame, [at, at + 4, at + 9], [1, 1.18, 1], clamp);
              return (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24 * u,
                    padding: `${16 * u}px 0`,
                    opacity: row,
                    translate: `${(1 - row) * 30 * u}px 0px`,
                    borderTop: i === 0 ? "none" : `1px solid rgba(255,255,255,0.07)`,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      flex: "none",
                      width: 56 * u,
                      height: 56 * u,
                      borderRadius: 16 * u,
                      border: `${2.5 * u}px solid rgba(255,255,255,0.25)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      scale: String(pop),
                      boxShadow: `0 0 ${24 * u * tick}px ${c[2]}88`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: -2.5 * u,
                        borderRadius: 16 * u,
                        background: `linear-gradient(135deg, ${c[1]}, ${c[3]})`,
                        opacity: tick,
                        scale: String(0.6 + tick * 0.4),
                      }}
                    />
                    <svg width={34 * u} height={34 * u} viewBox="0 0 24 24" fill="none" style={{ position: "relative" }}>
                      <path
                        d="M5 12.5l4.2 4.2L19 7"
                        stroke="white"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - tick}
                      />
                    </svg>
                  </div>
                  <div
                    style={{
                      fontSize: 40 * u,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: `rgba(255,255,255,${0.55 + tick * 0.45})`,
                    }}
                  >
                    {item}
                  </div>
                </div>
              );
            })}
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};
