import { loadFont } from "@remotion/fonts";
import type { CSSProperties } from "react";
import { Easing, staticFile } from "remotion";

// Fonts ship with the project (public/fonts) so rendering works offline.
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const CYRILLIC = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";

// Type system borrowed from the "My Creation" reference:
// clean grotesk + condensed Didone accent + script accent.
export const sans = "Inter";
export const didone = "Oranienbaum";
export const script = "Great Vibes";

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
    family: didone,
    url: staticFile(`fonts/Oranienbaum-${subset}.woff2`),
    unicodeRange,
  });
  loadFont({
    family: script,
    url: staticFile(`fonts/GreatVibes-${subset}.woff2`),
    unicodeRange,
  });
}

export const colors = {
  ink: "#0B0B0C",
  gray: "#86868B",
  blue: "#0A84FF",
  green: "#34C759",
  greenDeep: "#1FAE48",
};

// Green gradient fill for the condensed serif accent ("Expensive" style).
export const greenInk: CSSProperties = {
  backgroundImage:
    "linear-gradient(180deg, #A8F0BC 0%, #34C759 46%, #12752F 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const expoInOut = Easing.bezier(0.87, 0, 0.13, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
