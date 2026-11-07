import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BigTypeCard,
  CaptionsCard,
  CARD_H,
  CARD_W,
  GrowthCard,
  KeyframesCard,
  PhotoCard,
  ReelsCard,
  SoundCard,
  TimelineCard,
  UICard,
} from "../components/Cards";
import { COPY, LangProps } from "../i18n";
import { useLayout } from "../layout";
import { CLAMP, EASE_IN, fontFamily } from "../theme";
import { cardsTiming } from "../timings";

const R = 720; // ring radius (camera sits inside the ring, like the reference)
const PERSPECTIVE = 1250;
const STEP = 36; // 10 cards around

export const CardsScene: React.FC<LangProps> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, cx, cy } = useLayout();
  const copy = COPY[lang];

  const cards: React.ReactNode[] = [
    <PhotoCard key="p1" photo={copy.photo} name={copy.name} />,
    <TimelineCard key="tl" copy={copy} />,
    <GrowthCard key="gr" copy={copy} />,
    <ReelsCard key="re" copy={copy} />,
    <CaptionsCard key="ca" copy={copy} photo={copy.photo} />,
    <PhotoCard key="p2" photo={copy.photo} name={copy.name} tint />,
    <UICard key="ui" copy={copy} />,
    <SoundCard key="so" copy={copy} />,
    <KeyframesCard key="kf" copy={copy} />,
    <BigTypeCard key="bt" />,
  ];

  // Ring spin: fast whip-in that settles into a slow drift, plus a second
  // whip (synced with the swish SFX) to show more of the cards.
  const settle = spring({ frame, fps, config: { damping: 22, stiffness: 60, mass: 1 } });
  const kick = spring({ frame: frame - cardsTiming.kick, fps, config: { damping: 18, stiffness: 90 } });
  const ringRot = 150 * (1 - settle) - frame * 0.6 - kick * 108;

  const collapse = interpolate(frame, [cardsTiming.exit, cardsTiming.exit + 22], [0, 1], { ...CLAMP, easing: EASE_IN });

  const placed = cards.map((node, i) => {
    let phi = ((i * STEP + ringRot) % 360 + 540) % 360 - 180; // [-180, 180)
    const fly = spring({ frame: frame - i * 1.5, fps, config: { damping: 18, stiffness: 120 } });
    phi += (1 - fly) * 40;
    const z = R * (1 - Math.cos((phi * Math.PI) / 180));
    return { node, phi, z, fly, i };
  });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AbsoluteFill
        style={{
          scale: (wide ? 0.8 : 1) * (1 - collapse * 0.88),
          opacity: 1 - collapse,
          rotate: `${collapse * -25}deg`,
          filter: `blur(${collapse * 8}px)`,
        }}
      >
        {placed
          .filter((c) => Math.abs(c.phi) < 74)
          .sort((a, b) => a.z - b.z)
          .map(({ node, phi, fly, i }) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx - CARD_W / 2,
                top: cy - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                transform: `perspective(${PERSPECTIVE}px) rotateX(6deg) translateZ(${R - (1 - fly) * 900}px) rotateY(${phi}deg) translateZ(${-R}px)`,
                opacity: interpolate(Math.abs(phi), [56, 74], [1, 0], CLAMP) * Math.min(1, fly * 1.5),
                boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
                borderRadius: 44,
              }}
            >
              {node}
            </div>
          ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
