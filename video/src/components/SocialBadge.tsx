import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import type { BadgePosition } from "../script/types";
import { easeInOut } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Glyphe Instagram au trait, avec passage animé au dégradé de la marque
 * (`colorize` : intensité 0 → 1 du dégradé).
 */
export const InstagramGlyph: React.FC<{
  size: number;
  color: string;
  colorize: number;
  gradientAngle: number;
  id: string;
}> = ({ size, color, colorize, gradientAngle, id }) => {
  const shape = (stroke: string) => (
    <>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.4"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
      />
      <circle cx="17.4" cy="6.6" r="1.25" fill={stroke} />
    </>
  );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="1"
          x2="1"
          y2="0"
          gradientTransform={`rotate(${gradientAngle} 0.5 0.5)`}
        >
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.25" stopColor="#FA7E1E" />
          <stop offset="0.5" stopColor="#D62976" />
          <stop offset="0.75" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <g opacity={1 - colorize}>{shape(color)}</g>
      <g opacity={colorize}>{shape(`url(#${id})`)}</g>
    </svg>
  );
};

export const SocialBadge: React.FC<{
  position: BadgePosition;
  onLight: boolean;
  /** Images (relatives à la scène) où l'icône entre puis prend ses couleurs. */
  appearAt?: number;
  colorizeAt?: number;
}> = ({ position, onLight, appearAt, colorizeAt }) => {
  const frame = useCurrentFrame();
  const color = onLight ? "#3A0808" : "#FFFFFF";
  const colorize =
    colorizeAt === undefined
      ? 0
      : interpolate(
          frame,
          [colorizeAt, colorizeAt + 12, colorizeAt + 60, colorizeAt + 75],
          [0, 1, 1, 0],
          { ...clamp, easing: easeInOut },
        );
  const visible =
    appearAt === undefined
      ? 1
      : interpolate(frame, [appearAt, appearAt + 14], [0, 1], {
          ...clamp,
          easing: easeInOut,
        });
  const anchor: React.CSSProperties =
    position === "top-right"
      ? { top: 70, right: 96 }
      : { top: "50%", left: 96, translate: "0 -50%" };
  return (
    <div
      style={{
        position: "absolute",
        opacity: (onLight ? 0.3 : 0.95) * visible,
        scale: interpolate(visible, [0, 1], [0.7, 1]),
        ...anchor,
      }}
    >
      <InstagramGlyph
        size={54}
        color={color}
        colorize={colorize}
        gradientAngle={interpolate(frame, [0, 90], [0, 120])}
        id={`ig-${position}-${onLight ? "l" : "d"}`}
      />
    </div>
  );
};
