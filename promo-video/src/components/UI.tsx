import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { mix, pop, rise } from "../anim";
import { C, TEXT } from "../theme";
import { ArrowRight, Pointer } from "./Icons";

/** Floating glass pill, like a notification or status badge. */
export const Chip: React.FC<{
  start: number;
  dark?: boolean;
  scale?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, dark = false, scale = 1, children, style }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, start, 30);
  const float = Math.sin((frame - start) / 22) * 6 * scale;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 14 * scale,
        padding: `${16 * scale}px ${26 * scale}px ${16 * scale}px ${20 * scale}px`,
        borderRadius: 999,
        fontFamily: TEXT,
        fontWeight: 500,
        fontSize: 30 * scale,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        color: dark ? C.white : C.ink,
        background: dark ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.82)",
        border: dark
          ? "1px solid rgba(255,255,255,0.16)"
          : "1px solid rgba(255,255,255,1)",
        boxShadow: dark
          ? "0 20px 50px rgba(0,0,0,0.45)"
          : "0 1px 0 rgba(29,29,31,0.04), 0 18px 44px rgba(29,29,31,0.12)",
        opacity: Math.min(1, p * 1.5),
        scale: `${0.7 + 0.3 * p}`,
        translate: `0 ${(1 - p) * 30 * scale + float}px`,
        filter: `blur(${(1 - Math.min(1, p)) * 8}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Pulsing green status dot. */
export const LiveDot: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const pulse = (frame % 45) / 45;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: C.green,
          scale: `${1 + pulse * 1.4}`,
          opacity: 0.45 * (1 - pulse),
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: C.green,
        }}
      />
    </div>
  );
};

/** Primary pill button: graphite black with a soft glow halo. */
export const PillButton: React.FC<{
  label: string;
  start: number;
  pressAt?: number;
  scale?: number;
  light?: boolean;
  icon?: React.ReactNode;
  minWidth?: number;
}> = ({ label, start, pressAt, scale = 1, light = false, icon, minWidth }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, start, 30);
  const press =
    pressAt === undefined
      ? 0
      : interpolate(frame, [pressAt - 3, pressAt, pressAt + 8], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const fg = light ? C.ink : C.white;
  const bg = light ? C.white : C.ink;
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        opacity: Math.min(1, p * 1.5),
        scale: `${(0.8 + 0.2 * p) * (1 - press * 0.06)}`,
        filter: `blur(${(1 - Math.min(1, p)) * 6}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "18% 6% -14% 6%",
          borderRadius: 999,
          background: `linear-gradient(90deg, ${C.blue}, ${C.violet}, ${C.pink}, ${C.orange})`,
          filter: `blur(${26 * scale}px)`,
          opacity: (light ? 0.7 : 0.55) + press * 0.3,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 22 * scale,
          minWidth,
          height: 96 * scale,
          padding: `0 ${14 * scale}px 0 ${44 * scale}px`,
          borderRadius: 999,
          background: bg,
          color: fg,
          fontFamily: TEXT,
          fontWeight: 600,
          fontSize: 34 * scale,
          letterSpacing: "-0.015em",
          whiteSpace: "nowrap",
          boxShadow: light
            ? "0 10px 30px rgba(0,0,0,0.35)"
            : "inset 0 1px 0 rgba(255,255,255,0.18), 0 14px 34px rgba(29,29,31,0.28)",
        }}
      >
        {icon}
        {label}
        <div
          style={{
            width: 68 * scale,
            height: 68 * scale,
            borderRadius: "50%",
            background: light ? C.ink : C.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowRight size={34 * scale} color={light ? C.white : C.ink} />
        </div>
      </div>
    </div>
  );
};

/**
 * A pointer that glides along a curve from `from` to `to`, then clicks.
 * Coordinates are in the parent's pixel space.
 */
export const Cursor: React.FC<{
  from: [number, number];
  to: [number, number];
  start: number;
  arrive: number;
  clickAt: number;
  size?: number;
}> = ({ from, to, start, arrive, clickAt, size = 44 }) => {
  const frame = useCurrentFrame();
  const t = rise(frame, start, arrive - start);
  const ctrl: [number, number] = [
    mix(from[0], to[0], 0.15),
    mix(from[1], to[1], 0.85),
  ];
  const u = 1 - t;
  const x = u * u * from[0] + 2 * u * t * ctrl[0] + t * t * to[0];
  const y = u * u * from[1] + 2 * u * t * ctrl[1] + t * t * to[1];
  const press = interpolate(
    frame,
    [clickAt - 3, clickAt, clickAt + 7],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const ripple = rise(frame, clickAt, 24);
  const visible = interpolate(frame, [start, start + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      {frame >= clickAt && (
        <div
          style={{
            position: "absolute",
            left: to[0],
            top: to[1],
            width: 140,
            height: 140,
            marginLeft: -70,
            marginTop: -70,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.9)",
            boxShadow: "0 0 30px rgba(162,89,255,0.6)",
            scale: `${0.2 + ripple * 1.1}`,
            opacity: 1 - ripple,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity: visible,
          scale: `${1 - press * 0.18}`,
          transformOrigin: "0 0",
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.3))",
        }}
      >
        <Pointer size={size} />
      </div>
    </>
  );
};
