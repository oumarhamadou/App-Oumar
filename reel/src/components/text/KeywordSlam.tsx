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

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Gadzhi-style statement beat: the footage drops to a dimmed monochrome, one
 * huge word slams in out of a blur, a gradient aura breathes behind it and
 * the tracking slowly opens up while it holds.
 */
export const KeywordSlam: React.FC<{
  word: string;
  sub?: string;
  palette?: PaletteName;
  italic?: boolean;
  size?: number;
}> = ({ word, sub, palette = "aurora", italic = true, size = 190 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { u, safeWidth } = useLayout();
  const colors = palettes[palette];

  const inDur = Math.round(0.28 * fps);
  const outDur = Math.round(0.25 * fps);
  const k = interpolate(frame, [0, inDur], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });
  const out = interpolate(frame, [durationInFrames - outDur, durationInFrames], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.in),
  });
  const dim = interpolate(
    frame,
    [0, Math.round(0.12 * fps), durationInFrames - outDur, durationInFrames],
    [0, 1, 1, 0],
    clamp,
  );
  const breathe = interpolate(frame, [0, durationInFrames], [0.9, 1.15], clamp);
  const subIn = interpolate(frame, [inDur, inDur + Math.round(0.4 * fps)], [0, 1], {
    ...clamp,
    easing: Easing.bezier(...ease.out),
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          opacity: dim,
          backdropFilter: `grayscale(1) brightness(0.5) contrast(1.15) blur(${3 * u}px)`,
          WebkitBackdropFilter: `grayscale(1) brightness(0.5) contrast(1.15) blur(${3 * u}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: dim * 0.55,
          scale: String(breathe),
          background: `radial-gradient(ellipse 55% 30% at 50% 47%, ${colors[2]}cc 0%, ${colors[1]}55 45%, transparent 75%)`,
          filter: `blur(${40 * u}px)`,
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            maxWidth: safeWidth,
            textAlign: "center",
            fontFamily: italic ? serif : sans,
            fontStyle: italic ? "italic" : "normal",
            fontWeight: italic ? 400 : 800,
            fontSize: size * u,
            lineHeight: 0.95,
            letterSpacing: `${interpolate(frame, [0, durationInFrames], [-0.04, 0.015], clamp)}em`,
            scale: String((1.38 - k * 0.38) * (1 - out * 0.06)),
            opacity: k * (1 - out),
            filter: `blur(${(1 - k) * 22 * u + out * 16 * u}px) drop-shadow(0 0 ${36 * u}px ${colors[2]}66)`,
            backgroundImage: textGradientOf(palette),
            backgroundSize: "300% 100%",
            backgroundPosition: `${interpolate(frame, [0, durationInFrames], [10, 70], clamp)}% 50%`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            padding: "0 0.1em",
          }}
        >
          {word}
        </div>
        {sub ? (
          <div
            style={{
              marginTop: 34 * u,
              fontFamily: sans,
              fontWeight: 600,
              fontSize: 34 * u,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.86)",
              opacity: subIn * (1 - out),
              translate: `0px ${(1 - subIn) * 18 * u}px`,
            }}
          >
            {sub}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
