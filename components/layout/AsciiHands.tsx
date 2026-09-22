'use client';
import { useEffect, useRef } from 'react';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import s from './AsciiHands.module.css';

/* Dos manos dibujadas como retícula ASCII sobre canvas. No hay imagen: la
   silueta se compone con primitivas (palma + dedos) en un Path2D, se muestrea
   en celdas y cada celda pinta un glifo. Los glifos se encienden en racimo
   alrededor del cursor y derivan con una parálaje suave. Decorativo. */

const RAMP = ' .:-=+*#%@';
const CELL = 11;

function handPath(w: number, h: number, flip: boolean): Path2D {
  const p = new Path2D();
  const sx = flip ? -1 : 1;
  const ox = flip ? w : 0;
  const X = (v: number) => ox + sx * v * w;
  const Y = (v: number) => v * h;
  const finger = (cx: number, top: number, bottom: number, r: number) => {
    const x = X(cx), y1 = Y(top), y2 = Y(bottom), rr = r * w;
    p.moveTo(x - rr, y2);
    p.lineTo(x - rr, y1 + rr);
    p.arc(x, y1 + rr, rr, Math.PI, 0);
    p.lineTo(x + rr, y2);
    p.closePath();
  };
  // palma
  p.moveTo(X(0.18), Y(0.62));
  p.bezierCurveTo(X(0.12), Y(0.82), X(0.3), Y(1.0), X(0.6), Y(0.98));
  p.bezierCurveTo(X(0.86), Y(0.96), X(0.9), Y(0.78), X(0.86), Y(0.6));
  p.closePath();
  // dedos
  finger(0.3, 0.3, 0.68, 0.075);
  finger(0.47, 0.18, 0.68, 0.08);
  finger(0.64, 0.24, 0.68, 0.078);
  finger(0.79, 0.36, 0.68, 0.07);
  // pulgar
  p.moveTo(X(0.2), Y(0.7));
  p.bezierCurveTo(X(0.04), Y(0.66), X(0.0), Y(0.82), X(0.12), Y(0.9));
  p.bezierCurveTo(X(0.2), Y(0.95), X(0.26), Y(0.86), X(0.26), Y(0.78));
  p.closePath();
  return p;
}

export default function AsciiHands() {
  const left = useRef<HTMLCanvasElement>(null);
  const right = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!scrollEffectsAllowed() || typeof Path2D === 'undefined') return;
    const canvases = [left.current, right.current].filter(Boolean) as HTMLCanvasElement[];
    if (!canvases.length) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const state = canvases.map((c, i) => ({ c, ctx: c.getContext('2d'), cells: [] as { x: number; y: number; v: number }[], flip: i === 1, w: 0, h: 0 })).filter((st): st is typeof st & { ctx: CanvasRenderingContext2D } => !!st.ctx);
    if (!state.length) return;
    const pointer = { x: -9999, y: -9999 };
    let raf = 0, t0 = performance.now();

    const build = () => {
      for (const st of state) {
        const r = st.c.getBoundingClientRect();
        st.w = st.c.width = Math.max(1, Math.round(r.width * dpr));
        st.h = st.c.height = Math.max(1, Math.round(r.height * dpr));
        const path = handPath(st.w, st.h, st.flip);
        st.cells = [];
        const step = CELL * dpr;
        for (let y = step; y < st.h; y += step) {
          for (let x = step / 2; x < st.w; x += step) {
            if (st.ctx.isPointInPath(path, x, y)) st.cells.push({ x, y, v: Math.random() });
          }
        }
      }
    };

    const draw = (t: number) => {
      const el = (t - t0) / 1000;
      for (const st of state) {
        const { ctx } = st;
        ctx.clearRect(0, 0, st.w, st.h);
        ctx.font = `${Math.round(CELL * dpr)}px ui-monospace, Menlo, Consolas, monospace`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        const box = st.c.getBoundingClientRect();
        const px = (pointer.x - box.left) * dpr, py = (pointer.y - box.top) * dpr;
        const drift = Math.sin(el * 0.35 + (st.flip ? 1.6 : 0)) * 6 * dpr;
        for (const cell of st.cells) {
          const d = Math.hypot(cell.x - px, cell.y - py);
          const near = Math.max(0, 1 - d / (150 * dpr));
          const base = 0.22 + 0.18 * Math.sin(el * 0.8 + cell.v * 9);
          const lvl = Math.min(1, base + near * 1.1);
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(lvl * RAMP.length))];
          if (ch === ' ') continue;
          ctx.fillStyle = near > 0.55 ? `rgba(139,222,95,${0.5 + near * 0.5})` : near > 0.25 ? `rgba(122,132,214,${0.35 + near * 0.4})` : `rgba(236,236,236,${0.1 + lvl * 0.22})`;
          ctx.fillText(ch, cell.x, cell.y + drift);
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; };
    const ro = new ResizeObserver(build);
    canvases.forEach((c) => ro.observe(c));
    build();
    raf = requestAnimationFrame(draw);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('pointermove', onMove); };
  }, []);

  return (
    <div className={s.hands} aria-hidden="true">
      <canvas ref={left} className={s.left} aria-hidden="true" />
      <canvas ref={right} className={s.right} aria-hidden="true" />
    </div>
  );
}
