import React from "react";
import { Img, staticFile } from "remotion";

// Profile photo with an Apple-palette story ring (blue → green).
export const Avatar: React.FC<{ size: number; ring?: boolean; border?: number }> = ({
  size,
  ring = true,
  border = 6,
}) => {
  const pad = ring ? Math.round(size * 0.035) : 0;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        padding: pad,
        background: ring
          ? "conic-gradient(from 200deg, #0A84FF, #34C759, #0A84FF)"
          : "#FFFFFF",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          padding: border,
          background: "#FFFFFF",
        }}
      >
        <Img
          src={staticFile("avatar.jpg")}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};
