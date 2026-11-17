import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_IN_OUT, outro, pop } from "../anim";
import { FONT } from "../fonts";
import { scene } from "../timeline";

const ROWS = [
  ["7", "8", "9", "10", "11", "12", "13", "14"],
  ["15", "16", "17", "18", "19", "20", "21", "?"],
  ["23", "24", "25", "26", "27", "28", "29", "30"],
];
const colX = (c: number) => 540 + (c - 3.5) * 122;
const rowY = (r: number) => 540 + (r - 1) * 150;
const START_SCALE = 1.6;

/** "Honnêtement, je ne sais pas combien de temps ça va prendre." — days keep adding up. */
export const CalendarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = scene("calendar");
  const exit = outro(frame, durationInFrames, 8);

  const grow = interpolate(frame, [words[1].at, words[9].end], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const head = grow * 6;
  const cam = interpolate(frame, [words[0].at + 4, words[10].at + 4], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const s = START_SCALE - 0.58 * cam;
  const focusX = colX(0) + (545 - colX(0)) * cam;
  const gridIn = interpolate(frame, [2, 18], [0, 1], CLAMP);
  const question = pop(frame, words[10].at - 3, { damping: 10, stiffness: 180 });

  return (
    <AbsoluteFill style={{ backgroundColor: "#F7F7F9", fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          scale: String(s),
          translate: `${-s * (focusX - 540) - exit * 300}px 0px`,
          filter: `blur(${interpolate(exit, [0, 1], [0, 20], { ...CLAMP, easing: EASE_IN })}px)`,
          opacity: 1 - exit,
        }}
      >
        {/* Range highlight from 15 to the current day */}
        <div
          style={{
            position: "absolute",
            left: colX(0) - 50,
            top: rowY(1) - 50,
            width: 100 + head * 122,
            height: 100,
            borderRadius: 50,
            background: "linear-gradient(90deg, #DCD8FF, #E9E6FF)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: colX(0) - 50,
            top: rowY(1) - 50,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#1C1CD9",
            boxShadow: "0 10px 26px rgba(28,28,217,0.35)",
          }}
        />
        {ROWS.map((row, r) =>
          row.map((label, c) => {
            const isStart = r === 1 && c === 0;
            const isQuestion = label === "?";
            const inRange = r === 1 && c > 0 && c <= head + 0.35;
            const delay = Math.abs(c - 0) * 1.2 + Math.abs(r - 1) * 3;
            const appear = isStart ? 1 : interpolate(gridIn * 22 - delay, [0, 6], [0, 1], CLAMP);
            if (isQuestion) {
              return (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    left: colX(c) - 55,
                    top: rowY(r) - 55,
                    width: 110,
                    height: 110,
                    borderRadius: 55,
                    backgroundColor: "#1C1CD9",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 62,
                    fontWeight: 800,
                    scale: String(Math.max(0, question)),
                    boxShadow: "0 14px 34px rgba(28,28,217,0.4)",
                  }}
                >
                  ?
                </div>
              );
            }
            return (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: colX(c) - 60,
                  top: rowY(r) - 40,
                  width: 120,
                  height: 80,
                  textAlign: "center",
                  lineHeight: "80px",
                  fontSize: 52,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: isStart
                    ? "#FFFFFF"
                    : interpolateColors(inRange ? 1 : 0, [0, 1], ["#1D1F24", "#6B5CE7"]),
                  opacity: appear,
                  translate: `0px ${(1 - appear) * 20}px`,
                  filter: `blur(${(1 - appear) * 6}px)`,
                }}
              >
                {label}
              </div>
            );
          }),
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
