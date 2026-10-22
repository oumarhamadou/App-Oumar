import { useVideoConfig } from "remotion";

/**
 * Everything is designed on a 1080x1920 canvas and scaled by area, so the same
 * edit reads correctly on 9:16, 4:5, 1:1 or 16:9 footage without reframing it.
 */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const u = Math.sqrt((width * height) / (1080 * 1920));
  const vertical = height / width > 1.5;

  // Instagram Reels UI: top bar and bottom caption/CTA. Insets stay symmetric
  // so text is optically centred; the lower zone (beside the like/comment
  // rail) gets wider insets.
  const safe = vertical
    ? { top: height * 0.13, bottom: height * 0.22, left: width * 0.08, right: width * 0.08 }
    : { top: height * 0.08, bottom: height * 0.1, left: width * 0.06, right: width * 0.06 };
  const rail = vertical ? width * 0.14 : width * 0.08;

  return {
    width,
    height,
    u,
    vertical,
    safe,
    rail,
    safeWidth: width - safe.left - safe.right,
    railWidth: width - rail * 2,
    // Vertical anchors (px from the top) for stacking overlays without collisions.
    anchors: {
      upper: safe.top + (height - safe.top - safe.bottom) * 0.12,
      center: height * 0.44,
      captions: height - safe.bottom - 230 * u,
    },
  };
};
