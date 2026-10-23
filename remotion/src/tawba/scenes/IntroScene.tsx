import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { HighlightBox } from "../../components/HighlightBox";
import { Ornament } from "../../components/Ornament";
import { Words } from "../../components/Words";
import { INTRO } from "../script";
import { CLAMP, COLORS, EASE_IN, EASE_IN_OUT } from "../../theme";
import { useUnit, useVoiceTime } from "../../time";

// Ouverture bordeaux : « التوبة » seul au centre, puis il remonte pour laisser
// place à « لها ثلاثة شروط » et à l'encadré sable.
export const IntroScene: React.FC = () => {
  const t = useVoiceTime(INTRO.start);
  const { u, width, portrait } = useUnit();
  const settle = interpolate(t, [0.78, 1.4], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const exit = interpolate(t, [INTRO.exit, INTRO.exit + 0.55], [0, 1], {
    ...CLAMP,
    easing: EASE_IN,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.maroon,
        justifyContent: "center",
        paddingBottom: portrait ? 150 * u : 0,
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10 * u,
          translate: `0 ${(1 - settle) * 168 * u}px`,
          scale:
            1 +
            interpolate(t, [INTRO.start, INTRO.end], [0, 0.03], CLAMP) -
            exit * 0.05,
          filter: `blur(${exit * 8 * u}px)`,
        }}
      >
        <div style={{ opacity: 0.75, marginBottom: -36 * u * settle }}>
          <Ornament t={t} at={-0.35} size={92 * u} color={COLORS.blush} />
        </div>
        <div
          style={{ scale: 1 - settle * 0.2, marginBottom: -24 * u * settle }}
        >
          <Words
            words={INTRO.title}
            t={t}
            size={190 * u}
            color={COLORS.blush}
            weight={700}
            blur={28 * u}
            pace={2}
          />
        </div>
        <Words
          words={INTRO.subtitle}
          t={t}
          size={88 * u}
          color={COLORS.blush}
          blur={12 * u}
        />
        <div style={{ marginTop: 18 * u }}>
          <HighlightBox t={t} at={INTRO.boxIn} color={COLORS.sand} u={u}>
            <Words
              words={INTRO.box}
              t={t}
              size={74 * u}
              color={COLORS.maroon}
              weight={700}
              maxWidth={width - 260 * u}
              blur={10 * u}
            />
          </HighlightBox>
        </div>
      </div>
      {/* Ouverture au noir, comme la référence. */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.black,
          opacity: interpolate(t, [-0.5, 0.05], [1, 0], CLAMP),
        }}
      />
    </AbsoluteFill>
  );
};
