import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Amiri (SIL OFL) : naskh classique avec ligatures, le plus proche de la police
// de la référence. Fichiers locaux pour un rendu identique, même hors ligne.
export const fontFamily = "Amiri";

const ARABIC =
  "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC";
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

for (const [file, weight, unicodeRange] of [
  ["Amiri-Arabic-Regular.woff2", "400", ARABIC],
  ["Amiri-Arabic-Bold.woff2", "700", ARABIC],
  ["Amiri-Latin-Regular.woff2", "400", LATIN],
  ["Amiri-Latin-Bold.woff2", "700", LATIN],
]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/${file}`),
    weight,
    unicodeRange,
  });
}

// Palette relevée pixel par pixel sur la vidéo de référence.
export const COLORS = {
  maroon: "#450A0A", // fond de l'intro
  maroonBox: "#450506", // encadré bordeaux sur fond pêche
  maroonText: "#7A1A1A", // sous-titres bordeaux sur fond clair
  cream: "#F7F1E3", // fond des trois conditions
  peach: "#F4D8C3", // fond de la partie « droits d'autrui »
  sand: "#D5C4AF", // encadré sable sur fond bordeaux
  blush: "#F8DCD6", // texte clair sur fond bordeaux
  ink: "#1C110E", // texte principal sur fond clair
  black: "#000000",
} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
