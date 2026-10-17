import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

/* Graba una figura de Hairline del laboratorio en MP4 para LinkedIn: 1080 × 1350
   (4:5), 30 fps, una vuelta del recorrido automático que empieza y acaba en
   reposo, así que el vídeo hace bucle sin corte. El reloj de la página es falso
   y avanza fotograma a fotograma, de modo que el vídeo no depende de lo rápida
   que sea la máquina.

     node scripts/hairline-record.mjs [--figure tokens] [--seconds 9.3] [--out out/hairline-tokens.mp4]

   Necesita ffmpeg. Si el Chromium de Playwright no es el de esta versión, pasa
   su ruta con --chromium. Los colores son los tokens de la web (og.mjs hace lo
   mismo), y el fondo es el del laboratorio. */
const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((a) => a.trim().split(/\s+/)));
const figure = args.figure ?? 'tokens';
const seconds = Number(args.seconds ?? 9.3); // una vuelta: 1,2 s de espera, 3 paradas de 2,1 s y 1,8 s de reposo
const out = args.out ?? `out/hairline-${figure}.mp4`;
const FPS = 30, W = 1080, H = 1350;

const COPY = {
  tokens: {
    kicker: 'Design system · caso',
    title: ['267 valores de color,', '24 tokens con rol.'],
    foot: 'Diagrama ilustrativo · victormaza.vercel.app/es/cases/design-system',
  },
};
const copy = COPY[figure];
if (!copy) throw new Error(`No hay texto para la figura «${figure}» en COPY.`);

const dir = 'components/lab/hairline';
const kernel = (await readFile(`${dir}/kernel.js`, 'utf8')).replace(/\n\/\*[^\n]*\*\/\nexport default HL;\n?$/, '\n');
const source = await readFile(`${dir}/${figure}.js`, 'utf8');

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono&display=swap" rel="stylesheet">
<style>
  body { margin: 0; width: ${W}px; height: ${H}px; box-sizing: border-box; padding: 88px 72px 72px; display: flex; flex-direction: column; gap: 48px;
    background: #0b0c10; color: #ececec; font-family: Geist, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  .k { font-size: 22px; letter-spacing: .14em; text-transform: uppercase; color: #8bde5f; }
  h1 { margin: 20px 0 0; font-size: 76px; font-weight: 600; letter-spacing: -0.035em; line-height: 1.02; color: #fff; }
  h1 span { color: #b4b8c4; }
  .plate { position: relative; flex: 1; border: 1px solid rgba(255,255,255,.1); border-radius: 36px; overflow: hidden; display: grid; place-items: center;
    --hairline-plate: #0b0c10; --hairline-hi: #8bde5f; --hairline-edge: #b4b8c4;
    --hairline-mid: color-mix(in srgb, #ececec 34%, #0b0c10); --hairline-lo: color-mix(in srgb, #ececec 16%, #0b0c10); --hairline-stroke: 2.2; }
  #stage { width: 100%; }
  #read { position: absolute; top: 32px; right: 36px; font: 26px/1 'Geist Mono', ui-monospace, monospace; color: #b4b8c4; }
  .f { font-size: 22px; color: #b4b8c4; }
</style></head><body>
  <header><div class="k">${copy.kicker}</div><h1>${copy.title[0]}<br><span>${copy.title[1]}</span></h1></header>
  <div class="plate"><span id="read">rest</span><div id="stage"></div></div>
  <div class="f">${copy.foot}</div>
<script>${kernel}
window.hairline = (spec) => {
  const stage = document.getElementById('stage'), out = document.getElementById('read');
  HL.inject(document);
  stage.setAttribute('data-hairline', spec.name);
  const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
  const read = { set textContent(v) { out.textContent = v; }, get textContent() { return out.textContent; } };
  spec.mount({ stage, svg, read }, spec.range[1]);
  HL.tour(stage, spec.tour || HL.LAP);
};
</script>
<script type="module">${source}</script>
</body></html>`;

await mkdir(dirname(out), { recursive: true });
const browser = await chromium.launch(args.chromium ? { executablePath: args.chromium } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
/* Reloj parado desde antes de cargar: si corre mientras carga la página, el
   recorrido ya ha empezado en el primer fotograma y la vuelta no cierra. */
await page.clock.install({ time: 0 });
await page.clock.pauseAt(1000);
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300); // el IntersectionObserver del motor va con el reloj real

const ffmpeg = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((ok, ko) => ffmpeg.on('close', (code) => (code ? ko(new Error(`ffmpeg salió con ${code}`)) : ok())));

const frames = Math.round(seconds * FPS);
for (let i = 0; i < frames; i++) {
  /* El reloj avanza en milisegundos enteros: 33 y 34 alternos, para que 30
     fotogramas sean un segundo justo y la vuelta cierre en su fotograma. */
  if (i) await page.clock.runFor(Math.round((i * 1000) / FPS) - Math.round(((i - 1) * 1000) / FPS));
  if (!ffmpeg.stdin.write(await page.screenshot({ type: 'png' }))) await new Promise((r) => ffmpeg.stdin.once('drain', r));
}
ffmpeg.stdin.end();
await done;
await browser.close();
console.log(`${out}: ${frames} fotogramas, ${W}×${H}, ${FPS} fps`);
