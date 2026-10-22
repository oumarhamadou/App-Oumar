import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ease } from "../../theme";

/** A framing that holds from `at` (seconds) until the next shot. */
export type Shot = {
  at: number;
  /** Punch-in amount. 1 = full frame, 1.12 = a typical talking-head punch-in. */
  scale?: number;
  /** Re-centre the punch-in, in % of the frame (e.g. y: -6 lifts the face). */
  x?: number;
  y?: number;
  /** Slow push-in added over the shot's length (0.03 = +3%). */
  drift?: number;
  /** Seconds to ease into this framing instead of hard-cutting. */
  smooth?: number;
};

/** Zoom-blur bump synchronised with a transition's midpoint. */
export type Kick = { at: number; duration?: number; amount?: number };

/** Decaying camera shake for impacts. */
export type Shake = { at: number; duration?: number; intensity?: number };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const CameraRig: React.FC<{
  shots: Shot[];
  kicks?: Kick[];
  shakes?: Shake[];
  children: React.ReactNode;
}> = ({ shots, kicks = [], shakes = [], children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const t = frame / fps;

  let index = 0;
  shots.forEach((candidate, i) => {
    if (candidate.at <= t) index = i;
  });
  const shot = shots[index] ?? { at: 0 };
  const prev = shots[index - 1];
  const nextAt = shots[index + 1]?.at ?? durationInFrames / fps;

  const target = { s: shot.scale ?? 1, x: shot.x ?? 0, y: shot.y ?? 0 };
  let { s, x, y } = target;

  if (shot.smooth && prev) {
    const k = interpolate(t, [shot.at, shot.at + shot.smooth], [0, 1], {
      ...clamp,
      easing: Easing.bezier(...ease.inOut),
    });
    s = interpolate(k, [0, 1], [prev.scale ?? 1, target.s]);
    x = interpolate(k, [0, 1], [prev.x ?? 0, target.x]);
    y = interpolate(k, [0, 1], [prev.y ?? 0, target.y]);
  }

  const drift = interpolate(t, [shot.at, nextAt], [0, shot.drift ?? 0.025], {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.67, 1),
  });

  let kickScale = 0;
  let kickBlur = 0;
  for (const kick of kicks) {
    const half = (kick.duration ?? 0.5) / 2;
    const bell = interpolate(t, [kick.at - half, kick.at, kick.at + half], [0, 1, 0], {
      ...clamp,
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    });
    kickScale += bell * (kick.amount ?? 0.08);
    kickBlur += bell * 10;
  }

  let shakeX = 0;
  let shakeY = 0;
  let shakeR = 0;
  for (const shake of shakes) {
    const d = shake.duration ?? 0.45;
    const decay = interpolate(t, [shake.at, shake.at + d], [1, 0], clamp);
    if (t < shake.at || decay <= 0) continue;
    const amp = decay * decay * (shake.intensity ?? 1) * width * 0.012;
    shakeX += (random(`sx-${frame}`) - 0.5) * 2 * amp;
    shakeY += (random(`sy-${frame}`) - 0.5) * 2 * amp;
    shakeR += (random(`sr-${frame}`) - 0.5) * decay * 1.2;
  }

  // Scaling must keep covering the frame, so offsets are bounded by the zoom.
  const total = s * (1 + drift) * (1 + kickScale);
  const maxOffset = ((total - 1) / 2) * 100;
  const ox = Math.max(-maxOffset, Math.min(maxOffset, x));
  const oy = Math.max(-maxOffset, Math.min(maxOffset, y));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: String(total * (shakeX || shakeY ? 1.03 : 1)),
          translate: `${ox + (shakeX / width) * 100}% ${oy + (shakeY / width) * 100}%`,
          rotate: `${shakeR}deg`,
          filter: kickBlur > 0.2 ? `blur(${kickBlur * (width / 1080)}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
