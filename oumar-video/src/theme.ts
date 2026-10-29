import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Fonts ship with the project (public/fonts) so rendering works offline.
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const CYRILLIC = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";

export const sans = "Inter";
export const serif = "Playfair Display";

for (const [subset, unicodeRange] of [
  ["latin", LATIN],
  ["cyrillic", CYRILLIC],
] as const) {
  loadFont({
    family: sans,
    url: staticFile(`fonts/Inter-${subset}.woff2`),
    weight: "100 900",
    unicodeRange,
  });
  loadFont({
    family: serif,
    url: staticFile(`fonts/Playfair-italic-${subset}.woff2`),
    weight: "400 900",
    style: "italic",
    unicodeRange,
  });
}

// Apple system palette
export const colors = {
  ink: "#1D1D1F",
  gray: "#86868B",
  hairline: "#D2D2D7",
  canvas: "#F5F5F7",
  blue: "#0A84FF",
  blueDeep: "#0071E3",
  green: "#34C759",
  greenDeep: "#1FAE48",
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const CARD = { width: 920, height: 1640 };
export const FULL = { width: 1080, height: 1920 };
