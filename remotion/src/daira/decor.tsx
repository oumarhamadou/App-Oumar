import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT } from "../theme";

const BOUNCE = Easing.bezier(0.34, 1.56, 0.64, 1);

// « إذا دائرتك صارت تصغر » : un anneau qui se resserre pendant la phrase.
export const ShrinkingRing: React.FC<{ t: number; u: number }> = ({ t, u }) => {
  const r =
    interpolate(t, [0.1, 1.3], [760, 430], { ...CLAMP, easing: EASE_IN_OUT }) *
    u;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          border: `${2 * u}px solid ${COLORS.blush}`,
          opacity: interpolate(
            t,
            [-0.1, 0.3, 1.4, 2.8],
            [0, 0.42, 0.42, 0.14],
            CLAMP,
          ),
        }}
      />
    </AbsoluteFill>
  );
};

// « فدائرة صغيرة … أفضل من دائرة كبيرة فاضية » : un petit disque plein qui pulse,
// puis un grand cercle en pointillés qui tourne à vide et s'efface.
export const CircleMotif: React.FC<{
  t: number;
  u: number;
  portrait: boolean;
}> = ({ t, u, portrait }) => {
  const dot = interpolate(t, [27.35, 27.85], [0, 1], {
    ...CLAMP,
    easing: BOUNCE,
  });
  const pulse = 1 + 0.06 * Math.sin((t - 27.4) * 4);
  const ring = interpolate(t, [31.0, 31.6], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const empty = interpolate(t, [31.55, 32.6], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const r = (portrait ? 520 : 610) * u;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <svg
        width={r * 2 + 8}
        height={r * 2 + 8}
        style={{
          position: "absolute",
          opacity: ring * (0.5 - 0.32 * empty),
          scale: 1.12 - 0.12 * ring + 0.05 * empty,
          rotate: `${t * 9}deg`,
        }}
      >
        <circle
          cx={r + 4}
          cy={r + 4}
          r={r}
          fill="none"
          stroke={COLORS.sand}
          strokeWidth={2.5 * u}
          strokeDasharray={`${(14 - 9 * empty) * u} ${(16 + 26 * empty) * u}`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: `calc(50% - ${(portrait ? 640 : 330) * u}px)`,
          width: 70 * u,
          height: 70 * u,
          borderRadius: "50%",
          backgroundColor: COLORS.sand,
          boxShadow: `0 0 ${40 * u}px rgba(213, 196, 175, 0.55)`,
          scale: dot * pulse,
          opacity: dot,
        }}
      />
    </AbsoluteFill>
  );
};
