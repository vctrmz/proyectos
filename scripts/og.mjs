import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

/* La imagen que enseñan LinkedIn, Slack o WhatsApp al compartir la web. Se
   genera desde HTML con los tokens del sitio, así que cambiar el rol es
   cambiar una línea y volver a ejecutar: node scripts/og.mjs */
const photo = (await readFile('public/assets/victor.jpg')).toString('base64');
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body { margin: 0; width: 1200px; height: 630px; display: flex; align-items: center; justify-content: space-between; padding: 0 88px; box-sizing: border-box; background: #1b1e27; color: #ececec; font-family: Geist, system-ui, sans-serif; }
  .k { display: inline-block; padding: 8px 14px; border: 1px solid rgba(139,222,95,.45); border-radius: 999px; color: #8bde5f; font-size: 20px; letter-spacing: .04em; }
  h1 { margin: 28px 0 16px; font-size: 76px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
  p { margin: 0; font-size: 32px; color: #b4b8c4; line-height: 1.3; max-width: 640px; }
  img { width: 300px; height: 300px; border-radius: 50%; object-fit: cover; border: 4px solid #4a44f2; }
</style></head><body>
  <div><span class="k">Product Designer · Design Systems</span><h1>Víctor Maza</h1><p>Diseño producto B2B complejo<br>y lo llevo a producción.</p></div>
  <img src="data:image/jpeg;base64,${photo}" alt="">
</body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/assets/og.png' });
await browser.close();
