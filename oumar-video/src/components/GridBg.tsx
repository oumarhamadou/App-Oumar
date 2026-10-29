import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

type Variant = "white" | "green" | "blue";

const looks: Record<
  Variant,
  { base: string; line: string; glow: string; drift: number }
> = {
  white: {
    base: "#FFFFFF",
    line: "rgba(29,29,31,0.065)",
    glow: "radial-gradient(ellipse 75% 60% at 50% 50%, rgba(255,255,255,0) 35%, rgba(245,245,247,0.95) 100%)",
    drift: 0,
  },
  green: {
    base: "linear-gradient(180deg, #2ED158 0%, #5FDD7F 45%, #BFF2CC 100%)",
    line: "rgba(255,255,255,0.32)",
    glow: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%)",
    drift: 0.35,
  },
  blue: {
    base: "linear-gradient(180deg, #2A95FF 0%, #0A84FF 40%, #0060DF 100%)",
    line: "rgba(255,255,255,0.17)",
    glow: "radial-gradient(ellipse 80% 55% at 50% 30%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)",
    drift: 0.35,
  },
};

export const GridBg: React.FC<{ variant: Variant; cell?: number }> = ({
  variant,
  cell = 60,
}) => {
  const frame = useCurrentFrame();
  const look = looks[variant];
  const offset = frame * look.drift;

  return (
    <AbsoluteFill style={{ background: look.base }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${look.line} 2px, transparent 2px), linear-gradient(90deg, ${look.line} 2px, transparent 2px)`,
          backgroundSize: `${cell}px ${cell}px`,
          backgroundPosition: `calc(50% + 0px) calc(50% + ${offset}px)`,
        }}
      />
      <AbsoluteFill style={{ background: look.glow }} />
    </AbsoluteFill>
  );
};
