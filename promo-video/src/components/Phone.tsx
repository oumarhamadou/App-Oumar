import React from "react";
import { C } from "../theme";

/** Minimal titanium phone with Dynamic Island. Height follows a 19.5:9 screen. */
export const Phone: React.FC<{
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width: W, children, style }) => {
  const H = W * 2.04;
  const bezel = W * 0.032;
  const radius = W * 0.16;
  return (
    <div
      style={{
        position: "relative",
        width: W,
        height: H,
        borderRadius: radius,
        padding: bezel,
        background:
          "linear-gradient(145deg, #8E8E93 0%, #3A3A3C 22%, #1C1C1E 50%, #3A3A3C 78%, #9A9AA0 100%)",
        boxShadow:
          "0 50px 100px rgba(0,0,0,0.55), 0 20px 40px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.12)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: radius - bezel,
          background: C.black,
          padding: W * 0.012,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: radius - bezel - W * 0.012,
            overflow: "hidden",
            background: "#0B0B0D",
          }}
        >
          {children}
          <div
            style={{
              position: "absolute",
              top: W * 0.035,
              left: "50%",
              width: W * 0.3,
              height: W * 0.085,
              marginLeft: -W * 0.15,
              borderRadius: 999,
              background: C.black,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 28%, rgba(255,255,255,0) 45%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
