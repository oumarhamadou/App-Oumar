import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Easing } from "remotion";
import { Cta, CTA_DURATION } from "./scenes/Cta";
import { Hook, HOOK_DURATION } from "./scenes/Hook";
import { Intro, INTRO_DURATION } from "./scenes/Intro";
import { Reels, REELS_DURATION } from "./scenes/Reels";
import { Sound } from "./Sound";
import { depthDissolve, orbWipe } from "./transitions";
import { fade } from "@remotion/transitions/fade";
import type { PromoProps } from "./schema";

const ORB_WIPE = 24;
const INTO_REELS = 12;
const INTO_CTA = 20;

export const PROMO_DURATION =
  HOOK_DURATION +
  INTRO_DURATION +
  REELS_DURATION +
  CTA_DURATION -
  ORB_WIPE -
  INTO_REELS -
  INTO_CTA;

export const Promo: React.FC<PromoProps> = (props) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Hook" durationInFrames={HOOK_DURATION}>
        <Hook {...props} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={orbWipe()}
        timing={linearTiming({
          durationInFrames: ORB_WIPE,
          easing: Easing.bezier(0.7, 0, 0.25, 1),
        })}
      />
      <TransitionSeries.Sequence name="Intro" durationInFrames={INTRO_DURATION}>
        <Intro {...props} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: INTO_REELS })}
      />
      <TransitionSeries.Sequence name="Reels" durationInFrames={REELS_DURATION}>
        <Reels {...props} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={depthDissolve()}
        timing={linearTiming({
          durationInFrames: INTO_CTA,
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        })}
      />
      <TransitionSeries.Sequence name="CTA" durationInFrames={CTA_DURATION}>
        <Cta {...props} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Sound />
  </AbsoluteFill>
);
