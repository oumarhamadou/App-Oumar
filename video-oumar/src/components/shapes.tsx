import React from "react";

/** Four-pointed sparkle star. */
export const Sparkle: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = "white",
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path
      d="M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0 Z"
      fill={color}
    />
  </svg>
);

/** Classic arrow mouse pointer. */
export const Cursor: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 64,
  style,
}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 26 36" style={style}>
    <path
      d="M2 2 L2 28 L8.5 22 L13 33 L17.5 31 L13 20.5 L22 20.5 Z"
      fill="white"
      stroke="#111"
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon: React.FC<{ size: number; color: string; stroke?: number }> = ({
  size,
  color,
  stroke = 3,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 4v16M4 12h16" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const MinusIcon: React.FC<{ size: number; color: string; stroke?: number }> = ({
  size,
  color,
  stroke = 3,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 12h16" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </svg>
);

export const MicIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="8.5" y="3" width="7" height="12" rx="3.5" stroke={color} strokeWidth={2} />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export const ArrowUpIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 19V5M5.5 11.5 12 5l6.5 6.5"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronIcon: React.FC<{
  size: number;
  color: string;
  direction: "left" | "right" | "down";
  stroke?: number;
}> = ({ size, color, direction, stroke = 2.6 }) => {
  const d =
    direction === "left"
      ? "M15 5 8 12l7 7"
      : direction === "right"
        ? "M9 5l7 7-7 7"
        : "M6 9l6 6 6-6";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d={d} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ImageIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="5" width="14" height="12" rx="2.5" stroke={color} strokeWidth={1.8} />
    <path d="M7 19.5h11a2.5 2.5 0 0 0 2.5-2.5V8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <circle cx="8.5" cy="9.5" r="1.4" fill={color} />
    <path d="m4.5 15.5 4-3.5 3 2.5 2-1.5 3.5 2.5" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

export const CloseIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6 6 18" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
  </svg>
);
