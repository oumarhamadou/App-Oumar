import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import type { TimedLine, TimedWord } from "../script/types";
import { colors, fonts, type Background } from "../theme";
import { easeOut, LEAD_FRAMES, msToFrame } from "./timing";

type Tone = {
  title: string;
  subtitle: string;
  type: string;
  typeStrong: string;
  boxBg: string;
  boxText: string;
  pillBg: string;
  pillText: string;
  blur: string;
  credit: string;
};

const tones: Record<Background, Tone> = {
  maroon: {
    title: colors.creamText,
    subtitle: colors.roseMuted,
    type: colors.creamText,
    typeStrong: colors.creamText,
    boxBg: colors.boxOnMaroon,
    boxText: colors.maroon,
    pillBg: colors.boxOnMaroon,
    pillText: colors.maroon,
    blur: colors.creamText,
    credit: colors.roseMuted,
  },
  cream: {
    title: colors.inkMaroon,
    subtitle: colors.blushMuted,
    type: colors.inkMaroon,
    typeStrong: colors.ink,
    boxBg: colors.maroon,
    boxText: colors.creamText,
    pillBg: colors.pillOnCream,
    pillText: colors.inkMaroon,
    blur: colors.ink,
    credit: colors.blushMuted,
  },
  blush: {
    title: colors.blushInk,
    subtitle: colors.blushMuted,
    type: colors.blushInk,
    typeStrong: colors.ink,
    boxBg: colors.maroon,
    boxText: colors.blush,
    pillBg: "#E9CEC1",
    pillText: colors.blushInk,
    blur: colors.blushMuted,
    credit: colors.blushMuted,
  },
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const DASH = "— ";

type LineProps = {
  line: TimedLine;
  bg: Background;
  /** Début de la scène sur la timeline globale, en images. */
  sceneFrom: number;
};

type FontProps = {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
};

const segmenter = new Intl.Segmenter("ar", { granularity: "grapheme" });

/** Graphèmes : une lettre arabe reste avec ses voyelles et sa chadda. */
const graphemes = (text: string) =>
  Array.from(segmenter.segment(text), (s) => s.segment);

/** Mots suivis d'une espace, pour que la mise en page finale soit fixe dès le départ. */
const withSpaces = (words: TimedWord[]) =>
  words.map((w, i) => ({
    ...w,
    text: i < words.length - 1 ? `${w.text} ` : w.text,
  }));

/**
 * Instant d'apparition (en images, relatif à la scène) de chaque graphème :
 * la frappe s'étale sur la durée où le mot est prononcé.
 */
const typingSchedule = (
  words: TimedWord[],
  sceneFrom: number,
  fps: number,
  prefix: string,
  suffix: string,
) => {
  const schedule: { g: string; at: number }[] = [];
  const spaced = withSpaces(words);
  spaced.forEach((word, w) => {
    const start = msToFrame(word.startMs, fps) - sceneFrom - LEAD_FRAMES;
    const spoken = Math.max(
      msToFrame(word.endMs, fps) - msToFrame(word.startMs, fps),
      2,
    );
    const text = `${w === 0 ? prefix : ""}${word.text}${w === spaced.length - 1 ? suffix : ""}`;
    const gs = graphemes(text);
    const span = Math.min(spoken * 0.85, gs.length * 2.5);
    gs.forEach((g, k) =>
      schedule.push({ g, at: start + (k * span) / gs.length }),
    );
  });
  return schedule;
};

const typedText = (schedule: { g: string; at: number }[], frame: number) =>
  schedule
    .filter((s) => s.at <= frame)
    .map((s) => s.g)
    .join("");

/**
 * Machine à écrire : le texte déjà « tapé » est rendu d'un seul tenant pour
 * garder les liaisons arabes, et calé sur le début (à droite) de la ligne
 * finale, qui fixe la mise en page dès le départ.
 */
const TypeLine: React.FC<LineProps & FontProps> = ({
  line,
  sceneFrom,
  color,
  fontFamily,
  fontSize,
  fontWeight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prefix = line.dash ? DASH : "";
  const schedule = typingSchedule(line.words, sceneFrom, fps, prefix, "");
  const full = schedule.map((s) => s.g).join("");
  return (
    <div
      style={{
        position: "relative",
        direction: "rtl",
        whiteSpace: "nowrap",
        fontFamily,
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.6,
      }}
    >
      <span style={{ visibility: "hidden" }}>{full}</span>
      <span style={{ position: "absolute", top: 0, right: 0 }}>
        {typedText(schedule, frame)}
      </span>
    </div>
  );
};

/** Titre : chaque mot sort du flou en se resserrant, calé sur la voix. */
const ScatterLine: React.FC<LineProps & { color: string }> = ({
  line,
  sceneFrom,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        direction: "rtl",
        fontFamily: fonts.naskh,
        fontWeight: 700,
        fontSize: 96,
        color,
        lineHeight: 1.5,
      }}
    >
      {withSpaces(line.words).map((word, w) => {
        const at =
          msToFrame(word.startMs, fps) -
          sceneFrom -
          LEAD_FRAMES -
          4 +
          (random(`title-${line.text}-${w}`) - 0.5) * 6;
        return (
          <span
            key={w}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: interpolate(frame, [at, at + 9], [0, 1], clamp),
              filter: `blur(${interpolate(frame, [at, at + 14], [18, 0], { ...clamp, easing: easeOut })}px)`,
              scale: interpolate(frame, [at, at + 16], [1.3, 1], {
                ...clamp,
                easing: easeOut,
              }),
              translate: `0 ${interpolate(frame, [at, at + 16], [0.12, 0], { ...clamp, easing: easeOut })}em`,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Encadré « surligneur » : comme dans la référence, il naît en fine barre
 * puis s'étire vers la gauche avec chaque lettre tapée.
 */
const BoxLine: React.FC<LineProps & { tone: Tone }> = ({
  line,
  sceneFrom,
  tone,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const schedule = typingSchedule(line.words, sceneFrom, fps, '"', '"');
  const full = schedule.map((s) => s.g).join("");
  const appear = schedule[0].at;
  const box: React.CSSProperties = {
    display: "inline-block",
    fontFamily: fonts.naskh,
    fontWeight: 700,
    fontSize: 60,
    lineHeight: 1.55,
    padding: "0 0.4em",
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "relative", direction: "rtl" }}>
      <span style={{ ...box, visibility: "hidden" }}>{full}</span>
      <span
        style={{
          ...box,
          position: "absolute",
          top: 0,
          right: 0,
          background: tone.boxBg,
          color: tone.boxText,
          opacity: interpolate(frame, [appear - 10, appear - 4], [0, 1], clamp),
          scale: `1 ${interpolate(frame, [appear - 12, appear - 2], [0.15, 1], { ...clamp, easing: easeOut })}`,
        }}
      >
        {typedText(schedule, frame)}
      </span>
    </div>
  );
};

/** Mots qui tombent en place en sortant du flou. */
const BlurWords: React.FC<LineProps & FontProps> = ({
  line,
  sceneFrom,
  color,
  fontSize,
  fontFamily,
  fontWeight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = withSpaces(line.words).map((w, i) => ({
    ...w,
    text: i === 0 && line.dash ? `${DASH}${w.text}` : w.text,
  }));
  // Bloc en ligne de direction RTL : c'est lui qui ordonne les mots de droite à gauche.
  return (
    <div
      style={{
        display: "inline-block",
        direction: "rtl",
        fontFamily,
        fontWeight,
        fontSize,
        color,
        lineHeight: 1.6,
      }}
    >
      {words.map((word, w) => {
        const at = msToFrame(word.startMs, fps) - sceneFrom - LEAD_FRAMES;
        return (
          <span
            key={w}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: interpolate(frame, [at, at + 7], [0, 1], clamp),
              filter: `blur(${interpolate(frame, [at, at + 10], [12, 0], { ...clamp, easing: easeOut })}px)`,
              translate: `0 ${interpolate(frame, [at, at + 10], [-0.3, 0], { ...clamp, easing: easeOut })}em`,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

/** Pastille arrondie : elle sort du flou juste avant la voix, puis les mots s'y posent. */
const PillLine: React.FC<LineProps & { tone: Tone }> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { line, sceneFrom, tone } = props;
  const at = msToFrame(line.words[0].startMs, fps) - sceneFrom - LEAD_FRAMES;
  return (
    <div
      style={{
        direction: "rtl",
        display: "inline-block",
        background: tone.pillBg,
        borderRadius: 999,
        padding: "0 1em",
        opacity: interpolate(frame, [at - 14, at - 4], [0, 1], clamp),
        scale: interpolate(frame, [at - 14, at], [0.82, 1], {
          ...clamp,
          easing: easeOut,
        }),
        filter: `blur(${interpolate(frame, [at - 14, at - 2], [10, 0], clamp)}px)`,
      }}
    >
      <BlurWords
        {...props}
        color={tone.pillText}
        fontSize={58}
        fontFamily={fonts.naskh}
        fontWeight={700}
      />
    </div>
  );
};

export const AnimatedLine: React.FC<LineProps> = (props) => {
  const tone = tones[props.bg];
  switch (props.line.kind) {
    case "title":
      return <ScatterLine {...props} color={tone.title} />;
    case "subtitle":
      return (
        <TypeLine
          {...props}
          color={tone.subtitle}
          fontFamily={fonts.naskh}
          fontSize={56}
          fontWeight={400}
        />
      );
    case "type":
      return (
        <TypeLine
          {...props}
          color={tone.type}
          fontFamily={fonts.naskh}
          fontSize={64}
          fontWeight={400}
        />
      );
    case "typeStrong":
      return (
        <TypeLine
          {...props}
          color={tone.typeStrong}
          fontFamily={fonts.ruqaa}
          fontSize={66}
          fontWeight={700}
        />
      );
    case "box":
      return <BoxLine {...props} tone={tone} />;
    case "pill":
      return <PillLine {...props} tone={tone} />;
    case "blur":
      return (
        <div>
          <BlurWords
            {...props}
            color={tone.blur}
            fontSize={60}
            fontFamily={fonts.naskh}
            fontWeight={400}
          />
        </div>
      );
    case "credit":
      return (
        <div style={{ marginTop: 18 }}>
          <BlurWords
            {...props}
            color={tone.credit}
            fontSize={38}
            fontFamily={fonts.ruqaa}
            fontWeight={400}
          />
        </div>
      );
  }
};
