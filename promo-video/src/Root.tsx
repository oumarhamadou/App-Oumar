import React from "react";
import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import {
  CalculateMetadataFunction,
  Composition,
  Folder,
  staticFile,
} from "remotion";
import { Promo } from "./Promo";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { Reels } from "./scenes/Reels";
import { frProps, PromoProps, promoSchema, ruProps } from "./schema";
import "./theme";
import {
  CTA_DURATION,
  HOOK_DURATION,
  INTRO_DURATION,
  PROMO_DURATION,
  REELS_DURATION,
} from "./timeline";

/** Width / height of a video in public/, or 0 when the file is missing. */
const aspectOf = async (path: string) => {
  try {
    const input = new Input({
      formats: ALL_FORMATS,
      source: new UrlSource(staticFile(path)),
    });
    const track = await input.getPrimaryVideoTrack();
    return track ? track.displayWidth / track.displayHeight : 0;
  } catch {
    return 0;
  }
};

// Portfolio videos are optional: drop reel-1.mp4 / reel-2.mp4 into public/reels/ and they appear.
const detectReels: CalculateMetadataFunction<PromoProps> = async ({
  props,
}) => ({
  props: {
    ...props,
    reel1Aspect: await aspectOf(props.reel1),
    reel2Aspect: await aspectOf(props.reel2),
  },
});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Oumar-RU"
      component={Promo}
      durationInFrames={PROMO_DURATION}
      fps={30}
      width={1920}
      height={1080}
      schema={promoSchema}
      defaultProps={ruProps}
      calculateMetadata={detectReels}
    />
    <Composition
      id="Oumar-RU-Vertical"
      component={Promo}
      durationInFrames={PROMO_DURATION}
      fps={30}
      width={1080}
      height={1920}
      schema={promoSchema}
      defaultProps={ruProps}
      calculateMetadata={detectReels}
    />
    <Composition
      id="Oumar-FR"
      component={Promo}
      durationInFrames={PROMO_DURATION}
      fps={30}
      width={1920}
      height={1080}
      schema={promoSchema}
      defaultProps={frProps}
      calculateMetadata={detectReels}
    />
    <Composition
      id="Oumar-FR-Vertical"
      component={Promo}
      durationInFrames={PROMO_DURATION}
      fps={30}
      width={1080}
      height={1920}
      schema={promoSchema}
      defaultProps={frProps}
      calculateMetadata={detectReels}
    />
    <Folder name="Scenes">
      <Composition
        id="Hook"
        component={Hook}
        durationInFrames={HOOK_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={promoSchema}
        defaultProps={ruProps}
      />
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={INTRO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={promoSchema}
        defaultProps={ruProps}
      />
      <Composition
        id="Reels"
        component={Reels}
        durationInFrames={REELS_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={promoSchema}
        defaultProps={ruProps}
        calculateMetadata={detectReels}
      />
      <Composition
        id="Cta"
        component={Cta}
        durationInFrames={CTA_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={promoSchema}
        defaultProps={ruProps}
      />
    </Folder>
  </>
);
