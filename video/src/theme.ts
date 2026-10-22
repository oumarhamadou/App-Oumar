import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Palette relevée image par image sur la vidéo de référence.
export const colors = {
  maroon: "#3A0808",
  cream: "#F8F2E4",
  blush: "#F3DFD2",
  // Encadré « surligneur » posé sur le bordeaux.
  boxOnMaroon: "#E4D8CC",
  // Pastille arrondie posée sur le crème.
  pillOnCream: "#DFCDC5",
  // Textes
  creamText: "#F3E7D7",
  roseMuted: "#C49A91",
  inkMaroon: "#5E1414",
  ink: "#2A0A06",
  blushInk: "#4A0F0F",
  blushMuted: "#8A6058",
} as const;

export type Background = "maroon" | "cream" | "blush";

export const backgroundColor: Record<Background, string> = {
  maroon: colors.maroon,
  cream: colors.cream,
  blush: colors.blush,
};

// Polices embarquées (Google Fonts, licence OFL) : le rendu ne dépend pas du réseau.
// Amiri (naskh classique, gère les voyelles) et Aref Ruqaa (calligraphie roqaa),
// proches des calligraphies de la vidéo de référence.
const ARABIC =
  "U+0600-06FF, U+0750-077F, U+0870-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC";
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+FEFF, U+FFFD";

for (const family of ["Amiri", "Aref Ruqaa"]) {
  for (const weight of ["400", "700"]) {
    for (const [subset, unicodeRange] of [
      ["arabic", ARABIC],
      ["latin", LATIN],
    ]) {
      loadFont({
        family,
        url: staticFile(
          `fonts/${family.replace(" ", "")}-${weight}-${subset}.woff2`,
        ),
        weight,
        unicodeRange,
        display: "block",
      });
    }
  }
}

export const fonts = {
  naskh: "'Amiri', serif",
  ruqaa: "'Aref Ruqaa', serif",
};
