import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { rise } from "../anim";
import { Aurora } from "../components/Backgrounds";
import { InstagramGlyph } from "../components/Icons";
import { GradientLine, Words } from "../components/Text";
import { PillButton } from "../components/UI";
import { C, DISPLAY, TEXT } from "../theme";
import type { PromoProps } from "../schema";
import { CTA_DURATION } from "../timeline";

export const Cta: React.FC<PromoProps> = ({
  ctaLine1,
  ctaLine2,
  ctaButton,
  instagram,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const v = height > width;
  const handle = rise(frame, 70, 26);
  const fadeOut = interpolate(
    frame,
    [CTA_DURATION - 22, CTA_DURATION],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <Aurora intensity={1.1} />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            scale: `${1.04 - rise(frame, 0, CTA_DURATION) * 0.04}`,
          }}
        >
          <Words
            text={ctaLine1}
            start={10}
            stagger={4}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 500,
              fontSize: v ? 66 : 62,
              letterSpacing: "-0.025em",
              color: "rgba(255,255,255,0.78)",
              justifyContent: "center",
              textAlign: "center",
              maxWidth: v ? 900 : 1600,
              marginBottom: v ? 26 : 12,
            }}
          />
          <GradientLine
            text={ctaLine2}
            start={26}
            duration={30}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: v ? 176 : 172,
              lineHeight: 1.0,
              letterSpacing: "-0.05em",
              textAlign: "center",
              maxWidth: v ? 900 : 1760,
            }}
          />
          <div style={{ marginTop: v ? 90 : 70 }}>
            <PillButton
              label={ctaButton}
              start={56}
              light
              scale={v ? 1.1 : 1}
              icon={<InstagramGlyph size={38} color={C.ink} />}
            />
          </div>
          <div
            style={{
              marginTop: 40,
              fontFamily: TEXT,
              fontWeight: 500,
              fontSize: v ? 38 : 34,
              letterSpacing: "0.01em",
              color: C.silver,
              opacity: handle,
              translate: `0 ${(1 - handle) * 14}px`,
            }}
          >
            {instagram}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
