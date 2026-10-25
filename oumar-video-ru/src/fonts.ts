import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter covers Cyrillic and is the closest open match to SF Pro.
const faces: { family: string; file: string; weight: string }[] = [
  { family: "Inter", file: "Inter-Regular.otf", weight: "400" },
  { family: "Inter", file: "Inter-Medium.otf", weight: "500" },
  { family: "Inter", file: "Inter-SemiBold.otf", weight: "600" },
  { family: "Inter", file: "Inter-Bold.otf", weight: "700" },
  { family: "Inter Display", file: "InterDisplay-Medium.otf", weight: "500" },
  { family: "Inter Display", file: "InterDisplay-SemiBold.otf", weight: "600" },
  { family: "Inter Display", file: "InterDisplay-Bold.otf", weight: "700" },
];

for (const face of faces) {
  loadFont({
    family: face.family,
    url: staticFile(`fonts/${face.file}`),
    weight: face.weight,
  });
}
