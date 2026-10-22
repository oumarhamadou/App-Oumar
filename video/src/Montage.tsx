import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Grain } from "./components/Texture";
import { EndCard } from "./scenes/EndCard";
import { ENTER_FRAMES, TextScene } from "./scenes/TextScene";
import type { TimedScene } from "./script/types";

export type MontageProps = {
  scenes: TimedScene[];
  /** Image où la carte de fin démarre (après la dernière phrase). */
  endCardFrom: number;
  endCardFrames: number;
};

export const Montage: React.FC<MontageProps> = ({
  scenes,
  endCardFrom,
  endCardFrames,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, i) => (
        <Sequence
          key={scene.id}
          name={scene.id}
          from={scene.from}
          // La scène reste affichée pendant l'entrée de la suivante, qui la recouvre.
          durationInFrames={scene.to - scene.from + ENTER_FRAMES}
        >
          <TextScene
            scene={scene}
            isFirst={i === 0}
            isLast={i === scenes.length - 1}
          />
        </Sequence>
      ))}
      <Sequence
        name="Carte de fin"
        from={endCardFrom}
        durationInFrames={endCardFrames}
      >
        <EndCard />
      </Sequence>
      <Grain />

      <Audio name="Voix" src={staticFile("voice.m4a")} />
      {scenes.slice(1).map((scene) => (
        <Audio
          key={scene.id}
          name={`Whoosh ${scene.id}`}
          src={staticFile("sfx/whoosh.wav")}
          from={scene.from - 8}
          volume={0.16}
        />
      ))}
      <Audio
        name="Impact fin"
        src={staticFile("sfx/hit.wav")}
        from={endCardFrom}
        volume={(f) =>
          interpolate(f, [0, 2], [0, 0.5], { extrapolateRight: "clamp" })
        }
      />
    </AbsoluteFill>
  );
};
