import React from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { rise } from "../anim";
import { Aurora } from "../components/Backgrounds";
import { PlayGlyph } from "../components/Icons";
import { Words } from "../components/Text";
import { C, DISPLAY, GLOW, TEXT } from "../theme";
import type { PromoProps } from "../schema";
import { REELS_DURATION } from "../timeline";

const PAD = 10;

/** Shown inside a window until the video file is dropped into public/reels/. */
const EmptyReel: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${30 + 20 * Math.sin(t * 0.6 + index)}% ${30 + 15 * Math.cos(t * 0.5)}%, rgba(46,123,255,0.55), transparent 55%),
          radial-gradient(circle at ${70 + 15 * Math.cos(t * 0.4 + index)}% ${75 + 10 * Math.sin(t * 0.7)}%, rgba(255,77,154,0.5), transparent 55%),
          #120F1E`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 108,
          height: 108,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.16)",
          border: "1px solid rgba(255,255,255,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 8,
        }}
      >
        <PlayGlyph size={52} color={C.white} />
      </div>
    </AbsoluteFill>
  );
};

type Slot = { x: number; y: number; w: number; h: number };

/** A floating macOS-style window playing one piece at its native aspect ratio. */
const Window: React.FC<{
  src: string;
  has: boolean;
  label: string;
  slot: Slot;
  bar: number;
  start: number;
  index: number;
}> = ({ src, has, label, slot, bar, start, index }) => {
  const frame = useCurrentFrame();
  const p = rise(frame, start, 42);
  const float = Math.sin((frame + index * 50) / 32) * 8;
  const sway = Math.sin((frame + index * 30) / 60) * 2.5;
  return (
    <div
      style={{
        position: "absolute",
        left: slot.x,
        top: slot.y,
        width: slot.w + PAD * 2,
        opacity: Math.min(1, p * 1.6),
        translate: `0 ${(1 - p) * 360 + float}px`,
        scale: `${0.92 + 0.08 * p}`,
        filter: `blur(${(1 - p) * 12}px)`,
        transform: `perspective(2400px) rotateX(${(1 - p) * 22}deg) rotateY(${sway}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: -40,
          height: 140,
          borderRadius: "50%",
          background: GLOW,
          filter: "blur(60px)",
          opacity: 0.5 * p,
        }}
      />
      <div
        style={{
          position: "relative",
          padding: `0 ${PAD}px ${PAD}px`,
          borderRadius: 30,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow:
            "0 50px 100px rgba(0,0,0,0.55), 0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            position: "relative",
            height: bar,
            display: "flex",
            alignItems: "center",
            gap: 9,
            paddingLeft: 8,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: TEXT,
              fontWeight: 500,
              fontSize: 20,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {label}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: slot.w,
            height: slot.h,
            borderRadius: 20,
            overflow: "hidden",
            background: C.black,
          }}
        >
          {has ? (
            // The clip starts as its window lands, so its opening is on screen.
            <Sequence from={start} layout="absolute-fill">
              <Video
                src={staticFile(src)}
                muted
                loop
                objectFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </Sequence>
          ) : (
            <EmptyReel index={index} />
          )}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

/** Lays the two videos out at their own aspect ratios. */
const layout = (
  w: number,
  h: number,
  a1: number,
  a2: number,
  bar: number,
): [Slot, Slot] => {
  const chrome = bar + PAD;
  if (h <= w) {
    // Side by side, same height.
    const gap = 48;
    const top = 390;
    const vh = Math.min(540, (w - 340 - gap - PAD * 4) / (a1 + a2));
    const w1 = a1 * vh;
    const w2 = a2 * vh;
    const x0 = (w - (w1 + w2 + PAD * 4 + gap)) / 2;
    return [
      { x: x0, y: top, w: w1, h: vh },
      { x: x0 + w1 + PAD * 2 + gap, y: top, w: w2, h: vh },
    ];
  }
  // Stacked: the first video takes up to half the room, the second the rest.
  const gap = 36;
  const top = 600;
  const bottom = h - 90;
  const maxW = w - 160 - PAD * 2;
  const budget = bottom - top - chrome * 2 - gap;
  const h1 = Math.min(maxW / a1, budget / 2);
  const h2 = Math.min(maxW / a2, budget - h1);
  const used = h1 + h2 + chrome * 2 + gap;
  const y0 = top + (bottom - top - used) / 2;
  return [
    { x: (w - a1 * h1 - PAD * 2) / 2, y: y0, w: a1 * h1, h: h1 },
    {
      x: (w - a2 * h2 - PAD * 2) / 2,
      y: y0 + h1 + chrome + gap,
      w: a2 * h2,
      h: h2,
    },
  ];
};

export const Reels: React.FC<PromoProps> = ({
  reelsEyebrow,
  reelsTitle,
  reelsSubtitle,
  reel1,
  reel2,
  reel1Label,
  reel2Label,
  reel1Aspect,
  reel2Aspect,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const v = height > width;
  const eyebrow = rise(frame, 6, 24);
  const bar = v ? 38 : 42;
  const [s1, s2] = layout(
    width,
    height,
    reel1Aspect || 9 / 16,
    reel2Aspect || 9 / 16,
    bar,
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Aurora intensity={0.75} />
      <AbsoluteFill
        style={{ scale: `${1.03 - rise(frame, 0, REELS_DURATION) * 0.03}` }}
      >
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: v ? 210 : 104,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: TEXT,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              backgroundImage: GLOW,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: eyebrow,
              translate: `0 ${(1 - eyebrow) * 16}px`,
              marginBottom: 18,
            }}
          >
            {reelsEyebrow}
          </div>
          <Words
            text={reelsTitle}
            start={10}
            stagger={5}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: v ? 104 : 100,
              lineHeight: 1.04,
              letterSpacing: "-0.045em",
              color: C.white,
              justifyContent: "center",
            }}
          />
          <Words
            text={reelsSubtitle}
            start={24}
            stagger={3}
            style={{
              fontFamily: TEXT,
              fontWeight: 500,
              fontSize: v ? 38 : 36,
              letterSpacing: "-0.01em",
              color: C.silver,
              marginTop: v ? 28 : 22,
              justifyContent: "center",
            }}
          />
        </div>

        <Window
          src={reel1}
          has={reel1Aspect > 0}
          label={reel1Label}
          slot={s1}
          bar={bar}
          start={22}
          index={1}
        />
        <Window
          src={reel2}
          has={reel2Aspect > 0}
          label={reel2Label}
          slot={s2}
          bar={bar}
          start={34}
          index={2}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
