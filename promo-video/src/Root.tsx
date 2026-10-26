import React from "react";
import {
  CalculateMetadataFunction,
  Composition,
  Folder,
  staticFile,
} from "remotion";
import { Promo, PROMO_DURATION } from "./Promo";
import { Cta, CTA_DURATION } from "./scenes/Cta";
import { Hook, HOOK_DURATION } from "./scenes/Hook";
import { Intro, INTRO_DURATION } from "./scenes/Intro";
import { Reels, REELS_DURATION } from "./scenes/Reels";
import { defaultPromoProps, PromoProps, promoSchema } from "./schema";
import "./theme";

const exists = async (path: string) => {
  try {
    const res = await fetch(staticFile(path), { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};

// Reels are optional: drop reel-1.mp4 / reel-2.mp4 into public/reels/ and they appear.
const detectReels: CalculateMetadataFunction<PromoProps> = async ({
  props,
}) => ({
  props: {
    ...props,
    hasReel1: await exists(props.reel1),
    hasReel2: await exists(props.reel2),
  },
});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="OumarPromo"
      component={Promo}
      durationInFrames={PROMO_DURATION}
      fps={30}
      width={1920}
      height={1080}
      schema={promoSchema}
      defaultProps={defaultPromoProps}
      calculateMetadata={detectReels}
    />
    <Composition
      id="OumarPromoVertical"
      component={Promo}
      durationInFrames={PROMO_DURATION}
      fps={30}
      width={1080}
      height={1920}
      schema={promoSchema}
      defaultProps={defaultPromoProps}
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
        defaultProps={defaultPromoProps}
      />
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={INTRO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={promoSchema}
        defaultProps={defaultPromoProps}
      />
      <Composition
        id="Reels"
        component={Reels}
        durationInFrames={REELS_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={promoSchema}
        defaultProps={defaultPromoProps}
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
        defaultProps={defaultPromoProps}
      />
    </Folder>
  </>
);
