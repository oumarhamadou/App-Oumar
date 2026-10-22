import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (OFL, from Fontsource) so renders are
// identical offline and on any machine. Latin + Latin Extended covers French.
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

// Sans for UI + captions, serif italic for the "premium" emphasis words.
const SANS = "Inter Variable";
const SERIF = "Instrument Serif";
export const sans = `"${SANS}", system-ui, sans-serif`;
export const serif = `"${SERIF}", Georgia, serif`;

for (const [file, range] of [
  ["inter-latin-wght-normal.woff2", LATIN],
  ["inter-latin-ext-wght-normal.woff2", LATIN_EXT],
] as const) {
  loadFont({ family: SANS, url: staticFile(`fonts/${file}`), weight: "100 900", unicodeRange: range });
}

for (const [file, range] of [
  ["instrument-serif-latin-400-italic.woff2", LATIN],
  ["instrument-serif-latin-ext-400-italic.woff2", LATIN_EXT],
] as const) {
  loadFont({ family: SERIF, url: staticFile(`fonts/${file}`), style: "italic", weight: "400", unicodeRange: range });
}

export const ink = "#07070C";
export const white = "#F7F7FB";

// Each palette is ordered as it sweeps across the frame.
export const palettes = {
  aurora: ["#3B2CF5", "#7C5CFF", "#C05CFF", "#FF6FB5", "#FFB38A"],
  ocean: ["#0B1F6B", "#2563EB", "#38BDF8", "#7DD3FC", "#67E8F9"],
  sunset: ["#6D28D9", "#DB2777", "#F43F5E", "#FB923C", "#FDE68A"],
  mint: ["#064E3B", "#0EA5A4", "#22D3EE", "#A7F3D0", "#99F6E4"],
  royal: ["#0F0B2E", "#312E81", "#6366F1", "#C4B5FD", "#FDE7B0"],
} as const;

export type PaletteName = keyof typeof palettes;

export const gradientOf = (name: PaletteName, angle = 120) =>
  `linear-gradient(${angle}deg, ${palettes[name].join(", ")})`;

// Text fill used on emphasis words: loops a palette so it can be animated
// by shifting background-position.
export const textGradientOf = (name: PaletteName) => {
  const p = palettes[name];
  return `linear-gradient(90deg, ${p[1]}, ${p[2]}, ${p[3]}, ${p[4]}, ${p[2]}, ${p[1]})`;
};

// After Effects-style easing presets.
export const ease = {
  // "Easy ease" with a strong exponential out: text and UI arrivals.
  out: [0.16, 1, 0.3, 1] as const,
  // Symmetric expo in-out: wipes and camera moves.
  inOut: [0.83, 0, 0.17, 1] as const,
  // Accelerating exit.
  in: [0.7, 0, 0.84, 0] as const,
};
