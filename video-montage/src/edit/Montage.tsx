import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BackgroundWordView, TextWall } from "./BehindSubject";
import { StackView } from "./Captions";
import { getCamera } from "./camera";
import { BACKGROUND_WORDS, SFX, STACKS } from "./script";

export type MontageProps = {
  /** Show the speaker cut-out layer (needed for text behind the subject). */
  cutout: boolean;
  /** Sound effects on/off (no music: added separately by the editor). */
  sfx: boolean;
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Montage: React.FC<MontageProps> = ({ cutout, sfx }) => {
  const frame = useCurrentFrame();
  const cam = getCamera(frame);
  const cameraStyle: React.CSSProperties = {
    transformOrigin: cam.origin,
    scale: String(cam.scale),
    translate: cam.translate,
    filter: cam.blur > 0.05 ? `blur(${cam.blur}px)` : undefined,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Graded footage group: plate -> text behind subject -> speaker cut-out -> vignette */}
      <AbsoluteFill style={{ filter: "contrast(1.07) saturate(1.06) brightness(0.98)" }}>
        <AbsoluteFill style={cameraStyle}>
          <OffthreadVideo src={staticFile("source.mp4")} />
        </AbsoluteFill>

        {BACKGROUND_WORDS.map((w) => (
          <BackgroundWordView key={w.name} word={w} />
        ))}
        <TextWall />

        {cutout ? (
          <AbsoluteFill style={cameraStyle}>
            <OffthreadVideo src={staticFile("cutout.webm")} transparent muted />
          </AbsoluteFill>
        ) : null}

        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 45% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Foreground captions (the "difference" words blend with everything below) */}
      {STACKS.map((s) => (
        <StackView key={s.name} stack={s} />
      ))}

      <Grain />

      {sfx
        ? SFX.map((s, i) => (
            <Sequence key={`${s.file}-${i}`} from={s.at} layout="none" name={`SFX ${s.file}`}>
              <Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
