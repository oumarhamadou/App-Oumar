import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { pop, rise } from "../anim";
import { C } from "../theme";

/**
 * Cut-out portrait in a disc, head breaking out of the top edge,
 * wrapped in a slowly turning glow ring.
 */
export const Avatar: React.FC<{ size: number; start: number }> = ({
  size: D,
  start,
}) => {
  const frame = useCurrentFrame();
  const r = D / 2;
  const appear = pop(frame, start, 34);
  const ring = rise(frame, start + 6, 40);
  const photo = rise(frame, start + 4, 30);
  const angle = (frame - start) * 1.6;
  const conic = `conic-gradient(from ${angle}deg, ${C.blue}, ${C.violet}, ${C.pink}, ${C.orange}, ${C.blue})`;
  const x0 = D * 0.16;
  const x1 = D * 0.86;
  const clip = `path('M 0 ${r} A ${r} ${r} 0 1 1 ${D} ${r} A ${r} ${r} 0 1 1 0 ${r} Z M ${x0} ${-D} H ${x1} V ${r} H ${x0} Z')`;
  return (
    <div
      style={{
        position: "relative",
        width: D,
        height: D,
        scale: `${0.6 + 0.4 * appear}`,
        opacity: Math.min(1, appear * 1.6),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -D * 0.1,
          borderRadius: "50%",
          background: conic,
          filter: `blur(${D * 0.11}px)`,
          opacity: 0.45 * ring,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: -D * 0.035,
          borderRadius: "50%",
          background: `conic-gradient(from ${angle}deg, ${C.blue}, ${C.violet}, ${C.pink}, ${C.orange}, ${C.blue} ${ring * 100}%, transparent ${ring * 100}%)`,
          WebkitMaskImage: `radial-gradient(circle, transparent ${r - 1}px, #000 ${r}px)`,
          maskImage: `radial-gradient(circle, transparent ${r - 1}px, #000 ${r}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: D * 0.012,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 26%, #FFFFFF 0%, #ECECF1 45%, #D9D9E0 100%)`,
          boxShadow: "inset 0 -18px 40px rgba(29,29,31,0.08)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, clipPath: clip }}>
        <Img
          src={staticFile("images/oumar-cutout.png")}
          style={{
            position: "absolute",
            width: D * 1.36,
            left: -D * 0.335,
            top: -D * 0.155 + (1 - photo) * D * 0.18,
            opacity: photo,
            filter: "drop-shadow(0 18px 30px rgba(29,29,31,0.18))",
          }}
        />
      </div>
    </div>
  );
};
