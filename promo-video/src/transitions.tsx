import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { orbPosition } from "./scenes/Hook";
import { C } from "./theme";

type Empty = Record<string, never>;

/** The next scene grows out of the hook's glowing orb, rimmed with light. */
const OrbWipe: React.FC<TransitionPresentationComponentProps<Empty>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const { width, height } = useVideoConfig();
  const [x, y] = orbPosition(width, height);
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{ scale: `${1 + p * 0.08}`, filter: `blur(${p * 8}px)` }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const maxR = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
  const r = 32 + (maxR + 60 - 32) * p;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>
        {children}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.95)",
          boxShadow: `0 0 24px ${C.violet}, 0 0 60px ${C.pink}, 0 0 110px ${C.blue}, inset 0 0 40px rgba(162,89,255,0.55)`,
          opacity: 1 - Math.max(0, (p - 0.75) / 0.25),
        }}
      />
    </AbsoluteFill>
  );
};

export const orbWipe = (): TransitionPresentation<Empty> => ({
  component: OrbWipe,
  props: {},
});

/** Soft "depth" dissolve: old scene recedes, new scene settles in from slightly closer. */
const DepthDissolve: React.FC<TransitionPresentationComponentProps<Empty>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          opacity: 1 - p,
          scale: `${1 - p * 0.06}`,
          filter: `blur(${p * 14}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        opacity: p,
        scale: `${1.06 - p * 0.06}`,
        filter: `blur(${(1 - p) * 14}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const depthDissolve = (): TransitionPresentation<Empty> => ({
  component: DepthDissolve,
  props: {},
});
