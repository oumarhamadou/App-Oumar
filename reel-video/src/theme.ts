import { Easing, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// Inter (variable, bundled in public/fonts) is the closest free match to
// Apple's SF Pro and covers Cyrillic. Bundling it locally keeps renders offline-safe.
export const fontFamily = "Inter";

const SUBSETS = [
  {
    file: "Inter-latin.woff2",
    range:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  },
  {
    file: "Inter-latin-ext.woff2",
    range:
      "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
  },
  {
    file: "Inter-cyrillic.woff2",
    range: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
  },
];

for (const s of SUBSETS) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/${s.file}`),
    weight: "100 900",
    unicodeRange: s.range,
    display: "block",
  });
}

// Apple-like palette: deep navy (grid), blurred green (grid), white.
export const COLORS = {
  ink: "#01040C",
  navy: "#030B22",
  navyMid: "#071A45",
  blueGlow: "#0B3F9E",
  blue: "#0A84FF",
  green: "#30D158",
  greenDeep: "#0E6B2C",
  white: "#F5F5F7",
  muted: "rgba(245,245,247,0.58)",
  faint: "rgba(245,245,247,0.16)",
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Every cut is laid on a 120 BPM grid (1 beat = 15 frames)
// so a 120 BPM music track can be dropped on top and stay in sync.
export const BEAT = 15;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
