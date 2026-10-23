import React from "react";
import { Composition, Folder } from "remotion";
import { ConditionsScene } from "./tawba/scenes/ConditionsScene";
import { FourthScene } from "./tawba/scenes/FourthScene";
import { IntroScene } from "./tawba/scenes/IntroScene";
import { OutroScene } from "./tawba/scenes/OutroScene";
import { RightsScene } from "./tawba/scenes/RightsScene";
import {
  CONDITIONS_SCENE,
  FOURTH,
  INTRO,
  OUTRO,
  RIGHTS,
  VIDEO_END,
} from "./tawba/script";
import { Daira } from "./daira/Daira";
import { VIDEO_END as DAIRA_END } from "./daira/script";
import { Tawba } from "./tawba/Tawba";
import { span } from "./time";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Format de la référence (16:9), en Full HD. */}
      <Composition
        id="Tawba"
        component={Tawba}
        durationInFrames={span(-0.5, VIDEO_END, FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* Même montage en vertical pour Reels / TikTok / Shorts. */}
      <Composition
        id="Tawba-Vertical"
        component={Tawba}
        durationInFrames={span(-0.5, VIDEO_END, FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      {/* Vidéo « الدائرة » pour Inspi Story, avec le logo en fin. */}
      <Composition
        id="Daira"
        component={Daira}
        durationInFrames={span(-0.5, DAIRA_END, FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Daira-Vertical"
        component={Daira}
        durationInFrames={span(-0.5, DAIRA_END, FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Folder name="Tawba-Scenes">
        <Composition
          id="Intro"
          component={IntroScene}
          durationInFrames={span(INTRO.start, INTRO.end, FPS)}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="Conditions"
          component={ConditionsScene}
          durationInFrames={span(
            CONDITIONS_SCENE.start,
            CONDITIONS_SCENE.end,
            FPS,
          )}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="Droits"
          component={RightsScene}
          durationInFrames={span(RIGHTS.start, RIGHTS.end, FPS)}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="Quatrieme"
          component={FourthScene}
          durationInFrames={span(FOURTH.start, FOURTH.end, FPS)}
          fps={FPS}
          width={1920}
          height={1080}
        />
        <Composition
          id="Recap"
          component={OutroScene}
          durationInFrames={span(OUTRO.start, OUTRO.end, FPS)}
          fps={FPS}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
