import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Watermark } from "../components/Watermark";
import { Words } from "../components/Words";
import { FOURTH } from "../script";
import { CLAMP, COLORS, EASE_OUT } from "../theme";
import { useUnit, useVoiceTime } from "../time";

// La quatrième condition arrive en zoom avant (comme la référence),
// avec un « ٤ » en filigrane et « رابع » souligné.
export const FourthScene: React.FC = () => {
  const t = useVoiceTime(FOURTH.start);
  const { u, width, portrait } = useUnit();
  const enter = interpolate(
    t,
    [FOURTH.start + 0.04, FOURTH.start + 0.6],
    [0, 1],
    {
      ...CLAMP,
      easing: EASE_OUT,
    },
  );
  const maxWidth = width - (portrait ? 150 : 360) * u;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.peach }}>
      <Watermark
        numeral="٤"
        t={t}
        from={FOURTH.line[0].at}
        to={FOURTH.end}
        size={(portrait ? 980 : 860) * u}
      />
      <AbsoluteFill
        style={{
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
            gap: 30 * u,
            scale:
              1.14 -
              0.14 * enter +
              interpolate(t, [FOURTH.start, FOURTH.end], [0, 0.03], CLAMP),
            filter: `blur(${(1 - enter) * 10 * u}px)`,
          }}
        >
          <Words
            words={FOURTH.line}
            t={t}
            size={98 * u}
            color={COLORS.maroonText}
            accentColor={COLORS.maroonBox}
            weight={700}
            maxWidth={maxWidth}
            blur={12 * u}
          />
          <Words
            words={FOURTH.quote}
            t={t}
            size={78 * u}
            color={COLORS.ink}
            accentColor={COLORS.maroonText}
            maxWidth={maxWidth}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
