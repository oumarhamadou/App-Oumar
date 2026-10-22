import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ease, PaletteName, palettes, sans, serif, textGradientOf } from "../../theme";
import { useLayout } from "../../lib/layout";
import { parseWords } from "./parse";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Premium headline: each word rises out of its own mask with a blur-to-sharp
 * resolve, emphasis words switch to a serif italic with a flowing gradient
 * fill and a drawn underline, then everything lifts away on exit.
 */
export const KineticHeadline: React.FC<{
  text: string;
  kicker?: string;
  palette?: PaletteName;
  size?: number;
  position?: "upper" | "center";
  align?: "center" | "left";
  underline?: boolean;
}> = ({
  text,
  kicker,
  palette = "aurora",
  size = 96,
  position = "upper",
  align = "center",
  underline = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { u, safe, anchors, safeWidth } = useLayout();
  const words = parseWords(text);
  const colors = palettes[palette];
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const wordStagger = Math.round(0.07 * fps);
  const enter = Math.round(0.55 * fps);
  const textStart = kicker ? Math.round(0.12 * fps) : 0;
  const exitDur = Math.round(0.32 * fps);
  const exitStart = durationInFrames - exitDur - Math.round(0.03 * fps) * words.length;

  // Whole block: slow push and tracking that tightens, like an AE text preset.
  const push = interpolate(frame, [0, durationInFrames], [0.965, 1.015], clamp);
  const tracking = interpolate(frame, [0, enter * 2], [0.02, -0.035], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });

  const kickerIn = interpolate(frame, [0, Math.round(0.4 * fps)], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });
  const kickerOut = interpolate(frame, [exitStart, exitStart + exitDur], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.in),
  });

  const lines: React.ReactNode[][] = [[]];
  words.forEach((word, i) => {
    if (word.lineBreak) lines.push([]);
    const start = textStart + i * wordStagger;
    const k = interpolate(frame, [start, start + enter], [0, 1], {
      ...clamp,
      easing: Easing.bezier(...ease.out),
    });
    const outStart = exitStart + i * Math.round(0.03 * fps);
    const out = interpolate(frame, [outStart, outStart + exitDur], [0, 1], {
      ...clamp,
      easing: Easing.bezier(...ease.in),
    });
    const sweep = interpolate(frame, [start, durationInFrames], [0, 100], clamp);
    const line = interpolate(frame, [start + enter * 0.6, start + enter * 1.6], [0, 1], {
      ...clamp,
      easing: Easing.bezier(...ease.inOut),
    });

    lines[lines.length - 1].push(
      <span
        key={i}
        style={{
          display: "inline-block",
          overflow: "hidden",
          padding: "0.06em 0.12em 0.14em",
          margin: "-0.06em -0.12em -0.14em",
          verticalAlign: "top",
        }}
      >
        <span
          style={{
            display: "inline-block",
            position: "relative",
            translate: `0px ${(1 - k) * 105 - out * 70}%`,
            rotate: `${(1 - k) * 6}deg`,
            opacity: Math.min(k * 1.6, 1) * (1 - out),
            filter: `blur(${(1 - k) * 14 * u + out * 10 * u}px)`,
            ...(word.emphasis
              ? {
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "1.14em",
                  letterSpacing: "-0.01em",
                  backgroundImage: textGradientOf(palette),
                  backgroundSize: "300% 100%",
                  backgroundPosition: `${sweep}% 50%`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }
              : {}),
          }}
        >
          {word.text}
          {word.emphasis && underline ? (
            <svg
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                left: "4%",
                bottom: "-0.05em",
                width: "92%",
                height: "0.18em",
                overflow: "visible",
              }}
            >
              <defs>
                <linearGradient id={`ul-${id}-${i}`} x1="0" x2="1">
                  <stop offset="0" stopColor={colors[1]} />
                  <stop offset="0.5" stopColor={colors[3]} />
                  <stop offset="1" stopColor={colors[4]} />
                </linearGradient>
              </defs>
              <path
                d="M2 8 C 30 2, 70 2, 98 6"
                fill="none"
                stroke={`url(#ul-${id}-${i})`}
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - line}
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 5 * u }}
              />
            </svg>
          ) : null}
        </span>
      </span>,
    );
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: position === "center" ? "center" : "flex-start",
        alignItems: align === "center" ? "center" : "flex-start",
        paddingTop: position === "upper" ? anchors.upper : 0,
        paddingLeft: safe.left,
        paddingRight: safe.right,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: align === "center" ? "center" : "flex-start",
          gap: 26 * u,
          maxWidth: safeWidth,
          scale: String(push),
        }}
      >
        {kicker ? (
          <div
            style={{
              opacity: kickerIn * (1 - kickerOut),
              translate: `0px ${(1 - kickerIn) * 24 * u - kickerOut * 20 * u}px`,
              filter: `blur(${(1 - kickerIn) * 8 * u}px)`,
              padding: 2 * u,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${colors[1]}, ${colors[3]}, ${colors[4]})`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14 * u,
                padding: `${12 * u}px ${26 * u}px`,
                borderRadius: 999,
                background: "rgba(10,10,18,0.78)",
                fontFamily: sans,
                fontWeight: 600,
                fontSize: 26 * u,
                letterSpacing: "0.22em",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: 12 * u,
                  height: 12 * u,
                  borderRadius: 99,
                  background: colors[3],
                  boxShadow: `0 0 ${14 * u}px ${colors[3]}`,
                }}
              />
              {kicker}
            </div>
          </div>
        ) : null}
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: size * u,
            lineHeight: 1.04,
            letterSpacing: `${tracking}em`,
            color: "white",
            textAlign: align,
            textWrap: "balance",
            textShadow: `0 ${6 * u}px ${36 * u}px rgba(0,0,0,0.35)`,
            filter: `drop-shadow(0 0 ${28 * u}px ${colors[2]}33)`,
          }}
        >
          {lines.map((line, i) => (
            <div key={i}>
              {line.map((node, j) => (
                <React.Fragment key={j}>
                  {j > 0 ? " " : null}
                  {node}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
