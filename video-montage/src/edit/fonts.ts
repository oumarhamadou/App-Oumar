import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled locally (public/fonts) so renders work offline.
// Inter Tight: tight grotesk for the stacked captions (close to the reference's Helvetica-style bold).
// Instrument Serif Italic: condensed italic serif for the gold accent words.
export const SANS = "Inter Tight";
export const SERIF = "Instrument Serif";

loadFont({
  family: SANS,
  url: staticFile("fonts/InterTight-latin.woff2"),
  weight: "100 900",
  format: "woff2",
});

loadFont({
  family: SERIF,
  url: staticFile("fonts/InstrumentSerif-Italic-latin.woff2"),
  style: "italic",
  weight: "400",
  format: "woff2",
});
