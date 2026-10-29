import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { clamp, sans } from "../theme";

export const BUBBLES: { text: string; side: "left" | "right"; at: number }[] = [
  { text: "Они яснее", side: "right", at: 8 },
  { text: "Точнее", side: "left", at: 22 },
  { text: "Осознаннее", side: "right", at: 36 },
  { text: "Убирают трение", side: "left", at: 50 },
  { text: "Ускоряют понимание", side: "right", at: 64 },
  { text: "Решения — без усилий", side: "left", at: 78 },
];

const Bubble: React.FC<{
  text: string;
  side: "left" | "right";
  at: number;
}> = ({ text, side, at }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [at, at + 14], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 12, stiffness: 160 }),
  });
  const right = side === "right";
  return (
    <div
      style={{
        alignSelf: right ? "flex-end" : "flex-start",
        padding: "22px 40px 26px",
        borderRadius: 46,
        borderBottomRightRadius: right ? 12 : 46,
        borderBottomLeftRadius: right ? 46 : 12,
        background: right ? "#0A84FF" : "#28B84D",
        color: "#FFFFFF",
        fontSize: 56,
        fontWeight: 600,
        letterSpacing: "-0.03em",
        whiteSpace: "nowrap",
        boxShadow: right
          ? "0 14px 34px rgba(10,132,255,0.28)"
          : "0 14px 34px rgba(40,184,77,0.28)",
        transformOrigin: right ? "100% 100%" : "0% 100%",
        opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
        scale: `${0.4 + 0.6 * pop}`,
        translate: `0px ${(1 - pop) * 40}px`,
      }}
    >
      {text}
    </div>
  );
};

// iMessage-style list: what market leaders do instead of shouting
export const S07Clearer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: sans,
        opacity: interpolate(frame, [108, 120], [1, 0], clamp),
        filter: `blur(${interpolate(frame, [108, 120], [0, 22], clamp)}px)`,
        translate: `0px ${interpolate(frame, [108, 120], [0, -60], clamp)}px`,
      }}
    >
      <div
        style={{
          width: 800,
          display: "flex",
          flexDirection: "column",
          gap: 34,
          translate: `0px ${interpolate(frame, [0, 100], [60, -30], clamp)}px`,
        }}
      >
        <div
          style={{
            alignSelf: "center",
            fontSize: 32,
            fontWeight: 600,
            color: "#86868B",
            marginBottom: 6,
            opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          }}
        >
          Сегодня 9:41
        </div>
        {BUBBLES.map((b) => (
          <Bubble key={b.text} text={b.text} side={b.side} at={b.at} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
