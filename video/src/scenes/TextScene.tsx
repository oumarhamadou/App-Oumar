import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AnimatedLine } from "../components/AnimatedLine";
import { Vignette } from "../components/Texture";
import { easeInOut } from "../components/timing";
import type { Enter, TimedScene } from "../script/types";
import { backgroundColor } from "../theme";

/** Durée des entrées de scène (et donc du chevauchement avec la scène précédente). */
export const ENTER_FRAMES = 16;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Volets verticaux qui s'ouvrent depuis leur centre, en léger décalé. */
const blindsPolygon = (progress: number, bars = 8) => {
  const points: string[] = [];
  const w = 100 / bars;
  for (let i = 0; i < bars; i++) {
    const local = interpolate(
      progress,
      [i * 0.06, 1 - (bars - 1 - i) * 0.06],
      [0, 1],
      {
        ...clamp,
        easing: easeInOut,
      },
    );
    const half = (w / 2) * local * 1.02;
    const center = w * i + w / 2;
    points.push(
      `${center - half}% 100%`,
      `${center - half}% 0%`,
      `${center + half}% 0%`,
      `${center + half}% 100%`,
    );
  }
  return `polygon(${points.join(", ")})`;
};

const enterStyle = (enter: Enter, p: number): React.CSSProperties => {
  if (p >= 1) return {};
  switch (enter) {
    case "fade":
      return { opacity: p };
    case "wipeDown":
      return { clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` };
    case "wipeUp":
      return { clipPath: `inset(${(1 - p) * 100}% 0 0 0)` };
    case "softWipeDown": {
      const edge = p * 118;
      const mask = `linear-gradient(to bottom, black ${edge - 18}%, transparent ${edge}%)`;
      return { maskImage: mask, WebkitMaskImage: mask };
    }
    case "blinds":
      return { clipPath: blindsPolygon(p) };
  }
};

export const TextScene: React.FC<{
  scene: TimedScene;
  /** Dernière scène : elle clôt la vidéo par un fondu au noir. */
  isLast: boolean;
}> = ({ scene, isLast }) => {
  const frame = useCurrentFrame();
  const length = scene.to - scene.from;
  const enter = interpolate(
    frame,
    [0, scene.enter === "fade" ? 24 : ENTER_FRAMES],
    [0, 1],
    {
      ...clamp,
      easing: easeInOut,
    },
  );
  // Le texte s'efface dans le flou pendant que la scène suivante le recouvre.
  const exit = isLast
    ? 0
    : interpolate(
        frame,
        [length - 2, length + ENTER_FRAMES * 0.7],
        [0, 1],
        clamp,
      );

  return (
    <AbsoluteFill
      style={{
        opacity: isLast
          ? interpolate(frame, [length - 20, length - 1], [1, 0], clamp)
          : 1,
      }}
    >
      <AbsoluteFill style={enterStyle(scene.enter, enter)}>
        <AbsoluteFill style={{ backgroundColor: backgroundColor[scene.bg] }} />
        <Vignette bg={scene.bg} />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 30,
            padding: "0 220px",
            textAlign: "center",
            paddingBottom: 40,
            scale: interpolate(frame, [0, length + ENTER_FRAMES], [1, 1.035]),
            opacity: 1 - exit,
            filter: `blur(${exit * 10}px)`,
          }}
        >
          {scene.lines.map((line, i) => (
            <AnimatedLine
              key={i}
              line={line}
              bg={scene.bg}
              sceneFrom={scene.from}
            />
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
