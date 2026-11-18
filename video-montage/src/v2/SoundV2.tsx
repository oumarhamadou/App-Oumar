import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { CUT } from "../lib/constants";
import { CUTS } from "./SceneV2";

// No music. Sound effects ONLY on transitions, kept very low under the voice.
const CUT_WHOOSH = 0.07;

const HITS: readonly (readonly [frame: number, sfx: string, volume: number])[] = [
  // soft air on every jump cut (the whoosh peaks ~5 frames after it starts)
  ...CUTS.filter((c) => c !== CUT).map((c) => [c - 5, "whoosh_fast", CUT_WHOOSH] as const),
  // light-sweep transition into the close-up
  [CUT - 30, "riser", 0.06],
  [CUT - 12, "whoosh", 0.14],
  [CUT - 3, "shimmer", 0.07],
  [CUT - 1, "drop", 0.12],
];

export const SoundV2: React.FC = () => (
  <>
    {HITS.map(([frame, sfx, volume], i) => (
      <Sequence key={i} name={`SFX ${sfx}`} from={Math.max(0, frame)} layout="none">
        <Audio src={staticFile(`sfx/${sfx}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </>
);
