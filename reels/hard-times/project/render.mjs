// Renders comp.html frame-by-frame with headless Chromium.
// usage: node render.mjs <outDir> [workers] [frame,frame,...|start-end]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const [outDir = 'out/frames', workersArg = '4', sel] = process.argv.slice(2);
const NF = 1047;
let frames = [...Array(NF).keys()];
if (sel) {
  frames = sel.includes('-') && !sel.includes(',')
    ? (([a, b]) => [...Array(b - a + 1).keys()].map((i) => i + a))(sel.split('-').map(Number))
    : sel.split(',').map(Number);
}
mkdirSync(outDir, { recursive: true });
const W = Math.min(Number(workersArg), frames.length);
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--no-proxy-server', '--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none', '--hide-scrollbars'],
});
const chunks = [...Array(W)].map((_, w) => frames.slice(Math.floor((w * frames.length) / W), Math.floor(((w + 1) * frames.length) / W)));
const t0 = Date.now();
let done = 0;
await Promise.all(chunks.map(async (list) => {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('console', m.text()); });
  await page.goto('http://127.0.0.1:8765/comp.html');
  await page.evaluate(() => window.READY);
  for (const f of list) {
    await page.evaluate((f) => window.renderFrame(f), f);
    await page.screenshot({ path: `${outDir}/${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 95 });
    done++;
    if (done % 50 === 0) console.log(`${done}/${frames.length} frames, ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
  await page.close();
}));
await browser.close();
console.log(`rendered ${frames.length} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
