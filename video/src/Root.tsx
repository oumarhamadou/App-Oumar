import type { Caption } from "@remotion/captions";
import React from "react";
import { Composition } from "remotion";
import captions from "./data/captions.json";
import { Montage } from "./Montage";
import { timeScript } from "./script/align";
import { script, settings } from "./script/script";

const FPS = 30;
const END_CARD_FRAMES = 3 * FPS;

const scenes = timeScript({
  scenes: script,
  captions: captions as Caption[],
  fps: FPS,
  prerollMs: settings.prerollMs,
  endMs: settings.textEndMs,
});
const endCardFrom = scenes[scenes.length - 1].to;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Montage"
      component={Montage}
      durationInFrames={endCardFrom + END_CARD_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        scenes,
        endCardFrom,
        endCardFrames: END_CARD_FRAMES,
      }}
    />
  );
};
