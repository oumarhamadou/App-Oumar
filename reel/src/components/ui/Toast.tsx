import React from "react";
import { AbsoluteFill } from "remotion";
import { PaletteName, palettes, sans } from "../../theme";
import { useLayout } from "../../lib/layout";
import { Glass } from "./Glass";
import { useCardMotion } from "./motion";

/** iOS/SaaS push notification that drops in from the top of the safe area. */
export const Toast: React.FC<{
  app: string;
  title: string;
  body: string;
  time?: string;
  glyph?: string;
  palette?: PaletteName;
  y?: number;
}> = ({ app, title, body, time = "now", glyph = "✦", palette = "aurora", y }) => {
  const { u, safe, safeWidth, anchors } = useLayout();
  const { k, blurIn, out } = useCardMotion();
  const c = palettes[palette];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y ?? anchors.upper,
          left: safe.left,
          width: safeWidth,
          translate: `0px ${(1 - k) * -160 * u - out * 120 * u}px`,
          scale: String(0.92 + k * 0.08),
          opacity: Math.min(1, k * 1.5) * (1 - out),
          filter: `blur(${blurIn * 10 * u + out * 8 * u}px)`,
        }}
      >
        <Glass palette={palette} radius={40} padding={28}>
          <div style={{ display: "flex", gap: 24 * u, alignItems: "center", fontFamily: sans }}>
            <div
              style={{
                flex: "none",
                width: 96 * u,
                height: 96 * u,
                borderRadius: 26 * u,
                background: `linear-gradient(140deg, ${c[1]}, ${c[3]} 70%, ${c[4]})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 50 * u,
                fontWeight: 800,
                boxShadow: `inset 0 ${2 * u}px 0 rgba(255,255,255,0.35), 0 ${10 * u}px ${30 * u}px ${c[2]}66`,
              }}
            >
              {glyph}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 26 * u,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase",
                }}
              >
                <span>{app}</span>
                <span style={{ textTransform: "none", letterSpacing: 0 }}>{time}</span>
              </div>
              <div style={{ marginTop: 6 * u, fontSize: 40 * u, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
                {title}
              </div>
              <div style={{ marginTop: 4 * u, fontSize: 32 * u, fontWeight: 500, color: "rgba(255,255,255,0.72)" }}>
                {body}
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};
