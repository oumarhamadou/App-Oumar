import { useCurrentFrame, useVideoConfig } from "remotion";
import { VOICE } from "./script";

// Image de la composition où commence un instant donné de la voix.
export const voiceToFrame = (seconds: number, fps: number) =>
  Math.round((seconds + VOICE.offset) * fps);

// Temps courant exprimé dans la piste voix, pour une scène qui démarre à `start`.
export const useVoiceTime = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (voiceToFrame(start, fps) + frame) / fps - VOICE.offset;
};

// Unité de mise en page : 1 px pour une vidéo 1080p, quel que soit le format.
export const useUnit = () => {
  const { width, height } = useVideoConfig();
  return {
    u: Math.min(width, height) / 1080,
    portrait: height > width,
    width,
    height,
  };
};
