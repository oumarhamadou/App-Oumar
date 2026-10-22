import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { ease, PaletteName, palettes, sans } from "../../theme";
import { useLayout } from "../../lib/layout";
import { Glass } from "./Glass";
import { useCardMotion } from "./motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Dashboard card: number counts up, delta chip pops, a line chart draws in. */
export const StatCard: React.FC<{
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
  points?: number[];
  palette?: PaletteName;
  y?: number;
}> = ({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  delta,
  points = [4, 6, 5, 8, 7, 11, 10, 14, 13, 18, 22],
  palette = "aurora",
  y,
}) => {
  const { u, safe, safeWidth, anchors } = useLayout();
  const { frame, fps, k, blurIn, out, start } = useCardMotion();
  const c = palettes[palette];
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const count = interpolate(frame, [start + 0.15 * fps, start + 1.4 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });
  const draw = interpolate(frame, [start + 0.25 * fps, start + 1.6 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.inOut),
  });
  const chip = interpolate(frame, [start + 1.1 * fps, start + 1.5 * fps], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 12, mass: 0.6 }),
  });

  const formatted = (value * count).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const w = 1000;
  const h = 300;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * w,
    h - ((p - min) / (max - min || 1)) * (h - 30) - 15,
  ]);
  const line = coords
    .map(([x, yy], i) => {
      if (i === 0) return `M ${x} ${yy}`;
      const [px, py] = coords[i - 1];
      const cx = (px + x) / 2;
      return `C ${cx} ${py}, ${cx} ${yy}, ${x} ${yy}`;
    })
    .join(" ");
  const [lx, ly] = coords[coords.length - 1];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y ?? anchors.upper,
          left: safe.left,
          width: safeWidth,
          translate: `0px ${(1 - k) * 120 * u - out * 80 * u}px`,
          scale: String(0.9 + k * 0.1),
          opacity: Math.min(1, k * 1.5) * (1 - out),
          filter: `blur(${blurIn * 12 * u + out * 10 * u}px)`,
        }}
      >
        <Glass palette={palette} radius={44} padding={40}>
          <div style={{ fontFamily: sans, color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 30 * u, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>
                {label}
              </div>
              {delta ? (
                <div
                  style={{
                    scale: String(chip),
                    opacity: Math.min(1, chip),
                    padding: `${8 * u}px ${18 * u}px`,
                    borderRadius: 999,
                    fontSize: 28 * u,
                    fontWeight: 700,
                    color: "#062B1B",
                    background: "linear-gradient(120deg, #6EE7B7, #34D399)",
                    boxShadow: `0 0 ${24 * u}px #34D39966`,
                  }}
                >
                  ▲ {delta}
                </div>
              ) : null}
            </div>
            <div
              style={{
                marginTop: 10 * u,
                fontSize: 116 * u,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.05,
              }}
            >
              {prefix}
              {formatted}
              {suffix}
            </div>
            <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 230 * u, marginTop: 18 * u, overflow: "visible" }}>
              <defs>
                <linearGradient id={`stroke-${id}`} x1="0" x2="1">
                  <stop offset="0" stopColor={c[1]} />
                  <stop offset="0.6" stopColor={c[3]} />
                  <stop offset="1" stopColor={c[4]} />
                </linearGradient>
                <linearGradient id={`fill-${id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={c[2]} stopOpacity={0.45} />
                  <stop offset="1" stopColor={c[2]} stopOpacity={0} />
                </linearGradient>
                <clipPath id={`clip-${id}`}>
                  <rect x={0} y={-20} width={w * draw} height={h + 40} />
                </clipPath>
              </defs>
              {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1={0} x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
              ))}
              <path d={`${line} L ${w} ${h} L 0 ${h} Z`} fill={`url(#fill-${id})`} clipPath={`url(#clip-${id})`} />
              <path
                d={line}
                fill="none"
                stroke={`url(#stroke-${id})`}
                strokeWidth={8}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
              />
              <circle cx={lx} cy={ly} r={14 * draw} fill="white" opacity={draw > 0.98 ? 1 : 0} />
              <circle cx={lx} cy={ly} r={34 * draw} fill={c[3]} opacity={draw > 0.98 ? 0.35 : 0} />
            </svg>
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};
