import React from "react";
import { interpolate } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT } from "../theme";

type Props = {
  t: number;
  at: number;
  color: string;
  u: number;
  children: React.ReactNode;
};

// Encadré coloré : un trait se dessine de droite à gauche puis s'ouvre en hauteur.
// Seul le fond est animé, le texte garde ses proportions.
export const HighlightBox: React.FC<Props> = ({
  t,
  at,
  color,
  u,
  children,
}) => {
  const across = interpolate(t, [at, at + 0.26], [100, 0], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const open = interpolate(t, [at + 0.2, at + 0.48], [46, 0], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  return (
    <div
      style={{
        position: "relative",
        padding: `${4 * u}px ${44 * u}px ${12 * u}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: color,
          borderRadius: 6 * u,
          boxShadow: `0 ${18 * u}px ${40 * u}px rgba(40, 4, 4, 0.18)`,
          clipPath: `inset(${open}% 0 ${open}% ${across}%)`,
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};
