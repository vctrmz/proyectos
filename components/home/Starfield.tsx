'use client';
import { useEffect, useRef } from 'react';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import s from './Starfield.module.css';
/* 120 puntos que derivan despacio. Solo con puntero fino y sin reduced-motion. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !scrollEffectsAllowed()) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let raf = 0, w = 0, h = 0;
    const dpr = window.devicePixelRatio || 1;
    const pts = Array.from({ length: 120 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.2, v: 0.02 + Math.random() * 0.05 }));
    const size = () => { const r = c.getBoundingClientRect(); w = c.width = r.width * dpr; h = c.height = r.height * dpr; };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) { p.y -= p.v / 1000; if (p.y < 0) p.y = 1; ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r * dpr, 0, Math.PI * 2); ctx.fillStyle = 'rgba(139,222,95,0.55)'; ctx.fill(); }
      raf = requestAnimationFrame(draw);
    };
    size(); draw();
    const ro = new ResizeObserver(size); ro.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className={s.c} />;
}
