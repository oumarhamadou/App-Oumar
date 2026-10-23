import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Ornament } from "../components/Ornament";
import { Words } from "../components/Words";
import { OUTRO } from "../script";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT, fontFamily } from "../theme";
import { useUnit, useVoiceTime } from "../time";

// Carte récapitulative : les quatre conditions d'un coup d'œil (bon pour les captures d'écran).
export const OutroScene: React.FC = () => {
  const t = useVoiceTime(OUTRO.start);
  const { u, width, height, portrait } = useUnit();
  const radius = interpolate(
    t,
    [OUTRO.start, OUTRO.start + 0.55],
    [0, Math.hypot(width, height) / 2 + 4],
    { ...CLAMP, easing: EASE_IN_OUT },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.maroon,
        clipPath: `circle(${radius}px at 50% 50%)`,
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
          gap: 18 * u,
          scale: interpolate(t, [OUTRO.start, OUTRO.end], [1.0, 1.03], CLAMP),
        }}
      >
        <div style={{ opacity: 0.75 }}>
          <Ornament
            t={t}
            at={OUTRO.start + 0.25}
            size={84 * u}
            color={COLORS.blush}
          />
        </div>
        <Words
          words={OUTRO.title}
          t={t}
          size={128 * u}
          color={COLORS.blush}
          weight={700}
          blur={18 * u}
          pace={1.4}
        />
        <div
          style={{
            direction: "rtl",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 26 * u,
            marginTop: 26 * u,
            maxWidth: portrait ? 740 * u : width - 160 * u,
          }}
        >
          {OUTRO.items.map((item) => {
            const pop = interpolate(t, [item.at, item.at + 0.5], [0, 1], {
              ...CLAMP,
              easing: EASE_OUT,
            });
            return (
              <div
                key={item.numeral}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18 * u,
                  padding: `${8 * u}px ${18 * u}px ${8 * u}px ${34 * u}px`,
                  borderRadius: 999,
                  backgroundColor: COLORS.sand,
                  fontFamily,
                  fontWeight: 700,
                  fontSize: 58 * u,
                  lineHeight: 1.5,
                  color: COLORS.maroon,
                  opacity: pop,
                  translate: `0 ${(1 - pop) * 30 * u}px`,
                  scale: 0.9 + 0.1 * pop,
                }}
              >
                <div
                  style={{
                    width: 72 * u,
                    height: 72 * u,
                    borderRadius: 72 * u,
                    backgroundColor: COLORS.maroon,
                    color: COLORS.blush,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 42 * u,
                    lineHeight: 1,
                  }}
                >
                  {item.numeral}
                </div>
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
      {/* Fondu au noir final. */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.black,
          opacity: interpolate(
            t,
            [OUTRO.end - 0.45, OUTRO.end - 0.02],
            [0, 1],
            CLAMP,
          ),
        }}
      />
    </AbsoluteFill>
  );
};
