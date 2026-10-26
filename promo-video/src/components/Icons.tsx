import React from "react";

export const InstagramGlyph: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="2.5"
      y="2.5"
      width="19"
      height="19"
      rx="5.5"
      stroke={color}
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="4.3" stroke={color} strokeWidth="2" />
    <circle cx="17.4" cy="6.6" r="1.25" fill={color} />
  </svg>
);

export const ArrowRight: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h13M13 6l6 6-6 6"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlayGlyph: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5z"
      fill={color}
    />
  </svg>
);

/** macOS-style pointer. Tip of the arrow is at (0, 0) of the box. */
export const Pointer: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 20 30">
    <path
      d="M1.5 1.5v22.2l5.6-5.3 3.6 8.4 3.9-1.7-3.6-8.2h7.7z"
      fill="#111"
      stroke="#fff"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);
