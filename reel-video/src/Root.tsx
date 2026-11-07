import React from "react";
import { Composition, Folder } from "remotion";
import { LangProps } from "./i18n";
import { Reel } from "./Reel";
import { CardsScene } from "./scenes/CardsScene";
import { HookScene } from "./scenes/HookScene";
import { OutroScene } from "./scenes/OutroScene";
import { PlayScene } from "./scenes/PlayScene";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { TOTAL_FRAMES } from "./timings";

const fr: LangProps = { lang: "fr" };
const ru: LangProps = { lang: "ru" };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Final videos (9:16 for Reels) */}
      <Composition
        id="Reel-RU-Instagram"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={ru}
      />
      <Composition
        id="Reel-FR-Facebook"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={fr}
      />

      {/* Horizontal versions (16:9) */}
      <Composition
        id="Horizontal-RU-Instagram"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={HEIGHT}
        height={WIDTH}
        defaultProps={ru}
      />
      <Composition
        id="Horizontal-FR-Facebook"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={HEIGHT}
        height={WIDTH}
        defaultProps={fr}
      />

      {/* Individual scenes, connected to the timelines above */}
      <Folder name="Scenes">
        <Composition id="Hook" component={HookScene} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={fr} />
        <Composition id="Play" component={PlayScene} durationInFrames={235} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={fr} />
        <Composition id="Cards" component={CardsScene} durationInFrames={132} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={fr} />
        <Composition id="Outro" component={OutroScene} durationInFrames={270} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={fr} />
      </Folder>
    </>
  );
};
