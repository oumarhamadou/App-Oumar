// Renders review stills of a composition at given seconds, bundling only once.
// Usage: node scripts/stills.mjs <CompositionId> <outDir> <sec> [sec...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [id, outDir, ...secs] = process.argv.slice(2);
if (!id || !outDir || secs.length === 0) {
  console.error("Usage: node scripts/stills.mjs <CompositionId> <outDir> <sec> [sec...]");
  process.exit(1);
}

const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  publicDir: path.resolve("public"),
});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const composition = await selectComposition({ serveUrl, id, browserExecutable });

for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  const output = path.join(outDir, `${id}-${String(s).replace(".", "_")}s.png`);
  await renderStill({ serveUrl, composition, frame, output, scale: 0.4, browserExecutable });
  console.log("wrote", output);
}
