import React from "react";

export type Platform = "instagram" | "x" | "youtube";

/** Simplified platform marks, drawn as SVG. */
export const PlatformLogo: React.FC<{ platform: Platform; size: number }> = ({
  platform,
  size,
}) => {
  if (platform === "instagram") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <radialGradient id="ig" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#FDF497" />
            <stop offset="5%" stopColor="#FDF497" />
            <stop offset="45%" stopColor="#FD5949" />
            <stop offset="60%" stopColor="#D6249F" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" rx="26" fill="url(#ig)" />
        <rect x="22" y="22" width="56" height="56" rx="17" fill="none" stroke="white" strokeWidth="7" />
        <circle cx="50" cy="50" r="13.5" fill="none" stroke="white" strokeWidth="7" />
        <circle cx="66.5" cy="33.5" r="4.2" fill="white" />
      </svg>
    );
  }
  if (platform === "x") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="0" y="0" width="100" height="100" rx="26" fill="#0B0B0C" />
        <path d="M27 25 H40 L74 75 H61 Z" fill="white" />
        <path d="M70 25 L55 42.5 L51.5 37.5 L64.5 25 Z" fill="white" />
        <path d="M30 75 L45.5 57 L49 62 L36.5 75 Z" fill="white" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="6" y="20" width="88" height="60" rx="18" fill="#FF0033" />
      <path d="M42 36 L64 50 L42 64 Z" fill="white" />
    </svg>
  );
};
