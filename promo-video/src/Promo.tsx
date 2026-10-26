import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Easing } from "remotion";
import { fade } from "@remotion/transitions/fade";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { Reels } from "./scenes/Reels";
import { Sound } from "./Sound";
import type { PromoProps } from "./schema";
import {
  CTA_DURATION,
  HOOK_DURATION,
  INTO_CTA,
  INTO_REELS,
  INTRO_DURATION,
  ORB_WIPE,
  REELS_DURATION,
} from "./timeline";
import { depthDissolve, orbWipe } from "./transitions";

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
