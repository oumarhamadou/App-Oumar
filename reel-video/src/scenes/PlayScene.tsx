import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { KineticWord } from "../components/KineticWord";
import { COPY, LangProps } from "../i18n";
import { useLayout } from "../layout";
import { CLAMP, COLORS, EASE_IN, EASE_IN_OUT, EASE_OUT, fontFamily } from "../theme";
import { playTiming } from "../timings";
import { FONT_SIZE, LINE_GAP } from "./HookScene";

const HEADER_SCALE = 0.62;
const R = 430; // wheel radius
const SPACING = 17; // degrees between items

export const PlayScene: React.FC<LangProps> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, cx, cy } = useLayout();
  const copy = COPY[lang];
  const lines = wide ? copy.playWide : copy.play;
  const words = lines.flat();
  const n = words.length;
  const t = playTiming(n);
  const lineTop = (i: number) => cy + (i - (lines.length - 1) / 2) * LINE_GAP;
  const lastLine = lines.length - 1;
  // Vertical: header on top, wheel below. Horizontal: header left, wheel right (like the reference).
  const header = wide ? { x: 400, y: cy } : { x: cx, y: 560 };
  const wheel = wide ? { x: 1190, y: cy } : { x: cx, y: 1110 };

  // Header move of the last word ("jouer.")
  const move = interpolate(frame, [t.headerMove[0], t.headerMove[1]], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const exit = interpolate(frame, [t.exit, t.exit + 14], [0, 1], { ...CLAMP, easing: EASE_IN });

  // Wheel scroll position: rolls in, then one spring step per 11 frames.
  const rollIn = interpolate(frame, [t.wheelIn[0], t.wheelIn[1]], [-3.5, 0], { ...CLAMP, easing: EASE_OUT });
  let scroll = rollIn;
  for (let i = 0; i < t.steps; i++) {
    scroll += spring({ frame: frame - t.stepAt(i), fps, config: { damping: 15, stiffness: 190, mass: 0.7 } });
  }
  const wheelOpacity = interpolate(frame, [t.wheelIn[0], t.wheelIn[0] + 10], [0, 1], CLAMP) * (1 - exit);
  const pill = interpolate(frame, [t.pillIn, t.pillIn + 10], [0, 1], { ...CLAMP, easing: EASE_OUT });

  let k = -1;
  return (
    <AbsoluteFill style={{ fontFamily, letterSpacing: "-0.04em" }}>
      {/* Sentence */}
      <AbsoluteFill style={{ fontSize: FONT_SIZE, fontWeight: 600 }}>
        {lines.map((line, li) => (
          <div
            key={li}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: lineTop(li) - LINE_GAP / 2,
              height: LINE_GAP,
              lineHeight: `${LINE_GAP}px`,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {line.map((w) => {
              k += 1;
              const idx = k;
              if (idx === n - 1 && li === lastLine) {
                return (
                  <span
                    key={idx}
                    style={{
                      display: "inline-block",
                      position: "relative",
                      translate: `${move * (header.x - cx)}px ${move * (header.y - lineTop(li))}px`,
                      scale: 1 - move * (1 - HEADER_SCALE),
                      opacity: 1 - exit,
                      filter: `blur(${exit * 10}px)`,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: -34,
                        top: "50%",
                        width: 26,
                        height: 26,
                        marginTop: -6,
                        borderRadius: 13,
                        backgroundColor: COLORS.green,
                        boxShadow: `0 0 30px ${COLORS.green}`,
                        scale: interpolate(frame, [t.headerMove[1] - 4, t.headerMove[1] + 6], [0, 1], { ...CLAMP, easing: EASE_OUT }),
                      }}
                    />
                    <KineticWord
                      text={w}
                      appearAt={t.appear(idx)}
                      selectFrom={t.appear(idx) + 2}
                      selectTo={t.diffIn}
                      diffIn={t.diffIn}
                      diffOut={t.diffOut}
                    />
                  </span>
                );
              }
              return (
                <KineticWord
                  key={idx}
                  text={w}
                  appearAt={t.appear(idx)}
                  selectFrom={t.appear(idx) + 2}
                  selectTo={t.appear(idx + 1) + 2}
                  exitAt={t.othersExit + idx * 2}
                  exitScale={0.8}
                />
              );
            })}
          </div>
        ))}
      </AbsoluteFill>

      {/* 3D picker wheel of services with a Difference selection pill */}
      <div
        style={{
          position: "absolute",
          left: wheel.x - 540,
          top: wheel.y,
          width: 1080,
          height: 0,
          rotate: "-5deg",
          isolation: "isolate",
          opacity: wheelOpacity,
          translate: `0px ${-exit * 140}px`,
          filter: `blur(${exit * 12}px)`,
        }}
      >
        {copy.services.map((s, i) => {
          const theta = (i - scroll) * SPACING;
          if (Math.abs(theta) > 88) return null;
          const rad = (theta * Math.PI) / 180;
          const near = Math.max(0, 1 - Math.abs(theta) / SPACING);
          const edge = interpolate(Math.abs(theta), [62, 86], [1, 0], CLAMP);
          const o = (0.12 + 0.5 * Math.cos(rad) ** 2 + 0.38 * near) * edge;
          return (
            <div
              key={s}
              style={{
                position: "absolute",
                left: 40,
                width: 1000,
                height: 112,
                marginTop: -56,
                lineHeight: "112px",
                textAlign: "center",
                fontSize: 72,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                whiteSpace: "nowrap",
                color: COLORS.white,
                opacity: o,
                transform: `perspective(1500px) translateZ(${-R}px) rotateX(${-theta}deg) translateZ(${R}px)`,
              }}
            >
              {s}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 90,
            width: 900,
            height: 118,
            marginTop: -59,
            borderRadius: 59,
            backgroundColor: COLORS.white,
            mixBlendMode: "difference",
            scale: `${pill} 1`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
