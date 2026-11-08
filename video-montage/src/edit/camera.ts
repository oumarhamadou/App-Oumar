import { Easing, interpolate } from "remotion";
import { CAMERA, ZOOM_TRANSITIONS } from "./script";

export type CameraState = {
  scale: number;
  origin: string;
  blur: number;
  translate: string;
};

const zoomEase = Easing.bezier(0.7, 0, 0.2, 1);

export const getCamera = (frame: number): CameraState => {
  let i = CAMERA.length - 2;
  for (let k = 0; k < CAMERA.length - 1; k++) {
    if (frame < CAMERA[k + 1].frame) {
      i = k;
      break;
    }
  }
  const a = CAMERA[i];
  const b = CAMERA[i + 1];

  const transition = ZOOM_TRANSITIONS.find(([s, e]) => s === a.frame && e === b.frame);
  // A "cut" key starts a new shot: never interpolate across it.
  const scale = b.cut
    ? a.scale
    : interpolate(frame, [a.frame, b.frame], [a.scale, b.scale], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: transition ? zoomEase : Easing.linear,
      });

  let blur = 0;
  if (transition) {
    const p = interpolate(frame, [a.frame, b.frame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    blur = Math.sin(Math.PI * p) * 5;
  }

  // Small decaying shake right after a hard cut (impact feel).
  let shakeX = 0;
  let shakeY = 0;
  const lastCut = [...CAMERA].reverse().find((k) => k.cut && k.frame <= frame);
  if (lastCut && frame - lastCut.frame < 8) {
    const t = frame - lastCut.frame;
    const amp = 12 * Math.exp(-t / 2.5);
    shakeX = Math.sin(t * 2.7) * amp;
    shakeY = Math.cos(t * 3.9) * amp * 0.6;
  }

  return { scale, origin: `${a.ox}px ${a.oy}px`, blur, translate: `${shakeX}px ${shakeY}px` };
};
