import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT } from "../theme";
import { useUnit, useVoiceTime } from "../time";

// Couleurs du logo Inspi Story (relevées sur le fichier fourni).
export const BRAND = {
  paper: "#F0EFEA",
  navy: "#092942",
  gold: "#C0934F",
};

// Le logo est découpé en calques alignés sur la même toile (1047 × 423).
const CANVAS = { width: 1047, height: 423 };
const BOUNCE = Easing.bezier(0.34, 1.56, 0.64, 1);

const Layer: React.FC<{ file: string; style: React.CSSProperties }> = ({
  file,
  style,
}) => (
  <Img
    src={staticFile(`brand/${file}`)}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      ...style,
    }}
  />
);

// Carte de fin : le fond papier s'ouvre en cercle, l'hexagone se pose, l'étoile
// dorée jaillit puis scintille, et « Inspi Story » s'écrit de gauche à droite.
export const LogoOutro: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const t = useVoiceTime(start);
  const { u, width, height, portrait } = useUnit();
  const s = t - start;
  const radius = interpolate(
    s,
    [0, 0.55],
    [0, Math.hypot(width, height) / 2 + 4],
    { ...CLAMP, easing: EASE_IN_OUT },
  );
  const logoWidth = portrait ? 900 * u : 1180 * u;
  const icon = interpolate(s, [0.25, 0.95], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const spark = interpolate(s, [0.75, 1.2], [0, 1], {
    ...CLAMP,
    easing: BOUNCE,
  });
  const twinkle = interpolate(s, [2.0, 2.25, 2.6], [0, 1, 0], CLAMP);
  const inspi = interpolate(s, [0.85, 1.4], [36, 72], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const story = interpolate(s, [1.0, 1.6], [66, 106], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const wipe = (x: number) =>
    `linear-gradient(to right, #000 ${x}%, transparent ${x + 6}%)`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.paper,
        clipPath: `circle(${radius}px at 50% 50%)`,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: portrait ? 150 * u : 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: logoWidth,
          height: (logoWidth * CANVAS.height) / CANVAS.width,
          scale: interpolate(s, [0, end - start], [0.97, 1.02], CLAMP),
        }}
      >
        <Layer
          file="logo-icon.png"
          style={{
            opacity: interpolate(s, [0.25, 0.6], [0, 1], CLAMP),
            transformOrigin: "18.4% 50%",
            scale:
              0.6 +
              0.4 *
                interpolate(s, [0.25, 0.95], [0, 1], {
                  ...CLAMP,
                  easing: BOUNCE,
                }),
            rotate: `${(1 - icon) * -30}deg`,
            filter: `blur(${(1 - icon) * 12 * u}px)`,
          }}
        />
        <Layer
          file="logo-spark.png"
          style={{
            opacity: interpolate(s, [0.75, 0.9], [0, 1], CLAMP),
            transformOrigin: "30.4% 27.9%",
            scale: spark * (1 + 0.28 * twinkle),
            rotate: `${(1 - spark) * 90}deg`,
            filter: `drop-shadow(0 0 ${18 * u}px rgba(192, 147, 79, ${twinkle * 0.9}))`,
          }}
        />
        <Layer
          file="logo-inspi.png"
          style={{
            maskImage: wipe(inspi),
            WebkitMaskImage: wipe(inspi),
            translate: `${(1 - interpolate(s, [0.85, 1.4], [0, 1], { ...CLAMP, easing: EASE_OUT })) * -24 * u}px 0`,
          }}
        />
        <Layer
          file="logo-story.png"
          style={{
            maskImage: wipe(story),
            WebkitMaskImage: wipe(story),
            translate: `${(1 - interpolate(s, [1.0, 1.6], [0, 1], { ...CLAMP, easing: EASE_OUT })) * -24 * u}px 0`,
          }}
        />
      </div>
      {/* Fondu au noir final. */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(t, [end - 0.4, end - 0.02], [0, 1], CLAMP),
        }}
      />
    </AbsoluteFill>
  );
};
