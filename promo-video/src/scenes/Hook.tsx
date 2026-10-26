import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { pop, rise } from "../anim";
import { Aurora } from "../components/Backgrounds";
import { GradientLine, Words } from "../components/Text";
import { C, DISPLAY } from "../theme";
import type { PromoProps } from "../schema";
import { HOOK_DURATION } from "../timeline";

/** Where the glowing orb sits; the next scene opens out of it. */
export const orbPosition = (w: number, h: number): [number, number] =>
  h > w ? [w / 2, h / 2 + 330] : [w / 2, h / 2 + 215];

export const Hook: React.FC<PromoProps> = ({ hookLine1, hookLine2 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const v = height > width;
  const [ox, oy] = orbPosition(width, height);
  const orb = pop(frame, 52, 26);
  const breathe = 1 + Math.sin(frame / 5) * 0.06;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Aurora />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          scale: `${1 + rise(frame, 0, HOOK_DURATION) * 0.05}`,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: v ? 120 : 60,
        }}
      >
        <Words
          text={hookLine1}
          start={6}
          stagger={5}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 500,
            fontSize: v ? 72 : 66,
            letterSpacing: "-0.02em",
            color: C.silver,
            justifyContent: "center",
            marginBottom: v ? 18 : 6,
          }}
        />
        <GradientLine
          text={hookLine2}
          start={20}
          duration={30}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: v ? 150 : 176,
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            textAlign: "center",
            maxWidth: v ? 900 : 1700,
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: ox,
          top: oy,
          opacity: Math.min(1, orb * 1.4),
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            left: -150,
            top: -150,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(162,89,255,0.55) 0%, rgba(255,77,154,0.18) 40%, transparent 70%)`,
            scale: `${orb * breathe}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 64,
            height: 64,
            left: -32,
            top: -32,
            borderRadius: "50%",
            background: `radial-gradient(circle at 34% 30%, #FFFFFF 0%, #EDE6FF 22%, ${C.violet} 62%, ${C.blue} 100%)`,
            boxShadow: `0 0 30px rgba(162,89,255,0.9), 0 0 80px rgba(255,77,154,0.55), 0 0 140px rgba(46,123,255,0.4)`,
            scale: `${orb * breathe}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
