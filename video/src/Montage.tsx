import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Grain } from "./components/Texture";
import { ENTER_FRAMES, TextScene } from "./scenes/TextScene";
import type { TimedScene } from "./script/types";

export type MontageProps = {
  scenes: TimedScene[];
};

export const Montage: React.FC<MontageProps> = ({ scenes }) => {
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
          <TextScene scene={scene} isLast={i === scenes.length - 1} />
        </Sequence>
      ))}
      <Grain />

      <Audio name="Voix" src={staticFile("voice.m4a")} />
    </AbsoluteFill>
  );
};
