import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Divider } from "../components/Ornament";
import { Watermark } from "../components/Watermark";
import { Words } from "../components/Words";
import { CONDITIONS, CONDITIONS_SCENE, type Condition } from "../script";
import { CLAMP, COLORS, EASE_IN, EASE_IN_OUT, fontFamily } from "../theme";
import { useUnit, useVoiceTime } from "../time";

const ConditionBlock: React.FC<{
  condition: Condition;
  t: number;
  u: number;
  maxWidth: number;
}> = ({ condition, t, u, maxWidth }) => {
  const { portrait } = useUnit();
  const start = condition.heading[0].at;
  if (t < start - 0.1 || t > condition.exit + 0.45) {
    return null;
  }
  const out = interpolate(t, [condition.exit, condition.exit + 0.32], [0, 1], {
    ...CLAMP,
    easing: EASE_IN,
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        paddingBottom: portrait ? 150 * u : 0,
        alignItems: "center",
        opacity: 1 - out,
        filter: `blur(${out * 14 * u}px)`,
        translate: `0 ${-out * 34 * u}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8 * u,
        }}
      >
        <Words
          words={condition.heading}
          t={t}
          size={114 * u}
          color={COLORS.ink}
          weight={700}
          blur={14 * u}
          pace={1.3}
        />
        <Divider
          t={t}
          at={start + 0.2}
          size={13 * u}
          width={86 * u}
          color={COLORS.maroonText}
        />
        <Words
          words={condition.sub}
          t={t}
          size={96 * u}
          color={COLORS.maroonText}
          weight={700}
          maxWidth={maxWidth}
          blur={12 * u}
        />
        {condition.quote.length > 0 ? (
          <div style={{ marginTop: 26 * u }}>
            <Words
              words={condition.quote}
              t={t}
              size={74 * u}
              color={COLORS.ink}
              accentColor={COLORS.maroonText}
              maxWidth={maxWidth}
            />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Fil d'avancement ١ ٢ ٣ en haut de l'écran.
const Progress: React.FC<{ t: number; u: number; top: number }> = ({
  t,
  u,
  top,
}) => {
  const node = 58 * u;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        direction: "rtl",
        justifyContent: "center",
        alignItems: "center",
        opacity: interpolate(t, [3.75, 4.2], [0, 1], CLAMP),
        translate: `0 ${interpolate(t, [3.75, 4.3], [-16 * u, 0], { ...CLAMP, easing: EASE_IN_OUT })}px`,
      }}
    >
      {CONDITIONS.map((c, i) => {
        const at = c.heading[0].at;
        const on = interpolate(t, [at - 0.05, at + 0.35], [0, 1], {
          ...CLAMP,
          easing: EASE_IN_OUT,
        });
        const next = CONDITIONS[i + 1];
        const link = next
          ? interpolate(
              t,
              [next.heading[0].at - 0.35, next.heading[0].at],
              [0, 1],
              {
                ...CLAMP,
                easing: EASE_IN_OUT,
              },
            )
          : 0;
        return (
          <React.Fragment key={c.numeral}>
            <div
              style={{
                width: node,
                height: node,
                borderRadius: node,
                border: `${2.5 * u}px solid ${COLORS.maroonText}`,
                backgroundColor: on > 0.5 ? COLORS.maroonText : "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily,
                fontWeight: 700,
                fontSize: 32 * u,
                color: on > 0.5 ? COLORS.cream : COLORS.maroonText,
                opacity: 0.35 + 0.65 * on,
                scale: 1 + 0.18 * Math.sin(on * Math.PI),
              }}
            >
              {c.numeral}
            </div>
            {next ? (
              <div
                style={{
                  width: 110 * u,
                  height: 2.5 * u,
                  margin: `0 ${14 * u}px`,
                  backgroundColor: `rgba(122, 26, 26, 0.25)`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: COLORS.maroonText,
                    transformOrigin: "right center",
                    scale: `${link} 1`,
                  }}
                />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Les trois conditions sur fond crème. Entrée en cercle qui s'ouvre (comme la référence).
export const ConditionsScene: React.FC = () => {
  const t = useVoiceTime(CONDITIONS_SCENE.start);
  const { u, width, height, portrait } = useUnit();
  const radius = interpolate(
    t,
    [CONDITIONS_SCENE.start, CONDITIONS_SCENE.start + 0.6],
    [0, Math.hypot(width, height) / 2 + 4],
    { ...CLAMP, easing: EASE_IN_OUT },
  );
  const maxWidth = width - (portrait ? 150 : 360) * u;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        clipPath: `circle(${radius}px at 50% 50%)`,
      }}
    >
      <AbsoluteFill
        style={{
          scale: interpolate(
            t,
            [CONDITIONS_SCENE.start, CONDITIONS_SCENE.end],
            [1.0, 1.035],
            CLAMP,
          ),
        }}
      >
        {CONDITIONS.map((c, i) => (
          <Watermark
            key={c.numeral}
            numeral={c.numeral}
            t={t}
            from={c.heading[0].at}
            to={i < CONDITIONS.length - 1 ? c.exit : CONDITIONS_SCENE.end}
            size={(portrait ? 980 : 860) * u}
          />
        ))}
        {CONDITIONS.map((c) => (
          <ConditionBlock
            key={c.numeral}
            condition={c}
            t={t}
            u={u}
            maxWidth={maxWidth}
          />
        ))}
      </AbsoluteFill>
      <Progress t={t} u={u} top={(portrait ? 230 : 88) * u} />
    </AbsoluteFill>
  );
};
