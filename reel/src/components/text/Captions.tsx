import React, { useMemo } from "react";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ease, PaletteName, palettes, sans, serif, textGradientOf } from "../../theme";
import { useLayout } from "../../lib/layout";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9%$€]/g, "");

const CaptionPage: React.FC<{
  page: TikTokPage;
  keywords: Set<string>;
  palette: PaletteName;
}> = ({ page, keywords, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, anchors, rail, railWidth } = useLayout();
  const colors = palettes[palette];
  const now = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill
      style={{
        top: anchors.captions,
        bottom: "auto",
        left: rail,
        width: railWidth,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 66 * u,
          lineHeight: 1.18,
          letterSpacing: "-0.02em",
          color: "white",
          textAlign: "center",
          textShadow: `0 ${4 * u}px ${22 * u}px rgba(0,0,0,0.55)`,
        }}
      >
        {page.tokens.map((token, i) => {
          const word = token.text.trim();
          const appear = token.fromMs - 40;
          const k = interpolate(now, [appear, appear + 170], [0, 1], {
            ...clamp,
            easing: Easing.bezier(...ease.out),
          });
          const active = now >= token.fromMs && now < token.toMs + 60;
          const keyword = keywords.has(normalise(word));
          const pill = interpolate(now, [token.fromMs, token.fromMs + 120], [0, 1], {
            ...clamp,
            easing: Easing.bezier(...ease.out),
          });

          return (
            <React.Fragment key={`${token.fromMs}-${i}`}>
              {i > 0 ? " " : null}
              <span
                style={{
                  display: "inline-block",
                  position: "relative",
                  opacity: k,
                  translate: `0px ${(1 - k) * 34 * u}px`,
                  scale: String(0.82 + k * 0.18),
                  filter: `blur(${(1 - k) * 8 * u}px)`,
                }}
              >
                {active && !keyword ? (
                  <span
                    style={{
                      position: "absolute",
                      inset: `${-0.02 * 66 * u}px ${-0.16 * 66 * u}px`,
                      borderRadius: 18 * u,
                      background: `linear-gradient(120deg, ${colors[1]}, ${colors[3]})`,
                      boxShadow: `0 ${8 * u}px ${30 * u}px ${colors[2]}66`,
                      opacity: pill,
                      scale: String(0.86 + pill * 0.14),
                      zIndex: 0,
                    }}
                  />
                ) : null}
                <span
                  style={
                    keyword
                      ? {
                          position: "relative",
                          fontFamily: serif,
                          fontStyle: "italic",
                          fontWeight: 400,
                          fontSize: "1.18em",
                          letterSpacing: "0em",
                          backgroundImage: textGradientOf(palette),
                          backgroundSize: "300% 100%",
                          backgroundPosition: `${interpolate(now, [token.fromMs, token.fromMs + 1500], [0, 60], clamp)}% 50%`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                          padding: "0 0.06em",
                        }
                      : { position: "relative", zIndex: 1 }
                  }
                >
                  {word}
                </span>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Word-by-word captions: words land as they are spoken, the current word sits
 * on a gradient pill, and keywords switch to a gradient serif italic.
 */
export const Captions: React.FC<{
  captions: Caption[];
  keywords?: string[];
  palette?: PaletteName;
  /** [start, end] seconds where captions step aside for a title beat. */
  hide?: [number, number][];
  pageMs?: number;
}> = ({ captions, keywords = [], palette = "aurora", hide = [], pageMs = 900 }) => {
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => new Set(keywords.map(normalise)), [keywords]);
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: pageMs }),
    [captions, pageMs],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, index) => {
        const startSec = page.startMs / 1000;
        if (hide.some(([a, b]) => startSec >= a && startSec < b)) return null;
        const next = pages[index + 1];
        const lastWord = page.tokens[page.tokens.length - 1];
        const hideStart = Math.min(
          ...hide.map(([a]) => (a > startSec ? a * 1000 : Infinity)),
        );
        const endMs = Math.min(
          next ? next.startMs : Infinity,
          (lastWord ? lastWord.toMs : page.startMs + page.durationMs) + 400,
          hideStart,
        );
        const from = Math.round(startSec * fps);
        const durationInFrames = Math.round((endMs / 1000) * fps) - from;
        if (durationInFrames <= 0) return null;
        return (
          <Sequence key={index} name={`Caption ${index + 1}`} from={from} durationInFrames={durationInFrames}>
            <CaptionPage page={page} keywords={keywordSet} palette={palette} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
