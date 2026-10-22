import type { Caption } from "@remotion/captions";
import React from "react";
import { Composition } from "remotion";
import captions from "./data/captions.json";
import { Montage } from "./Montage";
import { timeScript } from "./script/align";
import { script, settings } from "./script/script";

const FPS = 30;

const scenes = timeScript({
  scenes: script,
  captions: captions as Caption[],
  fps: FPS,
  prerollMs: settings.prerollMs,
  endMs: settings.textEndMs,
});

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Montage"
      component={Montage}
      durationInFrames={scenes[scenes.length - 1].to}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ scenes }}
    />
  );
};
