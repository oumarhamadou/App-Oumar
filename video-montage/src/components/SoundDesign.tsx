import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { CUT, W } from "../lib/constants";

type Hit = readonly [frame: number, sfx: string, volume: number];

// No music: only sound design, synced to the text animations and the transition.
const HITS: readonly Hit[] = [
  // "You're BEHIND" – opening hit
  [W.behind1 - 1, "boom", 0.45],
  [W.behind1 - 2, "whoosh", 0.3],
  // because you're in a – rush.
  [W.because1, "tick1", 0.2],
  [W.youre2, "tick2", 0.18],
  [W.in1, "tick3", 0.16],
  [W.rush1 - 3, "whoosh_fast", 0.5],
  // and you're in a – RUSH (difference)
  [W.and1, "tick4", 0.18],
  [W.youre3, "tick1", 0.18],
  [W.in2, "tick2", 0.16],
  [W.rush2, "glitch", 0.42],
  [W.rush2, "pop", 0.3],
  [W.rush2 - 1, "drop", 0.35],
  // because you feel – behind,
  [W.because2 - 2, "whoosh", 0.16],
  [W.you1, "tick3", 0.18],
  [W.feel1, "tick4", 0.16],
  [W.behind2, "shimmer", 0.3],
  [W.behind2, "pop", 0.18],
  // and you feel BEHIND (echo)
  [W.and2, "tick1", 0.16],
  [W.behind3 - 22, "swell", 0.4],
  [W.you2, "tick2", 0.16],
  [W.behind3, "pop", 0.4],
  [W.behind3, "boom", 0.3],
  // because you're in a different SEASON
  [W.because3, "tick3", 0.18],
  [W.youre4 - 10, "whoosh", 0.16],
  [W.youre4, "tick4", 0.16],
  [W.in3, "tick1", 0.14],
  [W.different, "shimmer", 0.28],
  [W.different - 2, "whoosh_fast", 0.22],
  [W.season - 1, "boom", 0.5],
  // than the people you're COMPARING yourself to.
  [W.than, "tick2", 0.16],
  [W.people, "tick3", 0.16],
  [W.youre5, "tick4", 0.15],
  [W.comparing, "swipe", 0.5],
  [W.comparing, "tick1", 0.18],
  [W.yourself, "shimmer", 0.26],
  [W.to, "tick2", 0.15],
  // transition into the close-up
  [CUT - 39, "riser", 0.42],
  [CUT - 10, "whoosh_fast", 0.45],
  [CUT - 1, "impact", 0.5],
  // You're NOT behind.
  [W.youre6, "tick3", 0.16],
  [W.not, "pop", 0.2],
  [W.behind4, "shimmer", 0.3],
  [W.behind4, "boom", 0.42],
  [W.behind4 + 8, "swipe", 0.55],
  // You're just EARLY.
  [W.youre7 - 6, "whoosh", 0.14],
  [W.youre7, "tick4", 0.16],
  [W.just, "tick1", 0.15],
  [W.early - 2, "whoosh_fast", 0.28],
  [W.early, "shimmer", 0.5],
  [W.early, "boom", 0.32],
];

// Master gain of the SFX bus (keeps the mix below 0 dBFS on top of the voice).
const SFX_BUS = 0.85;

export const SoundDesign: React.FC = () => (
  <>
    {HITS.map(([frame, sfx, volume], i) => (
      <Sequence key={i} name={`SFX ${sfx}`} from={Math.max(0, frame)} layout="none">
        <Audio src={staticFile(`sfx/${sfx}.wav`)} volume={volume * SFX_BUS} />
      </Sequence>
    ))}
  </>
);
