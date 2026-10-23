import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { HighlightBox } from "../components/HighlightBox";
import { Words } from "../components/Words";
import { RIGHTS } from "../script";
import { CLAMP, COLORS, EASE_IN } from "../theme";
import { useUnit, useVoiceTime } from "../time";

// Fond pêche, encadré bordeaux « إذا كان الذنب متعلقًا بحقوق الآخرين ! ».
// Sortie en zoom arrière flouté qui laisse place à la quatrième condition.
export const RightsScene: React.FC = () => {
  const t = useVoiceTime(RIGHTS.start);
  const { u, width, portrait } = useUnit();
  const out = interpolate(t, [RIGHTS.exit, RIGHTS.exit + 0.3], [0, 1], {
    ...CLAMP,
    easing: EASE_IN,
  });
  const maxWidth = width - (portrait ? 190 : 360) * u;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.peach,
        justifyContent: "center",
        paddingBottom: portrait ? 150 * u : 0,
        alignItems: "center",
        opacity: 1 - out,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44 * u,
          scale:
            1 +
            interpolate(t, [RIGHTS.start, RIGHTS.end], [0, 0.03], CLAMP) -
            out * 0.14,
          filter: `blur(${out * 12 * u}px)`,
        }}
      >
        <HighlightBox t={t} at={RIGHTS.boxIn} color={COLORS.maroonBox} u={u}>
          <Words
            words={RIGHTS.box}
            t={t}
            size={82 * u}
            color={COLORS.blush}
            weight={700}
            maxWidth={maxWidth}
            blur={10 * u}
          />
        </HighlightBox>
        <Words
          words={RIGHTS.quote}
          t={t}
          size={74 * u}
          color={COLORS.ink}
          maxWidth={maxWidth}
        />
      </div>
    </AbsoluteFill>
  );
};
