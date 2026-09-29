import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

/* Capturas de esta web para su propio caso. Se hacen sobre el build local
   (npm run build && npm start) con reduced-motion y sin banner de consentimiento,
   y van a la misma carpeta de fuentes que el resto de casos. */
const BASE = process.env.BASE ?? 'http://localhost:3000';
const OUT = '../portfolio-export/web/img';
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await page.addInitScript(() => localStorage.setItem('vm-consent', 'denied'));
for (const [name, path] of [['home', '/es'], ['case', '/es/cases/hermes']]) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/${name}.png` });
}
await browser.close();
