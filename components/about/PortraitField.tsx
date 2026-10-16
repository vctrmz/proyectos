'use client';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion/prefs';

/* El hero de Sobre mí como un campo tramado «Electric Gaze»: la foto entra
   por la derecha y se funde con el fondo, y todo el hero es la misma trama
   de puntos. Al mover el ratón se deja una estela de luz en el lila de la
   web para fondos oscuros (--focus-on-night) que enciende los puntos por
   donde pasa y se apaga en un segundo.

   Cómo se dibuja (Canvas2D):
   - La foto se compone en un lienzo del tamaño del hero, a un píxel por
     subpíxel de 3 px: fondo del color de la foto, foto a la derecha a todo
     el alto y un degradado que la funde por la izquierda.
   - Niveles automáticos (percentiles 2–98 de la foto) y contraste 158.
   - Dither ordenado Bayer 4×4 por subpíxel, con el color medio de su celda
     de 9 px, más el shimmer: una banda diagonal y chispas.
   - El fotograma se calcula a la resolución de la trama y se escala sin
     suavizado; una máscara de rejilla deja 1 px de aire entre puntos.
   - La estela es un mapa de calor a la resolución de la trama que decae en
     cada fotograma, más un trazo con halo encima.
   Solo anima mientras se ve. Con movimiento reducido, sin shimmer; la estela,
   que la provoca quien mueve el ratón, se queda. */
const P = { contrast: 158, density: 20, animIntensity: 60, animSpeed: 100 } as const;
const CELL = 9, SUB = 3, PX = CELL / SUB;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const TRAIL: [number, number, number] = [157, 153, 255]; // --focus-on-night
const FPS = 30;

type Field = { gw: number; gh: number; lum: Float32Array; col: Uint8ClampedArray; noise: Float32Array };

function compose(img: HTMLImageElement, gw: number, gh: number, mobile: boolean): Field | null {
  const c = document.createElement('canvas');
  c.width = gw; c.height = gh;
  const x = c.getContext('2d', { willReadFrequently: true });
  if (!x) return null;

  /* Niveles a partir de la foto sola: el fondo añadido no debe moverlos. */
  const probe = document.createElement('canvas');
  probe.width = probe.height = 64;
  const px = probe.getContext('2d', { willReadFrequently: true })!;
  px.drawImage(img, 0, 0, 64, 64);
  const pd = px.getImageData(0, 0, 64, 64).data;
  const ls: number[] = [];
  let br = 0, bg = 0, bb = 0, bn = 0;
  for (let i = 0; i < 64 * 64; i++) {
    ls.push(0.2126 * pd[i * 4] + 0.7152 * pd[i * 4 + 1] + 0.0722 * pd[i * 4 + 2]);
    if (i % 64 < 6 && i < 64 * 20) { br += pd[i * 4]; bg += pd[i * 4 + 1]; bb += pd[i * 4 + 2]; bn++; }
  }
  ls.sort((a, b) => a - b);
  const lo = ls[Math.floor(ls.length * 0.02)], hi = ls[Math.floor(ls.length * 0.98)];
  const base = `rgb(${br / bn | 0},${bg / bn | 0},${bb / bn | 0})`;

  /* Foto a la derecha, a todo el alto (un poco más en escritorio para que la
     cara mande), y fundida hacia la izquierda con el color de su fondo. */
  x.fillStyle = base;
  x.fillRect(0, 0, gw, gh);
  const size = Math.round(gh * (mobile ? 1 : 1.08));
  const left = gw - size + Math.round(size * (mobile ? 0.04 : 0.08));
  const top = gh - size;
  x.drawImage(img, left, top, size, size);
  const fade = x.createLinearGradient(left, 0, left + size * 0.42, 0);
  fade.addColorStop(0, base);
  fade.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = fade;
  x.fillRect(left - 1, 0, size * 0.42 + 1, gh);

  const d = x.getImageData(0, 0, gw, gh).data;
  const k = P.contrast / 100, span = Math.max(1, hi - lo);
  const adj = (v: number) => ((v - lo) / span * 255 - 128) * k + 128;
  const n = gw * gh;
  const lum = new Float32Array(n), raw = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = adj(d[i * 4]), g = adj(d[i * 4 + 1]), b = adj(d[i * 4 + 2]);
    raw[i * 3] = r; raw[i * 3 + 1] = g; raw[i * 3 + 2] = b;
    lum[i] = Math.min(1, Math.max(0, (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255)) ** 1.25; // un punto más de penumbra
  }
  const col = new Uint8ClampedArray(n * 3);
  for (let cy = 0; cy < gh; cy += SUB) for (let cx = 0; cx < gw; cx += SUB) {
    let r = 0, g = 0, b = 0, m = 0;
    const ye = Math.min(gh, cy + SUB), xe = Math.min(gw, cx + SUB);
    for (let y = cy; y < ye; y++) for (let xx = cx; xx < xe; xx++) { const i = y * gw + xx; r += raw[i * 3]; g += raw[i * 3 + 1]; b += raw[i * 3 + 2]; m++; }
    for (let y = cy; y < ye; y++) for (let xx = cx; xx < xe; xx++) { const i = y * gw + xx; col[i * 3] = r / m; col[i * 3 + 1] = g / m; col[i * 3 + 2] = b / m; }
  }
  const noise = new Float32Array(n);
  for (let i = 0; i < n; i++) noise[i] = Math.random();
  return { gw, gh, lum, col, noise };
}

export default function PortraitField({ label, className }: { label: string; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const box = host.current, cv = canvas.current;
    const ctx = cv?.getContext('2d');
    if (!box || !cv || !ctx) return;
    const area = box.parentElement ?? box;
    let f: Field | null = null, out: ImageData | null = null, buf: HTMLCanvasElement | null = null;
    let heat = new Float32Array(0), gaps: CanvasPattern | null = null;
    let raf = 0, last = 0, visible = true, alive = true, dpr = 1;
    const still = prefersReducedMotion();
    const pts: { x: number; y: number; t: number }[] = [];
    let prev: { x: number; y: number } | null = null;
    const img = new Image();
    img.src = '/assets/victor.jpg';

    const draw = (now: number) => {
      if (!f || !out || !buf) return;
      const { gw, gh, lum, col, noise } = f;
      const o = out.data;
      const t = still ? 0 : now / 1000;
      const amp = still ? 0 : P.animIntensity / 100;
      const bias = (P.density - 50) / 250;
      /* La banda depende solo de x+y: se calcula una vez por diagonal. */
      const diag = new Float32Array(gw + gh);
      const speed = 0.12 * (P.animSpeed / 100);
      for (let s = 0; s < diag.length; s++) {
        let ph = (s / (gw + gh) - t * speed) % 1; if (ph < 0) ph += 1;
        diag[s] = Math.exp(-((ph - 0.5) ** 2) / 0.006);
      }
      const tick = Math.floor(t * 12) * 7919;
      const n = gw * gh;
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
        const i = y * gw + x, p = i * 4;
        const band = diag[x + y], h = heat[i];
        const L = lum[i] + bias + amp * (0.32 * band + 0.14 * (noise[(i + tick) % n] - 0.5)) + h * 0.9;
        if (L <= BAYER[(y & 3) * 4 + (x & 3)]) { o[p + 3] = 0; continue; }
        const boost = 1 + 0.5 * amp * band, m = Math.min(1, h * 1.6);
        o[p] = col[i * 3] * boost * (1 - m) + TRAIL[0] * m;
        o[p + 1] = col[i * 3 + 1] * boost * (1 - m) + TRAIL[1] * m;
        o[p + 2] = col[i * 3 + 2] * boost * (1 - m) + TRAIL[2] * m;
        o[p + 3] = 255;
      }
      for (let i = 0; i < n; i++) heat[i] *= 0.92;
      buf.getContext('2d')!.putImageData(out, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(buf, 0, 0, gw * PX * dpr, gh * PX * dpr);
      if (gaps) { ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = gaps; ctx.fillRect(0, 0, cv.width, cv.height); }
      /* El halo de la estela, encima de la trama. */
      while (pts.length && now - pts[0].t > 700) pts.shift();
      if (pts.length > 1) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.shadowColor = `rgb(${TRAIL.join(',')})`; ctx.shadowBlur = 22 * dpr;
        for (let i = 1; i < pts.length; i++) {
          const a = 1 - (now - pts[i].t) / 700;
          ctx.strokeStyle = `rgba(${TRAIL.join(',')},${(a * 0.85).toFixed(3)})`;
          ctx.lineWidth = 3 * dpr * a + 0.5;
          ctx.beginPath(); ctx.moveTo(pts[i - 1].x * dpr, pts[i - 1].y * dpr); ctx.lineTo(pts[i].x * dpr, pts[i].y * dpr); ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }
    };

    const loop = (now: number) => {
      if (!alive) return;
      if (visible && now - last >= 1000 / FPS) { last = now; draw(now); }
      raf = requestAnimationFrame(loop);
    };

    const setup = () => {
      const W = box.clientWidth, H = box.clientHeight;
      if (!W || !H || !img.complete || !img.naturalWidth) return;
      const gw = Math.ceil(W / PX), gh = Math.ceil(H / PX);
      f = compose(img, gw, gh, W < 768);
      if (!f) return;
      out = new ImageData(gw, gh);
      heat = new Float32Array(gw * gh);
      buf = document.createElement('canvas');
      buf.width = gw; buf.height = gh;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      /* Rejilla de huecos: la última fila y columna de cada subpíxel. */
      const g = document.createElement('canvas');
      g.width = g.height = Math.round(PX * dpr);
      const gx = g.getContext('2d')!;
      gx.fillStyle = '#000';
      gx.fillRect(g.width - Math.max(1, Math.round(dpr)), 0, Math.max(1, Math.round(dpr)), g.height);
      gx.fillRect(0, g.height - Math.max(1, Math.round(dpr)), g.width, Math.max(1, Math.round(dpr)));
      gaps = ctx.createPattern(g, 'repeat');
      draw(performance.now());
      setReady(true);
    };

    /* La estela: se estampa calor a lo largo del segmento recorrido. */
    const move = (e: PointerEvent) => {
      if (!f) return;
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { prev = null; return; }
      pts.push({ x, y, t: performance.now() });
      const from = prev ?? { x, y };
      const dist = Math.hypot(x - from.x, y - from.y);
      const steps = Math.max(1, Math.ceil(dist / PX));
      const R = 3;
      for (let s = 0; s <= steps; s++) {
        const cx = (from.x + (x - from.x) * (s / steps)) / PX, cy = (from.y + (y - from.y) * (s / steps)) / PX;
        for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
          const gx = Math.round(cx) + dx, gy = Math.round(cy) + dy;
          if (gx < 0 || gy < 0 || gx >= f.gw || gy >= f.gh) continue;
          const i = gy * f.gw + gx;
          heat[i] = Math.min(1, heat[i] + Math.exp(-(dx * dx + dy * dy) / 3) * 0.75);
        }
      }
      prev = { x, y };
    };
    const leave = () => { prev = null; };

    img.onload = setup;
    if (img.complete) setup();
    const ro = new ResizeObserver(setup);
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(box);
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      area.removeEventListener('pointermove', move); area.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={host} className={className} data-ready={ready}>
      <canvas ref={canvas} role="img" aria-label={label} />
    </div>
  );
}
