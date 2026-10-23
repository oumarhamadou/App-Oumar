import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { Word } from "../text";
import { CLAMP, COLORS, EASE_IN, EASE_IN_OUT, EASE_OUT } from "../theme";
import { useUnit, useVoiceTime } from "../time";
import { HighlightBox } from "./HighlightBox";
import { Divider } from "./Ornament";
import { Words } from "./Words";

export type LineKind =
  | "title"
  | "heading"
  | "sub"
  | "quote"
  | "small"
  | "box"
  | "divider";

export type Line = { kind: LineKind; words: Word[]; at?: number };

export type Block = {
  lines: Line[];
  // Instant où le bloc sort (flou + montée). Sans valeur, il reste jusqu'à la fin de la scène.
  exit?: number;
  // La première ligne apparaît seule au centre, puis le bloc remonte quand la suite arrive.
  settle?: boolean;
};

export type Backdrop = "maroon" | "cream" | "peach";

export type SceneSpec = {
  start: number;
  end: number;
  bg: Backdrop;
  // circle : cercle qui s'ouvre (la scène passe au-dessus de la précédente)
  // zoom : la scène arrive en zoom avant flouté (la précédente sort au-dessus)
  enter: "circle" | "zoom" | "cut";
  // Sortie de toute la scène en zoom arrière + fondu, pour laisser voir la suivante dessous.
  exit?: number;
  blocks: Block[];
};

const PALETTES = {
  maroon: {
    bg: COLORS.maroon,
    title: COLORS.blush,
    heading: COLORS.blush,
    sub: COLORS.sand,
    quote: COLORS.blush,
    small: COLORS.blush,
    accent: COLORS.sand,
    boxBg: COLORS.sand,
    boxText: COLORS.maroon,
    boxAccent: COLORS.maroonText,
    divider: COLORS.blush,
  },
  cream: {
    bg: COLORS.cream,
    title: COLORS.ink,
    heading: COLORS.ink,
    sub: COLORS.maroonText,
    quote: COLORS.ink,
    small: COLORS.maroonText,
    accent: COLORS.maroonText,
    boxBg: COLORS.maroonBox,
    boxText: COLORS.blush,
    boxAccent: COLORS.sand,
    divider: COLORS.maroonText,
  },
  peach: {
    bg: COLORS.peach,
    title: COLORS.ink,
    heading: COLORS.ink,
    sub: COLORS.maroonText,
    quote: COLORS.ink,
    small: COLORS.maroonText,
    accent: COLORS.maroonText,
    boxBg: COLORS.maroonBox,
    boxText: COLORS.blush,
    boxAccent: COLORS.sand,
    divider: COLORS.maroonText,
  },
};

type Palette = (typeof PALETTES)[Backdrop];

const SIZE: Record<Exclude<LineKind, "divider">, number> = {
  title: 168,
  heading: 120,
  sub: 96,
  quote: 80,
  small: 64,
  box: 84,
};

const WEIGHT: Record<Exclude<LineKind, "divider">, 400 | 700> = {
  title: 700,
  heading: 700,
  sub: 700,
  quote: 400,
  small: 400,
  box: 700,
};

const GAP = 12;

const lineStart = (line: Line) => line.words[0]?.at ?? line.at ?? 0;

// Hauteur approximative d'une ligne, pour centrer la première ligne avant l'arrivée des suivantes.
const lineHeight = (line: Line) =>
  line.kind === "divider"
    ? 14
    : SIZE[line.kind] * 1.55 + (line.kind === "box" ? 16 : 0);

const LineView: React.FC<{
  line: Line;
  t: number;
  u: number;
  palette: Palette;
  maxWidth: number;
}> = ({ line, t, u, palette, maxWidth }) => {
  if (line.kind === "divider") {
    return (
      <Divider
        t={t}
        at={line.at ?? 0}
        size={13 * u}
        width={86 * u}
        color={palette.divider}
      />
    );
  }
  const size = SIZE[line.kind] * u;
  if (line.kind === "box") {
    return (
      <div style={{ marginTop: 14 * u }}>
        <HighlightBox
          t={t}
          at={lineStart(line) - 0.14}
          color={palette.boxBg}
          u={u}
        >
          <Words
            words={line.words}
            t={t}
            size={size}
            color={palette.boxText}
            accentColor={palette.boxAccent}
            weight={WEIGHT.box}
            maxWidth={maxWidth - 90 * u}
            blur={10 * u}
          />
        </HighlightBox>
      </div>
    );
  }
  return (
    <div style={{ marginTop: line.kind === "quote" ? 18 * u : 0 }}>
      <Words
        words={line.words}
        t={t}
        size={size}
        color={palette[line.kind]}
        accentColor={palette.accent}
        weight={WEIGHT[line.kind]}
        maxWidth={maxWidth}
        blur={(line.kind === "title" ? 22 : 12) * u}
        pace={line.kind === "title" ? 1.6 : line.kind === "heading" ? 1.25 : 1}
      />
    </div>
  );
};

const BlockView: React.FC<{
  block: Block;
  t: number;
  u: number;
  portrait: boolean;
  palette: Palette;
  maxWidth: number;
}> = ({ block, t, u, portrait, palette, maxWidth }) => {
  const first = lineStart(block.lines[0]);
  if (t < first - 0.2 || (block.exit !== undefined && t > block.exit + 0.45)) {
    return null;
  }
  const out =
    block.exit === undefined
      ? 0
      : interpolate(t, [block.exit, block.exit + 0.32], [0, 1], {
          ...CLAMP,
          easing: EASE_IN,
        });
  const second = block.lines[1] ? lineStart(block.lines[1]) : undefined;
  const rest = block.lines
    .slice(1)
    .reduce((sum, line) => sum + lineHeight(line) + GAP, 0);
  const settle =
    block.settle && second !== undefined
      ? interpolate(t, [second - 0.3, second + 0.35], [0, 1], {
          ...CLAMP,
          easing: EASE_IN_OUT,
        })
      : 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: portrait ? 150 * u : 0,
        opacity: 1 - out,
        filter: `blur(${out * 14 * u}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: GAP * u,
          translate: `0 ${((1 - settle) * rest * u) / 2 - out * 34 * u}px`,
        }}
      >
        {block.lines.map((line, i) => (
          <LineView
            key={i}
            line={line}
            t={t}
            u={u}
            palette={palette}
            maxWidth={maxWidth}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scène générique du style « typographie arabe animée » : fond uni de la palette,
// blocs de lignes révélées mot à mot sur la voix, entrée en cercle ou en zoom.
export const StoryScene: React.FC<{
  spec: SceneSpec;
  decor?: (t: number) => React.ReactNode;
}> = ({ spec, decor }) => {
  const t = useVoiceTime(spec.start);
  const { u, width, height, portrait } = useUnit();
  const palette = PALETTES[spec.bg];
  const radius = interpolate(
    t,
    [spec.start, spec.start + 0.6],
    [0, Math.hypot(width, height) / 2 + 4],
    { ...CLAMP, easing: EASE_IN_OUT },
  );
  const zoomIn =
    spec.enter === "zoom"
      ? interpolate(t, [spec.start + 0.04, spec.start + 0.6], [0, 1], {
          ...CLAMP,
          easing: EASE_OUT,
        })
      : 1;
  const out =
    spec.exit === undefined
      ? 0
      : interpolate(t, [spec.exit, spec.exit + 0.3], [0, 1], {
          ...CLAMP,
          easing: EASE_IN,
        });
  const maxWidth = width - (portrait ? 150 : 300) * u;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        clipPath:
          spec.enter === "circle"
            ? `circle(${radius}px at 50% 50%)`
            : undefined,
        opacity: 1 - out,
      }}
    >
      {decor ? decor(t) : null}
      <AbsoluteFill
        style={{
          scale:
            1 +
            interpolate(t, [spec.start, spec.end], [0, 0.03], CLAMP) +
            (1 - zoomIn) * 0.14 -
            out * 0.14,
          filter: `blur(${((1 - zoomIn) * 10 + out * 12) * u}px)`,
        }}
      >
        {spec.blocks.map((block, i) => (
          <BlockView
            key={i}
            block={block}
            t={t}
            u={u}
            portrait={portrait}
            palette={palette}
            maxWidth={maxWidth}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
