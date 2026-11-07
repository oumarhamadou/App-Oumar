import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./components/Background";
import { DiffFlash } from "./components/DiffFlash";
import { LangProps } from "./i18n";
import { CardsScene } from "./scenes/CardsScene";
import { HookScene } from "./scenes/HookScene";
import { OutroScene } from "./scenes/OutroScene";
import { PlayScene } from "./scenes/PlayScene";
import { SoundDesign } from "./SoundDesign";
import { FLASH } from "./timings";

export const Reel: React.FC<LangProps> = ({ lang }) => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence name="Hook" durationInFrames={120}>
        <HookScene lang={lang} />
      </Sequence>
      <Sequence name="Play + services" from={105} durationInFrames={235}>
        <PlayScene lang={lang} />
      </Sequence>
      <Sequence name="Cards" from={330} durationInFrames={132}>
        <CardsScene lang={lang} />
      </Sequence>
      <Sequence name="Outro" from={450} durationInFrames={270}>
        <OutroScene lang={lang} />
      </Sequence>
      <Sequence name="Difference flash" from={FLASH.from} durationInFrames={FLASH.duration}>
        <DiffFlash />
      </Sequence>
      <SoundDesign lang={lang} />
    </AbsoluteFill>
  );
};
