import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled locally in public/fonts (Google Fonts, OFL licence), so
// renders work offline and never depend on a CDN.

// Small caption words (reference: clean white grotesk)
export const SANS = "Inter";
// Heavy display words (difference text, punch words)
export const DISPLAY = "Inter Tight";
// Editorial serif (reference: gold serif key words)
export const SERIF = "Instrument Serif";

loadFont({ family: SANS, url: staticFile("fonts/Inter-latin-var.woff2"), weight: "100 900" });
loadFont({ family: DISPLAY, url: staticFile("fonts/InterTight-latin-var.woff2"), weight: "100 900" });
loadFont({ family: SERIF, url: staticFile("fonts/InstrumentSerif-Regular.woff2"), weight: "400", style: "normal" });
loadFont({ family: SERIF, url: staticFile("fonts/InstrumentSerif-Italic.woff2"), weight: "400", style: "italic" });
