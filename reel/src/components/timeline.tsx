import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { PaletteName } from "../theme";
import { GlowFlash } from "./transitions/GlowFlash";
import { GradientSweep } from "./transitions/GradientSweep";
import { IrisBloom } from "./transitions/IrisBloom";
import { PrismBars } from "./transitions/PrismBars";

export type SfxName =
  | "whoosh"
  | "whoosh-fast"
  | "riser"
  | "impact"
  | "pop"
  | "click"
  | "tick"
  | "ding"
  | "shimmer"
  | "swipe";

/** Places a sound effect at an absolute time in seconds. */
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({
  name,
  at,
  volume = 0.6,
}) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence name={`SFX ${name}`} from={Math.max(0, Math.round(at * fps))} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};

/** A timed layer on the edit, in seconds (premounted so fonts/media are ready). */
export const Beat: React.FC<{
  name: string;
  at: number;
  dur: number;
  children: React.ReactNode;
}> = ({ name, at, dur, children }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      name={name}
      from={Math.round(at * fps)}
      durationInFrames={Math.max(1, Math.round(dur * fps))}
      premountFor={fps}
    >
      {children}
    </Sequence>
  );
};

export type TransitionSpec = {
  /** Midpoint in seconds: the moment the frame is covered (put cuts here). */
  at: number;
  kind: "sweep" | "iris" | "bars" | "flash";
  palette?: PaletteName;
  dur?: number;
  label?: string;
  index?: string;
};

const defaultDur: Record<TransitionSpec["kind"], number> = {
  sweep: 0.9,
  iris: 0.9,
  bars: 0.8,
  flash: 0.55,
};

/** Renders a gradient transition centred on `at`, with matching sound design. */
export const TransitionAt: React.FC<TransitionSpec> = ({ at, kind, palette, dur, label, index }) => {
  const length = dur ?? defaultDur[kind] + (label ? 0.35 : 0);
  const start = at - length / 2;
  return (
    <>
      <Beat name={`Transition ${kind}${label ? ` · ${label}` : ""}`} at={start} dur={length}>
        {kind === "sweep" ? <GradientSweep palette={palette} label={label} index={index} /> : null}
        {kind === "iris" ? <IrisBloom palette={palette} /> : null}
        {kind === "bars" ? <PrismBars palette={palette} /> : null}
        {kind === "flash" ? <GlowFlash palette={palette} /> : null}
      </Beat>
      {kind === "flash" ? (
        <Sfx name="shimmer" at={at - 0.2} volume={0.5} />
      ) : (
        <>
          <Sfx name={kind === "bars" ? "whoosh-fast" : "whoosh"} at={at - (kind === "bars" ? 0.19 : 0.41)} volume={0.7} />
          {label ? <Sfx name="shimmer" at={at} volume={0.35} /> : null}
        </>
      )}
    </>
  );
};

/** Camera kicks (zoom-blur bumps) that sell each transition on the footage. */
export const kicksFor = (transitions: TransitionSpec[]) =>
  transitions.map((t) => ({
    at: t.at,
    duration: (t.dur ?? defaultDur[t.kind]) * 0.9,
    amount: t.kind === "flash" ? 0.05 : 0.09,
  }));
