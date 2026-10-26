import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

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
  // Intro (starts at 81)
  [108, "pop", 0.5],
  [119, "shimmer", 0.45],
  [147, "pop-high", 0.45],
  [165, "glass", 0.55],
  [177, "select", 0.4],
  [193, "whoosh-soft", 0.4],
  [237, "whoosh-soft", 0.35],
  [271, "click", 1],
  [273, "whoosh-long", 0.65],
  [309, "sub-drop", 0.5],
  // Reels (starts at 305)
  [313, "whoosh-soft", 0.4],
  [323, "whoosh-fast", 0.5],
  [332, "whoosh-fast", 0.45],
  [357, "pop", 0.45],
  [522, "whoosh-soft", 0.5],
  // CTA (starts at 525)
  [549, "impact", 0.5],
  [551, "shimmer", 0.45],
  [581, "pop-high", 0.45],
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
