import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

/* Auditoría automatizada: axe (WCAG 2.x A/AA) + métricas de estructura y
   rendimiento en tres rutas y tres viewports. Requiere el servidor arrancado
   (BASE, por defecto http://localhost:3000). Falla si axe encuentra violaciones. */
const BASE = process.env.BASE || 'http://localhost:3000';
const ROUTES = ['/', '/casos/ayax', '/casos/hermes', '/sobre-mi', '/es/cases/esta-web', '/en/about'];
const VIEWPORTS = [[1280, 800], [768, 1024], [375, 812]];
const browser = await chromium.launch();
const report = [];
let failed = false;
for (const route of ROUTES) for (const [w, h] of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await context.newPage();
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Rechazar' }).click({ timeout: 2000 }).catch(() => {});
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400)); });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  const m = await page.evaluate(() => {
    const small = [...document.querySelectorAll('a,button,[role=button],[role=radio],[role=tab]')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.height && r.height < 44; }).map((el) => (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) + ' ' + Math.round(el.getBoundingClientRect().height));
    const firstShot = document.querySelector('main img[src*="shots"]');
    return {
      landmarks: ['main', 'nav', 'header', 'footer'].map((t) => t + ':' + document.querySelectorAll(t).length).join(' '),
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      height: document.documentElement.scrollHeight,
      firstShotY: firstShot ? Math.round(firstShot.getBoundingClientRect().top + scrollY) : null,
      small,
      transferKB: Math.round(performance.getEntriesByType('resource').reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
    };
  });
  const lcp = await page.evaluate(() => new Promise((r) => { try { new PerformanceObserver((l) => { const e = l.getEntries(); r(e.length ? Math.round(e[e.length - 1].startTime) : null); }).observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => r(null), 800); } catch { r(null); } }));
  if (axe.violations.length) failed = true;
  report.push({ route, viewport: `${w}x${h}`, violations: axe.violations.map((v) => v.id + ' ×' + v.nodes.length + ' (' + v.nodes[0]?.target?.[0] + ')'), lcp, ...m });
  await context.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (failed) { console.error('axe violations'); process.exit(1); }
