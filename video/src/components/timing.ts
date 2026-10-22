import { Easing } from "remotion";

export const msToFrame = (ms: number, fps: number) =>
  Math.round((ms / 1000) * fps);

/** Le texte apparaît un tout petit peu avant la voix : l'œil lit, l'oreille confirme. */
export const LEAD_FRAMES = 3;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
