/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
// Instagram-friendly master: H.264, high quality, AAC audio.
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");

// Use a preinstalled Chromium when one is provided (e.g. in CI/cloud boxes).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
