import React from "react";
import { interpolate } from "remotion";
import { CLAMP, EASE_IN_OUT } from "../theme";

type Props = {
  t: number;
  at: number;
  size: number;
  color: string;
};

// Étoile à huit branches (khatam) tracée au trait.
export const Ornament: React.FC<Props> = ({ t, at, size, color }) => {
  const draw = interpolate(t, [at, at + 0.9], [1, 0], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const dot = interpolate(t, [at + 0.55, at + 0.85], [0, 1], CLAMP);
  const stroke = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.4,
    strokeDasharray: 1,
    strokeDashoffset: draw,
  } as const;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        rotate: `${interpolate(t, [at, at + 1.6], [-45, 0], { ...CLAMP, easing: EASE_IN_OUT })}deg`,
      }}
    >
      <rect
        x="22"
        y="22"
        width="56"
        height="56"
        pathLength={1}
        style={stroke}
      />
      <rect
        x="22"
        y="22"
        width="56"
        height="56"
        pathLength={1}
        transform="rotate(45 50 50)"
        style={stroke}
      />
      <circle cx="50" cy="50" r="16" pathLength={1} style={stroke} />
      <circle cx="50" cy="50" r="3.2" fill={color} opacity={dot} />
    </svg>
  );
};

// Séparateur : deux filets qui partent du centre autour d'un losange.
export const Divider: React.FC<Props & { width: number }> = ({
  t,
  at,
  size,
  color,
  width,
}) => {
  const grow = interpolate(t, [at, at + 0.6], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const line: React.CSSProperties = {
    width,
    height: Math.max(1, size * 0.12),
    backgroundColor: color,
    scale: `${grow} 1`,
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.9,
        opacity: interpolate(t, [at, at + 0.2], [0, 0.55], CLAMP),
      }}
    >
      <div style={{ ...line, transformOrigin: "right center" }} />
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          rotate: "45deg",
          scale: interpolate(t, [at + 0.1, at + 0.45], [0, 1], {
            ...CLAMP,
            easing: EASE_IN_OUT,
          }),
        }}
      />
      <div style={{ ...line, transformOrigin: "left center" }} />
    </div>
  );
};
