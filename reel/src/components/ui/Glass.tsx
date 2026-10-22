import React from "react";
import { PaletteName, palettes } from "../../theme";
import { useLayout } from "../../lib/layout";

/** Frosted-glass surface with a gradient hairline border, shared by all UI. */
export const Glass: React.FC<{
  palette?: PaletteName;
  radius?: number;
  padding?: number | string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ palette = "aurora", radius = 34, padding = 32, style, children }) => {
  const { u } = useLayout();
  const c = palettes[palette];
  return (
    <div
      style={{
        position: "relative",
        borderRadius: radius * u,
        padding: typeof padding === "number" ? padding * u : padding,
        background:
          "linear-gradient(160deg, rgba(36,36,52,0.72) 0%, rgba(14,14,24,0.78) 100%)",
        backdropFilter: `blur(${26 * u}px) saturate(160%)`,
        WebkitBackdropFilter: `blur(${26 * u}px) saturate(160%)`,
        boxShadow: `0 ${30 * u}px ${80 * u}px rgba(0,0,0,0.45), 0 0 ${60 * u}px ${c[2]}22, inset 0 ${1.5 * u}px 0 rgba(255,255,255,0.14)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius * u,
          padding: 1.6 * u,
          background: `linear-gradient(135deg, ${c[3]}aa, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 65%, ${c[1]}aa)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};
