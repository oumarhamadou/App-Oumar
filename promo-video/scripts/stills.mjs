// Usage: node scripts/stills.mjs <compositionId> <outDir> <frame,frame,...> [scale]
import path from "node:path";
import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  renderStill,
  selectComposition,
} from "@remotion/renderer";

const [id, outDir, framesArg, scaleArg] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable });
const composition = await selectComposition({
  serveUrl,
  id,
  puppeteerInstance: browser,
  browserExecutable,
});
for (const f of framesArg.split(",").map(Number)) {
  const output = path.join(outDir, `${id}-${String(f).padStart(4, "0")}.jpg`);
  await renderStill({
    serveUrl,
    composition,
    frame: f,
    output,
    imageFormat: "jpeg",
    scale: Number(scaleArg ?? 0.5),
    puppeteerInstance: browser,
    browserExecutable,
  });
  console.log(output);
}
await browser.close({ silent: true });
