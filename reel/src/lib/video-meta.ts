import { ALL_FORMATS, Input, UrlSource } from "mediabunny";

const COMMON_FPS = [23.976, 24, 25, 29.97, 30, 50, 59.94, 60];

export type VideoMeta = {
  width: number;
  height: number;
  fps: number;
  durationInSeconds: number;
};

/** Reads the source footage so the edit keeps its exact format. */
export const getVideoMeta = async (src: string): Promise<VideoMeta> => {
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(src) });
  const track = await input.getPrimaryVideoTrack();
  if (!track) {
    throw new Error(`No video track found in ${src}`);
  }

  const stats = await track.computePacketStats(120);
  const measured = stats.averagePacketRate;
  const snapped = COMMON_FPS.reduce((best, f) =>
    Math.abs(f - measured) < Math.abs(best - measured) ? f : best,
  );

  // H.264 needs even dimensions; displayWidth/Height already apply rotation.
  const even = (n: number) => Math.round(n / 2) * 2;

  return {
    width: even(track.displayWidth),
    height: even(track.displayHeight),
    fps: Math.round(snapped),
    durationInSeconds: await input.computeDuration(),
  };
};
