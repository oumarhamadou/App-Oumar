import React from "react";

// Small set of original editing-tool glyphs (24x24 grid), drawn in white.
export type IconName =
  | "play"
  | "pause"
  | "keyframe"
  | "cursor"
  | "text"
  | "scissors"
  | "magnet"
  | "crop"
  | "move"
  | "pen"
  | "wave"
  | "square"
  | "triangle"
  | "search"
  | "layers"
  | "sparkle"
  | "record"
  | "undo";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const paths: Record<IconName, React.ReactNode> = {
  play: <path d="M7 4.5 19.5 12 7 19.5Z" fill="currentColor" />,
  pause: (
    <>
      <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" />
    </>
  ),
  keyframe: <path d="M12 3 21 12 12 21 3 12Z" fill="currentColor" />,
  cursor: <path d="M5 3.5 19 10.2 12.6 12.4 10.3 19Z" fill="currentColor" />,
  text: <path d="M5 5h14v3.2h-5.4V20h-3.2V8.2H5Z" fill="currentColor" />,
  scissors: (
    <g {...S}>
      <circle cx="6" cy="17.5" r="2.8" />
      <circle cx="18" cy="17.5" r="2.8" />
      <path d="M8 15.5 17 4M16 15.5 7 4" />
    </g>
  ),
  magnet: <path d="M5 4h4.5v8a2.5 2.5 0 0 0 5 0V4H19v8a7 7 0 0 1-14 0Z" fill="currentColor" />,
  crop: (
    <g {...S}>
      <path d="M6.5 2.5v15h15M2.5 6.5h15v15" />
    </g>
  ),
  move: (
    <g>
      <path d="M12 4v16M4 12h16" {...S} />
      <path d="M12 1.5 15 5H9ZM12 22.5 9 19h6ZM1.5 12 5 9v6ZM22.5 12 19 15V9Z" fill="currentColor" />
    </g>
  ),
  pen: (
    <g>
      <path d="M12 2.5 18.5 11 12 21.5 5.5 11Z" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="#030B22" />
    </g>
  ),
  wave: (
    <g fill="currentColor">
      <rect x="2" y="9" width="2.6" height="6" rx="1.3" />
      <rect x="6.4" y="5" width="2.6" height="14" rx="1.3" />
      <rect x="10.8" y="2.5" width="2.6" height="19" rx="1.3" />
      <rect x="15.2" y="6.5" width="2.6" height="11" rx="1.3" />
      <rect x="19.6" y="9.5" width="2.6" height="5" rx="1.3" />
    </g>
  ),
  square: <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />,
  triangle: <path d="M12 3.5 21 20H3Z" fill="currentColor" />,
  search: (
    <g {...S}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5.5 5.5" />
    </g>
  ),
  layers: (
    <g {...S}>
      <path d="M12 3.5 21 8.5 12 13.5 3 8.5Z" />
      <path d="M3 13l9 5 9-5" />
    </g>
  ),
  sparkle: <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z" fill="currentColor" />,
  record: (
    <g>
      <circle cx="12" cy="12" r="9" {...S} />
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    </g>
  ),
  undo: (
    <g {...S}>
      <path d="M8 5 3.5 9.5 8 14" />
      <path d="M4 9.5h10a6 6 0 0 1 0 12h-4" />
    </g>
  ),
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name, size = 48, color = "#F5F5F7", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ color, display: "block", ...style }}>
    {paths[name]}
  </svg>
);

export const TelegramGlyph: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "#F5F5F7" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
    <path
      d="M21.4 3.6 2.9 10.7c-1.3.5-1.2 1.3-.2 1.6l4.7 1.5 1.8 5.6c.2.7.4.9.9.9.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8L22.8 5c.3-1.3-.5-1.9-1.4-1.4ZM9.9 14.2l-.4 4.1-1.4-4.6 10.2-6.4Z"
      fill={color}
    />
  </svg>
);

export const MacCursor: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", overflow: "visible" }}>
    <path
      d="M5 2.5v17.2l4.3-4.1 2.8 6.4 2.9-1.3-2.8-6.3h6Z"
      fill="#F5F5F7"
      stroke="#01040C"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);
