import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Inter";

const weights = [
  ["500", "Inter-Medium.otf"],
  ["600", "Inter-SemiBold.otf"],
  ["700", "Inter-Bold.otf"],
  ["800", "Inter-ExtraBold.otf"],
] as const;

export const fontsLoaded = Promise.all(
  weights.map(([weight, file]) =>
    loadFont({
      family: FONT,
      url: staticFile(`fonts/${file}`),
      weight,
    }),
  ),
);

export const EMOJI_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
