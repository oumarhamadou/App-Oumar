import { useVideoConfig } from "remotion";

// Same scenes, two canvases: 1080x1920 (vertical) and 1920x1080 (horizontal).
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const wide = width > height;
  return { width, height, wide, cx: width / 2, cy: height / 2 };
};
