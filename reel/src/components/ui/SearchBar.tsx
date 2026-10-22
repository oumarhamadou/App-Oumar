import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { ease, PaletteName, palettes, sans } from "../../theme";
import { useLayout } from "../../lib/layout";
import { Glass } from "./Glass";
import { useCardMotion } from "./motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Prompt / search field that types itself out, then "submits" with a glow. */
export const SearchBar: React.FC<{
  query: string;
  placeholder?: string;
  /** Characters per second. */
  speed?: number;
  palette?: PaletteName;
  y?: number;
}> = ({ query, placeholder = "Ask anything…", speed = 18, palette = "aurora", y }) => {
  const { u, safe, safeWidth, anchors } = useLayout();
  const { frame, fps, k, blurIn, out, start } = useCardMotion();
  const c = palettes[palette];

  const typeStart = start + Math.round(0.45 * fps);
  const chars = Math.max(0, Math.floor(((frame - typeStart) / fps) * speed));
  const typed = query.slice(0, chars);
  const done = chars >= query.length;
  const doneAt = typeStart + Math.ceil((query.length / speed) * fps);
  const caretOn = !done ? true : Math.floor((frame - doneAt) / (fps * 0.4)) % 2 === 0;
  const submit = interpolate(frame, [doneAt + 0.35 * fps, doneAt + 0.5 * fps, doneAt + 0.75 * fps], [0, 1, 0], clamp);
  const glow = interpolate(frame, [doneAt + 0.35 * fps, doneAt + 0.9 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y ?? anchors.upper,
          left: safe.left,
          width: safeWidth,
          translate: `0px ${(1 - k) * 90 * u - out * 70 * u}px`,
          scale: String(0.92 + k * 0.08),
          opacity: Math.min(1, k * 1.5) * (1 - out),
          filter: `blur(${blurIn * 10 * u + out * 8 * u}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -6 * u,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${c[1]}, ${c[3]}, ${c[4]}, ${c[1]})`,
            filter: `blur(${(14 + glow * 16) * u}px)`,
            opacity: 0.35 + glow * 0.5,
          }}
        />
        <Glass palette={palette} radius={999} padding={`${26 * u}px ${30 * u}px`}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 * u, fontFamily: sans }}>
            <svg width={44 * u} height={44 * u} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" style={{ opacity: 0.75, flex: "none" }}>
              <circle cx={11} cy={11} r={7} />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <div
              style={{
                flex: 1,
                fontSize: 40 * u,
                fontWeight: 500,
                color: typed ? "white" : "rgba(255,255,255,0.4)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                letterSpacing: "-0.01em",
              }}
            >
              {typed || placeholder}
              <span
                style={{
                  display: "inline-block",
                  width: 4 * u,
                  height: 46 * u,
                  marginLeft: 4 * u,
                  verticalAlign: "middle",
                  borderRadius: 2,
                  background: c[3],
                  opacity: caretOn ? 1 : 0,
                }}
              />
            </div>
            <div
              style={{
                flex: "none",
                width: 76 * u,
                height: 76 * u,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${c[1]}, ${c[3]})`,
                scale: String(1 - submit * 0.12),
                boxShadow: `0 0 ${(10 + glow * 30) * u}px ${c[2]}aa`,
              }}
            >
              <svg width={36 * u} height={36 * u} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};
