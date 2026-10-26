import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter Display for headlines, Inter for UI text: the closest open fonts to SF Pro.
export const DISPLAY = "Inter Display";
export const TEXT = "Inter";

const fonts: [string, string, string][] = [
  [DISPLAY, "InterDisplay-Regular.otf", "400"],
  [DISPLAY, "InterDisplay-Medium.otf", "500"],
  [DISPLAY, "InterDisplay-SemiBold.otf", "600"],
  [DISPLAY, "InterDisplay-Bold.otf", "700"],
  [DISPLAY, "InterDisplay-ExtraBold.otf", "800"],
  [TEXT, "Inter-Regular.otf", "400"],
  [TEXT, "Inter-Medium.otf", "500"],
  [TEXT, "Inter-SemiBold.otf", "600"],
];

for (const [family, file, weight] of fonts) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
}

// Apple-inspired palette: graphite neutrals + an "intelligence" glow gradient.
export const C = {
  black: "#000000",
  ink: "#1D1D1F",
  graphite: "#6E6E73",
  silver: "#A1A1A6",
  mist: "#F5F5F7",
  white: "#FFFFFF",
  blue: "#2E7BFF",
  violet: "#A259FF",
  pink: "#FF4D9A",
  orange: "#FF9A3C",
  green: "#30D158",
};

export const GLOW = `linear-gradient(90deg, ${C.blue} 0%, ${C.violet} 34%, ${C.pink} 66%, ${C.orange} 100%)`;

// Apple's signature "ease out expo"-like curve.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
