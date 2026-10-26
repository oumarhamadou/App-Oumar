import React from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { glide, pop, rise } from "../anim";
import { Aurora } from "../components/Backgrounds";
import { InstagramGlyph, PlayGlyph } from "../components/Icons";
import { Phone } from "../components/Phone";
import { Words } from "../components/Text";
import { Chip } from "../components/UI";
import { C, DISPLAY, GLOW, TEXT } from "../theme";
import type { PromoProps } from "../schema";

export const REELS_DURATION = 240;

/** Shown inside a phone until the real reel file is dropped into public/reels/. */
const EmptyReel: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${30 + 20 * Math.sin(t * 0.6 + index)}% ${30 + 15 * Math.cos(t * 0.5)}%, rgba(46,123,255,0.55), transparent 55%),
          radial-gradient(circle at ${70 + 15 * Math.cos(t * 0.4 + index)}% ${75 + 10 * Math.sin(t * 0.7)}%, rgba(255,77,154,0.5), transparent 55%),
          radial-gradient(circle at 80% 15%, rgba(255,154,60,0.35), transparent 45%),
          #120F1E`,
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
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
      <div
        style={{
          fontFamily: TEXT,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        REEL 0{index}
      </div>
    </AbsoluteFill>
  );
};

const ReelPhone: React.FC<{
  src: string;
  has: boolean;
  index: number;
  width: number;
  start: number;
  x: number;
  y: number;
  tilt: number;
}> = ({ src, has, index, width, start, x, y, tilt }) => {
  const frame = useCurrentFrame();
  const p = rise(frame, start, 40);
  const float = Math.sin((frame + index * 40) / 28) * 10;
  // Slow turn toward the viewer while the reels play.
  const turn = 1 - 0.45 * glide(frame, 50, 180);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: Math.min(1, p * 1.6),
        translate: `0 ${(1 - p) * 520 + float}px`,
        transform: `perspective(2200px) rotateY(${tilt * (0.4 + 0.6 * p) * turn + Math.sin(frame / 50) * 2}deg) rotateX(${(1 - p) * 18 + 3}deg) rotateZ(${(1 - p) * tilt * -0.4}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          bottom: -width * 0.12,
          height: width * 0.3,
          borderRadius: "50%",
          background: GLOW,
          filter: `blur(${width * 0.14}px)`,
          opacity: 0.55 * p,
        }}
      />
      <Phone width={width}>
        {has ? (
          <Video
            src={staticFile(src)}
            muted
            loop
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <EmptyReel index={index} />
        )}
      </Phone>
    </div>
  );
};

export const Reels: React.FC<PromoProps> = ({
  reelsEyebrow,
  reelsTitle,
  reelsSubtitle,
  instagram,
  reel1,
  reel2,
  hasReel1,
  hasReel2,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const v = height > width;
  const eyebrow = rise(frame, 6, 24);
  const chip = pop(frame, 52, 30);
  const phoneW = v ? 420 : 400;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Aurora intensity={0.75} />
      <AbsoluteFill
        style={{ scale: `${1.03 - rise(frame, 0, REELS_DURATION) * 0.03}` }}
      >
        <div
          style={{
            position: "absolute",
            left: v ? 80 : 170,
            top: v ? 230 : 280,
            width: v ? 920 : 760,
            display: "flex",
            flexDirection: "column",
            alignItems: v ? "center" : "flex-start",
            textAlign: v ? "center" : "left",
          }}
        >
          <div
            style={{
              fontFamily: TEXT,
              fontWeight: 600,
              fontSize: 32,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              backgroundImage: GLOW,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: eyebrow,
              translate: `0 ${(1 - eyebrow) * 16}px`,
              marginBottom: 22,
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
              fontSize: v ? 112 : 128,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              color: C.white,
              justifyContent: v ? "center" : "flex-start",
            }}
          />
          <Words
            text={reelsSubtitle}
            start={26}
            stagger={3}
            style={{
              fontFamily: TEXT,
              fontWeight: 500,
              fontSize: v ? 40 : 42,
              letterSpacing: "-0.015em",
              color: C.silver,
              marginTop: 30,
              justifyContent: v ? "center" : "flex-start",
            }}
          />
          {!v && (
            <Chip
              start={52}
              dark
              style={{
                position: "relative",
                marginTop: 48,
                opacity: Math.min(1, chip * 1.5),
              }}
            >
              <InstagramGlyph size={32} color={C.white} />
              {instagram}
            </Chip>
          )}
        </div>

        <ReelPhone
          src={reel2}
          has={hasReel2}
          index={2}
          width={phoneW}
          start={27}
          x={v ? 580 : 1395}
          y={v ? 650 : 100}
          tilt={v ? -10 : -17}
        />
        <ReelPhone
          src={reel1}
          has={hasReel1}
          index={1}
          width={phoneW}
          start={18}
          x={v ? 80 : 1010}
          y={v ? 700 : 150}
          tilt={v ? 10 : -17}
        />

        {v && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1600,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Chip start={52} dark style={{ position: "relative" }}>
              <InstagramGlyph size={32} color={C.white} />
              {instagram}
            </Chip>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
