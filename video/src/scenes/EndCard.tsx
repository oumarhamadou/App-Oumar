import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { InstagramGlyph } from "../components/SocialBadge";
import { Vignette } from "../components/Texture";
import { easeInOut } from "../components/timing";
import { colors } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Carte de fin : l'icône rebondit, s'illumine aux couleurs d'Instagram puis redevient blanche. */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.endCard,
        justifyContent: "center",
        alignItems: "center",
        opacity: interpolate(
          frame,
          [durationInFrames - 10, durationInFrames],
          [1, 0],
          clamp,
        ),
      }}
    >
      <Vignette bg="maroon" />
      <div
        style={{
          scale: interpolate(frame, [2, 22], [0.55, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 11, stiffness: 160 }),
          }),
          filter: `drop-shadow(0 0 ${interpolate(frame, [20, 40, 75, 95], [0, 26, 26, 0], clamp)}px rgba(214, 41, 118, 0.45))`,
        }}
      >
        <InstagramGlyph
          size={150}
          color="#FFFFFF"
          colorize={interpolate(frame, [18, 32, 72, 88], [0, 1, 1, 0], {
            ...clamp,
            easing: easeInOut,
          })}
          gradientAngle={interpolate(frame, [18, 88], [-40, 220])}
          id="ig-endcard"
        />
      </div>
    </AbsoluteFill>
  );
};
