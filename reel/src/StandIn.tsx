import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Placeholder "footage": a backlit talking-head silhouette in front of city
 * bokeh, with handheld drift. Rendered to public/standin.mp4 so the style demo
 * runs through the exact same <Video> pipeline as real footage.
 */
export const StandIn: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;

  const bokeh = Array.from({ length: 26 }, (_, i) => {
    const warm = random(`w${i}`) > 0.45;
    const size = 60 + random(`s${i}`) * 220;
    const x = random(`x${i}`) * width + Math.sin(t * 0.3 + i) * 30;
    const y = random(`y${i}`) * height * 0.75 + Math.cos(t * 0.25 + i) * 20;
    const flicker = 0.35 + 0.25 * Math.sin(t * (0.8 + random(`f${i}`)) + i);
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: warm
            ? "radial-gradient(circle, rgba(255,184,107,0.9), rgba(255,140,60,0.25) 60%, transparent 72%)"
            : "radial-gradient(circle, rgba(120,200,255,0.8), rgba(70,120,255,0.2) 60%, transparent 72%)",
          opacity: flicker,
          filter: `blur(${6 + random(`b${i}`) * 10}px)`,
        }}
      />
    );
  });

  // Gentle handheld motion plus a "talking" head bob.
  const hx = Math.sin(t * 0.7) * 8 + Math.sin(t * 1.9) * 3;
  const hy = Math.cos(t * 0.5) * 6;
  const talk = Math.sin(t * 7.5) * Math.sin(t * 1.3) * 4;

  return (
    <AbsoluteFill style={{ background: "#120E14", overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${hx}px ${hy}px`, scale: "1.04" }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, #3A2A36 0%, #1A1520 55%, #0B090E 100%)",
          }}
        />
        <AbsoluteFill style={{ filter: "blur(2px)" }}>{bokeh}</AbsoluteFill>
        {/* Rim-lit silhouette */}
        <svg
          viewBox="0 0 1080 1920"
          width={width}
          height={height}
          style={{ position: "absolute", translate: `0px ${talk}px`, filter: "blur(1.5px)" }}
        >
          <defs>
            <radialGradient id="rim" cx="0.46" cy="0.52" r="0.5">
              <stop offset="0.8" stopColor="#0C090D" />
              <stop offset="0.93" stopColor="#4A2E26" />
              <stop offset="1" stopColor="#F0A86E" />
            </radialGradient>
            <linearGradient id="body" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#2A1E22" />
              <stop offset="1" stopColor="#09070A" />
            </linearGradient>
          </defs>
          <path
            d="M120 1920 C 140 1560, 300 1390, 470 1350 L 470 1250 L 610 1250 L 610 1350 C 780 1390, 940 1560, 960 1920 Z"
            fill="url(#body)"
            stroke="#C9825A"
            strokeOpacity={0.55}
            strokeWidth={5}
          />
          <ellipse cx={540} cy={1010} rx={190} ry={245} fill="url(#rim)" />
        </svg>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(115deg, rgba(255,170,110,0.18) 0%, transparent 35%, transparent 70%, rgba(90,140,255,0.16) 100%)",
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
