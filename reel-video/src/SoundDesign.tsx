import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { COPY, Lang } from "./i18n";
import { FLASH, SCENES, cardsTiming, hookTiming, outroTiming, playTiming } from "./timings";

// Sound effects only — no music (added later by the editor).
// Levels are intentionally low so a music bed sits comfortably on top.
// Raise or lower everything at once with SFX_GAIN.
export const SFX_GAIN = 1.4;

type Sfx =
  | "pop"
  | "tick"
  | "swish"
  | "whoosh-soft"
  | "whip"
  | "glitch"
  | "riser"
  | "impact"
  | "sparkle"
  | "mouse-click"
  | "switch"
  | "ding"
  | "shutter-modern";

const LENGTH: Record<Sfx, number> = {
  pop: 6,
  tick: 3,
  swish: 11,
  "whoosh-soft": 20,
  whip: 7,
  glitch: 7,
  riser: 50,
  impact: 38,
  sparkle: 32,
  "mouse-click": 14,
  switch: 12,
  ding: 44,
  "shutter-modern": 17,
};

type Cue = { at: number; sfx: Sfx; volume: number };

export const buildCues = (lang: Lang): Cue[] => {
  const copy = COPY[lang];
  const cues: Cue[] = [];
  const add = (at: number, sfx: Sfx, volume: number) => cues.push({ at: Math.max(0, Math.round(at)), sfx, volume });

  // 1. Hook
  const hookWords = copy.hook.flat().length;
  const h = hookTiming(hookWords);
  for (let k = 0; k < hookWords; k++) add(h.appear(k) + 3, "pop", 0.22);
  add(h.diffIn, "glitch", 0.15);
  add(h.diffIn, "swish", 0.12);
  for (let k = 0; k < hookWords - 1; k++) add(h.iconsAt(k) + 2, "tick", 0.14);
  add(h.diffOut, "swish", 0.1);
  add(h.lastExit - 2, "whoosh-soft", 0.22);

  // 2. "And yes, I love to play" + services wheel
  const p0 = SCENES.play.from;
  const playWords = copy.play.flat().length;
  const p = playTiming(playWords);
  for (let k = 0; k < playWords; k++) add(p0 + p.appear(k) + 3, "pop", 0.2);
  add(p0 + p.diffIn, "glitch", 0.15);
  add(p0 + p.diffIn, "swish", 0.12);
  add(p0 + p.headerMove[0], "swish", 0.15);
  add(p0 + p.wheelIn[0], "whoosh-soft", 0.17);
  for (let i = 0; i < p.steps; i++) add(p0 + p.stepAt(i), "tick", 0.17);
  add(p0 + p.exit, "whoosh-soft", 0.2);

  // Difference flash transition
  add(FLASH.from, "whip", 0.2);
  add(FLASH.from + 2, "glitch", 0.1);

  // 3. Cards carousel
  const c0 = SCENES.cards.from;
  add(c0 + 2, "whoosh-soft", 0.2);
  add(c0 + 22, "shutter-modern", 0.12);
  add(c0 + cardsTiming.kick, "whoosh-soft", 0.15);
  add(c0 + cardsTiming.exit, "whoosh-soft", 0.2);

  // 4. Dots -> profile reveal -> follow -> Telegram CTA
  const o0 = SCENES.outro.from;
  const T = outroTiming;
  T.dots.forEach((f) => add(o0 + f, "pop", 0.2));
  T.turns.forEach((f) => add(o0 + f, "tick", 0.16));
  add(o0 + T.reveal - 48, "riser", 0.16);
  add(o0 + T.reveal, "impact", 0.3);
  add(o0 + T.reveal + 2, "sparkle", 0.1);
  add(o0 + T.nameDiffIn, "glitch", 0.14);
  add(o0 + T.nameDiffOut, "swish", 0.11);
  add(o0 + T.handle, "pop", 0.13);
  add(o0 + T.subtitle, "pop", 0.13);
  add(o0 + T.button, "pop", 0.17);
  add(o0 + T.click - 1, "mouse-click", 0.17);
  add(o0 + T.click + 2, "switch", 0.16);
  add(o0 + T.ctaLine, "pop", 0.15);
  add(o0 + T.link, "pop", 0.17);
  add(o0 + T.linkDiffIn, "glitch", 0.11);
  add(o0 + T.linkDiffIn + 4, "ding", 0.1);
  add(o0 + T.fadeOut[0], "whoosh-soft", 0.17);

  return cues;
};

export const SoundDesign: React.FC<{ lang: Lang }> = ({ lang }) => {
  const cues = buildCues(lang);
  return (
    <>
      {cues.map((c, i) => (
        <Sequence key={i} from={c.at} durationInFrames={LENGTH[c.sfx] + 2} layout="none" name={`SFX ${c.sfx}`}>
          <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={c.volume * SFX_GAIN} />
        </Sequence>
      ))}
    </>
  );
};
