import React from "react";
import { interpolate } from "remotion";
import type { Word } from "../text";
import { CLAMP, EASE_OUT, fontFamily } from "../theme";
import { useUnit } from "../time";

type Props = {
  words: Word[];
  t: number;
  size: number;
  color: string;
  accentColor?: string;
  weight?: 400 | 700;
  maxWidth?: number;
  blur?: number;
  // Multiplie la durée d'apparition de chaque mot (titres plus lents).
  pace?: number;
};

// Ligne arabe révélée mot par mot, au rythme de la voix.
// Chaque mot s'écrit de droite à gauche (balayage doux) en sortant d'un léger flou,
// comme la frappe de la référence mais sans casser la liaison des lettres.
export const Words: React.FC<Props> = ({
  words,
  t,
  size,
  color,
  accentColor,
  weight = 400,
  maxWidth,
  blur = 10,
  pace = 1,
}) => {
  const { portrait } = useUnit();
  return (
    <div
      style={{
        direction: "rtl",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: "0.24em",
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.55,
        color,
        maxWidth,
      }}
    >
      {words.map((word, i) => {
        const sweep = interpolate(
          t,
          [word.at, word.at + 0.34 * pace],
          [-25, 100],
          {
            ...CLAMP,
            easing: EASE_OUT,
          },
        );
        const mask = `linear-gradient(to left, #000 ${sweep}%, transparent ${sweep + 25}%)`;
        return (
          <React.Fragment key={i}>
            {word.breakPortrait && portrait ? (
              <span style={{ flexBasis: "100%", height: 0 }} />
            ) : null}
            <span
              style={{
                position: "relative",
                display: "inline-block",
                whiteSpace: "nowrap",
                // Marge de sécurité pour que le masque n'ampute pas hampes et points.
                padding: "0.3em 0.12em",
                margin: "-0.3em -0.12em",
                color: word.accent && accentColor ? accentColor : color,
                opacity: interpolate(
                  t,
                  [word.at, word.at + 0.22 * pace],
                  [0, 1],
                  CLAMP,
                ),
                translate: `0 ${interpolate(t, [word.at, word.at + 0.5 * pace], [0.16, 0], { ...CLAMP, easing: EASE_OUT })}em`,
                filter: `blur(${interpolate(t, [word.at, word.at + 0.45 * pace], [blur, 0], { ...CLAMP, easing: EASE_OUT })}px)`,
                maskImage: mask,
                WebkitMaskImage: mask,
              }}
            >
              {word.text}
              {word.mark === "underline" ? (
                <span
                  style={{
                    position: "absolute",
                    insetInline: "0.12em",
                    bottom: "0.42em",
                    height: "0.07em",
                    borderRadius: "0.04em",
                    backgroundColor:
                      word.accent && accentColor ? accentColor : color,
                    transformOrigin: "right center",
                    scale: `${interpolate(t, [word.at + 0.25, word.at + 0.7], [0, 1], { ...CLAMP, easing: EASE_OUT })} 1`,
                  }}
                />
              ) : null}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
