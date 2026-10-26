import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import {
  CTA_START,
  INTO_CTA,
  INTRO_START,
  REELS_DURATION,
  REELS_START,
} from "./timeline";

const I = INTRO_START;
const R = REELS_START;
const X = CTA_START;

// [frame, file, volume] on the main timeline. Background music is left to the editor.
const CUES: [number, string, number][] = [
  // Hook
  [4, "whoosh-soft", 0.45],
  [19, "whoosh-fast", 0.55],
  [22, "sub-drop", 0.55],
  [52, "pop-high", 0.5],
  [62, "riser", 0.55],
  [78, "whoosh-long", 0.6],
  [101, "impact", 0.6],
  // Intro: portrait, name, button, badges, lean-in, click, button grows
  [I + 27, "pop", 0.5],
  [I + 38, "shimmer", 0.45],
  [I + 66, "pop-high", 0.45],
  [I + 84, "glass", 0.55],
  [I + 96, "select", 0.4],
  [I + 112, "whoosh-soft", 0.4],
  [I + 156, "whoosh-soft", 0.35],
  [I + 190, "click", 1],
  [I + 192, "whoosh-long", 0.65],
  [I + 228, "sub-drop", 0.5],
  // Portfolio: title, then the two windows
  [R + 8, "whoosh-soft", 0.4],
  [R + 20, "whoosh-fast", 0.5],
  [R + 32, "whoosh-fast", 0.45],
  [R + 52, "glass", 0.35],
  [R + REELS_DURATION - INTO_CTA - 3, "whoosh-soft", 0.5],
  // Call to action
  [X + 24, "impact", 0.5],
  [X + 26, "shimmer", 0.45],
  [X + 56, "pop-high", 0.45],
];

export const Sound: React.FC = () => (
  <>
    {CUES.map(([from, file, volume], i) => (
      <Sequence key={i} from={from} name={`SFX ${file}`} layout="none">
        <Audio src={staticFile(`sfx/${file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </>
);
