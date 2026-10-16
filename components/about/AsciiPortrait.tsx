'use client';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import s from './asciiportrait.module.css';

/* Retrato en «Electric Gaze»: la foto tramada con dither ordenado (Bayer 4×4)
   sobre fondo oscuro, con un brillo que la recorre en diagonal. Reimplementa
   en Canvas2D los parámetros activos del preset; el resto (post-efectos,
   luces, máscara, tinte) va apagado en él y no se dibuja.

   Cada celda de 9 px se parte en 3×3 subpíxeles de 3 px; cada subpíxel se
   enciende si su luminancia supera el umbral de Bayer y se pinta con el color
   medio de su celda, en un punto de 2 px con 1 px de aire: una pantalla LED.
   El cálculo va a un ImageData pequeño y se escala sin suavizado, así que un
   fotograma cuesta un par de milisegundos. Sin JS se ve la foto tal cual. */
const PRESET = { cellSize: 9, contrast: 158, brightness: 0, density: 20, animIntensity: 60, animSpeed: 100 } as const;
const SUB = 3;                         // subpíxeles por lado de celda
const PX = PRESET.cellSize / SUB;      // 3 px por subpíxel
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const FPS = 30;

type Grid = { g: number; lum: Float32Array; col: Uint8ClampedArray };

/* Muestrea la foto a un subpíxel por cada 3 px, con el contraste del preset,
   y guarda por subpíxel su luminancia y el color medio de su celda. */
function sample(img: HTMLImageElement, size: number): Grid | null {
  const g = Math.ceil(size / PX);
  const c = document.createElement('canvas');
  c.width = c.height = g;
  const x = c.getContext('2d', { willReadFrequently: true });
  if (!x) return null;
  x.drawImage(img, 0, 0, g, g);
  const d = x.getImageData(0, 0, g, g).data;
  /* Niveles automáticos antes del contraste: la foto es de clave baja y, sin
     estirarla entre sus percentiles 2 y 98, el contraste del preset hunde la
     cara en el negro. */
  const ls = new Float32Array(g * g);
  for (let i = 0; i < g * g; i++) ls[i] = 0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2];
  const sorted = Float32Array.from(ls).sort();
  const lo = sorted[Math.floor(sorted.length * 0.02)], hi = sorted[Math.floor(sorted.length * 0.98)];
  const span = Math.max(1, hi - lo);
  const k = PRESET.contrast / 100;
  const adj = (v: number) => ((v - lo) / span * 255 - 128) * k + 128 + PRESET.brightness;
  const lum = new Float32Array(g * g);
  const px = new Float32Array(g * g * 3);
  for (let i = 0; i < g * g; i++) {
    const r = adj(d[i * 4]), gg = adj(d[i * 4 + 1]), b = adj(d[i * 4 + 2]);
    px[i * 3] = r; px[i * 3 + 1] = gg; px[i * 3 + 2] = b;
    lum[i] = Math.min(1, Math.max(0, (0.2126 * r + 0.7152 * gg + 0.0722 * b) / 255));
  }
  const col = new Uint8ClampedArray(g * g * 3);
  for (let cy = 0; cy < g; cy += SUB) for (let cx = 0; cx < g; cx += SUB) {
    let r = 0, gg = 0, b = 0, n = 0;
    for (let y = cy; y < Math.min(g, cy + SUB); y++) for (let xx = cx; xx < Math.min(g, cx + SUB); xx++) {
      const i = y * g + xx; r += px[i * 3]; gg += px[i * 3 + 1]; b += px[i * 3 + 2]; n++;
    }
    for (let y = cy; y < Math.min(g, cy + SUB); y++) for (let xx = cx; xx < Math.min(g, cx + SUB); xx++) {
      const i = y * g + xx; col[i * 3] = r / n; col[i * 3 + 1] = gg / n; col[i * 3 + 2] = b / n;
    }
  }
  return { g, lum, col };
}

const hash = (x: number, y: number, t: number) => {
  const h = Math.sin(x * 127.1 + y * 311.7 + t * 74.7) * 43758.5453;
  return h - Math.floor(h);
};

/* Un fotograma: shimmer = banda diagonal que barre la cara + chispa por
   subpíxel que cambia doce veces por segundo. density 20 aclara la trama. */
function frame(grid: Grid, out: ImageData, t: number) {
  const { g, lum, col } = grid;
  const o = out.data;
  o.fill(0);
  const amp = PRESET.animIntensity / 100;
  const bias = (PRESET.density - 50) / 250;
  const speed = 0.12 * (PRESET.animSpeed / 100);
  const tick = Math.floor(t * 12);
  const W = g * PX;
  for (let y = 0; y < g; y++) for (let x = 0; x < g; x++) {
    const i = y * g + x;
    const phase = ((x + y) / (2 * g) - t * speed) % 1;
    const f = phase < 0 ? phase + 1 : phase;
    const band = Math.exp(-((f - 0.5) ** 2) / 0.006);
    const L = lum[i] + bias + amp * (0.32 * band + 0.14 * (hash(x, y, tick) - 0.5));
    if (L <= BAYER[(y & 3) * 4 + (x & 3)]) continue;
    const boost = 1 + 0.5 * amp * band;
    const r = col[i * 3] * boost, gg = col[i * 3 + 1] * boost, b = col[i * 3 + 2] * boost;
    for (let dy = 0; dy < PX - 1; dy++) {
      let p = ((y * PX + dy) * W + x * PX) * 4;
      for (let dx = 0; dx < PX - 1; dx++, p += 4) { o[p] = r; o[p + 1] = gg; o[p + 2] = b; o[p + 3] = 255; }
    }
  }
}

export default function AsciiPortrait({ locale = 'es' }: { locale?: Locale }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const t = locale === 'en'
    ? { alt: 'Portrait of Víctor Maza', role: 'Senior Product Designer', rows: [['Based in', 'Remote'], ['Field', 'B2B SaaS'], ['Practising', 'Since 2017']] }
    : { alt: 'Retrato de Víctor Maza', role: 'Senior Product Designer', rows: [['Base', 'En remoto'], ['Sector', 'B2B SaaS'], ['En activo', 'Desde 2017']] };

  useEffect(() => {
    const host = box.current, cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!host || !cv || !ctx) return;
    let grid: Grid | null = null, out: ImageData | null = null, buf: HTMLCanvasElement | null = null;
    let raf = 0, last = 0, visible = false, alive = true;
    const still = prefersReducedMotion();
    const img = new Image();
    img.src = '/assets/victor.jpg';

    const draw = (now: number) => {
      if (!grid || !out || !buf) return;
      frame(grid, out, still ? 0 : now / 1000);
      buf.getContext('2d')!.putImageData(out, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(buf, 0, 0, cv.width, cv.height);
    };
    const loop = (now: number) => {
      if (!alive) return;
      if (visible && now - last >= 1000 / FPS) { last = now; draw(now); }
      raf = requestAnimationFrame(loop);
    };
    const setup = () => {
      const size = host.clientWidth;
      if (!size || !img.complete || !img.naturalWidth) return;
      grid = sample(img, size);
      if (!grid) return;
      const W = grid.g * PX;
      out = new ImageData(W, W);
      buf = document.createElement('canvas');
      buf.width = buf.height = W;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = cv.height = Math.round(W * dpr);
      cv.style.width = cv.style.height = `${W}px`;
      draw(performance.now());
      setReady(true);
    };

    img.onload = setup;
    if (img.complete) setup();
    const ro = new ResizeObserver(setup);
    ro.observe(host);
    /* Solo anima mientras se ve; con movimiento reducido, un fotograma quieto. */
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(host);
    if (!still) raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <figure className={s.wrap}>
      <div ref={box} className={s.frame} data-ready={ready}>
        {/* eslint-disable-next-line @next/next/no-img-element -- respaldo sin JS: la foto tal cual */}
        <img src="/assets/victor.jpg" alt="" className={s.fallback} width={400} height={400} />
        <canvas ref={canvas} className={s.canvas} role="img" aria-label={t.alt} />
      </div>
      <figcaption className={s.cap}>
        <p className={s.name}>Víctor Maza</p>
        <p className={s.role}>{t.role}</p>
        <dl className={s.data}>{t.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </figcaption>
    </figure>
  );
}
