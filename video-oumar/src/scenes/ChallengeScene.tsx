import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_OUT, pop, typedCount } from "../anim";
import { EMOJI_FONT, FONT } from "../fonts";
import { scene } from "../timeline";

const ICONS = [
  { emoji: "📅", bg: "linear-gradient(160deg,#FFFFFF,#ECECF1)" },
  { emoji: "🎯", bg: "linear-gradient(160deg,#FFFFFF,#E9EEF8)" },
  { emoji: "⏰", bg: "linear-gradient(160deg,#FFE7E4,#FFC9C2)" },
  { emoji: "🎬", bg: "linear-gradient(160deg,#3A3A40,#121214)" },
  { emoji: "💡", bg: "linear-gradient(160deg,#FFE680,#FFC531)" },
  { emoji: "📈", bg: "linear-gradient(160deg,#FFFFFF,#E5F4EA)" },
  { emoji: "🎙️", bg: "linear-gradient(160deg,#D9B8FF,#9B5CF6)" },
  { emoji: "✂️", bg: "linear-gradient(160deg,#FFB86B,#FF7A1A)" },
  { emoji: "📝", bg: "linear-gradient(160deg,#FFFFFF,#FFF4C9)" },
  { emoji: "💰", bg: "linear-gradient(160deg,#B6F0C6,#3DBB6A)" },
];

const RADIUS = 345;

/** "et je me lance un défi" — a black pill with app icons orbiting around it. */
export const ChallengeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = scene("challenge");
  const D = durationInFrames;

  // Ring rotation: fast spin-in, slow drift, fast spin-out.
  const angleAt = (f: number) =>
    interpolate(f, [0, 16], [-220, 0], { ...CLAMP, easing: EASE_OUT }) +
    f * 0.35 +
    interpolate(f, [D - 12, D], [0, 160], { ...CLAMP, easing: EASE_IN });
  const angle = angleAt(frame);
  const speed = Math.abs(angle - angleAt(frame - 1));
  const motionBlur = Math.min(9, speed * 0.35);

  const ringIn = interpolate(frame, [0, 14], [0.45, 1], { ...CLAMP, easing: EASE_OUT });
  const ringOut = interpolate(frame, [D - 12, D], [1, 0.05], { ...CLAMP, easing: EASE_IN });
  const radius = RADIUS * ringIn * ringOut;

  const text = "je me lance un défi";
  const spokenText = "et je me lance un défi";
  const typed = Math.max(0, typedCount(spokenText, words, frame) - 3);

  const pill = pop(frame, 0, { damping: 13, stiffness: 160 });
  const pillOut = interpolate(frame, [D - 10, D], [1, 0.4], { ...CLAMP, easing: EASE_IN });

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background:
          "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F3F7FE 45%, #DCE9FC 100%)",
      }}
    >
      {ICONS.map((icon, i) => {
        const a = ((angle + (i * 360) / ICONS.length) * Math.PI) / 180;
        const x = 540 + Math.cos(a) * radius;
        const y = 540 + Math.sin(a) * radius;
        const p = pop(frame, i * 1.2, { damping: 14, stiffness: 150 });
        return (
          <div
            key={icon.emoji}
            style={{
              position: "absolute",
              left: x - 62,
              top: y - 62,
              width: 124,
              height: 124,
              borderRadius: 32,
              background: icon.bg,
              boxShadow: "0 14px 34px rgba(30,60,120,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 66,
              fontFamily: EMOJI_FONT,
              scale: String(Math.max(0, p) * (0.6 + 0.4 * ringOut)),
              opacity: Math.min(1, p * 1.5) * (frame > D - 3 ? 0 : 1),
              filter: `blur(${motionBlur}px)`,
            }}
          >
            {icon.emoji}
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            minWidth: 120,
            height: 104,
            padding: "0 50px",
            borderRadius: 999,
            backgroundColor: "#0B0B0D",
            color: "white",
            display: "flex",
            alignItems: "center",
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
            scale: String(Math.max(0, pill) * pillOut),
            filter: `blur(${(1 - Math.min(1, pill)) * 10 + (1 - pillOut) * 12}px)`,
            whiteSpace: "pre",
          }}
        >
          {text.slice(0, typed)}
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: 50,
              marginLeft: 4,
              borderRadius: 2,
              backgroundColor: "white",
              opacity: typed < text.length || Math.floor(frame / 8) % 2 === 0 ? 0.9 : 0,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
