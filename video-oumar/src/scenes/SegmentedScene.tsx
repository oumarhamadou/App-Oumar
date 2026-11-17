import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_IN_OUT, outro, pop, settle } from "../anim";
import { FONT } from "../fonts";
import { useCopy, useScene } from "../locales";
import { NavyBackground } from "./PromptScene";

const CONTROL = { left: 80, width: 920, height: 116, padding: 10 };
const SEGMENT = (CONTROL.width - CONTROL.padding * 2) / 3;
const segmentCenter = (i: number) => CONTROL.left + CONTROL.padding + SEGMENT * (i + 0.5);

/** "pas d'audience, pas d'agence derrière moi" — a segmented control switching tabs. */
export const SegmentedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("segmented");
  const { labels } = useCopy().segmented;
  const exit = outro(frame, durationInFrames, 8);

  const enter = pop(frame, 0, { damping: 16, stiffness: 160 });
  const thumbAt = (f: number) =>
    settle(f, words[2].at - 3, 20) + settle(f, words[4].at - 3, 20);
  const pos = thumbAt(frame);
  const velocity = Math.abs(pos - thumbAt(frame - 1)) * SEGMENT;
  const active = Math.round(pos);

  // Camera pushes in on "Derrière moi".
  const zoom = interpolate(frame, [words[4].at - 4, words[5].end + 6], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const s = 1 + zoom * 0.62 + exit * 0.4;
  const focusX = 540 + zoom * (segmentCenter(2) - 540);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <NavyBackground glowX={40 + zoom * 30} />
      <AbsoluteFill
        style={{
          scale: String(s * (0.8 + 0.2 * enter)),
          translate: `${-s * (focusX - 540)}px 0px`,
          filter: `blur(${(1 - Math.min(1, enter)) * 12 + interpolate(exit, [0, 1], [0, 20], { ...CLAMP, easing: EASE_IN })}px)`,
          opacity: Math.min(1, enter * 1.4) * (1 - exit),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: CONTROL.left,
            top: 540 - CONTROL.height / 2,
            width: CONTROL.width,
            height: CONTROL.height,
            borderRadius: 999,
            background: "rgba(50,60,82,0.72)",
            border: "1.5px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: CONTROL.padding,
              left: CONTROL.padding + pos * SEGMENT,
              width: SEGMENT,
              height: CONTROL.height - CONTROL.padding * 2 - 3,
              borderRadius: 999,
              background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
              boxShadow: "0 6px 18px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              filter: `blur(${Math.min(10, velocity * 0.12)}px)`,
            }}
          />
          <div style={{ position: "absolute", inset: 0, display: "flex", padding: CONTROL.padding }}>
            {labels.map((label, i) => (
              <div
                key={label}
                style={{
                  width: SEGMENT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  color: i === active ? "#FFFFFF" : "#8F98AB",
                  filter: `blur(${Math.min(6, velocity * 0.05)}px)`,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
