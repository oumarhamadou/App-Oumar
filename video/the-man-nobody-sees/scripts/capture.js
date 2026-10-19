// Usage: node capture.js <htmlPath> <outDir> <fps> <frameStart> <frameEnd(excl)>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [html, out, fps, a, b] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(html) + (process.env.ALT ? '?alt=1' : ''));
  await page.evaluate(() => document.fonts.ready);
  for (let f = +a; f < +b; f++) {
    const t = f / +fps;
    await page.evaluate(t => window.renderAt(t), t);
    await page.screenshot({ path: `${out}/f_${String(f).padStart(5, '0')}.png`, omitBackground: true });
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
