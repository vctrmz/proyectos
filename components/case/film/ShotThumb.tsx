'use client';
import { useEffect, useRef } from 'react';
import type { FilmShot } from '@/lib/content/film';
import { renderShot } from './engine';
import f from './film.module.css';

/* La miniatura de un plano: se mueve en bucle solo mientras está a la vista, y
   queda quieta en su último fotograma si se pide menos movimiento. */
export default function ShotThumb({ shot, brand, from, label }: { shot: FilmShot; brand: string; from: string; label: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = stage.current!;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let clean = renderShot(st, shot, true);
    if (still) return () => clean();
    let timer = 0;
    const loop = () => { clean(); clean = renderShot(st, shot); timer = window.setTimeout(loop, shot.dur * 1000 + 600); };
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(timer);
      if (e.isIntersecting) loop();
      else { clean(); clean = renderShot(st, shot, true); }
    }, { threshold: 0.35 });
    io.observe(st);
    return () => { io.disconnect(); clearTimeout(timer); clean(); };
  }, [shot]);

  return (
    <div className={f.thumb}>
      <div ref={stage} className={f.stage} style={{ ['--brand' as string]: brand }} role="img" aria-label={label} />
      <button type="button" className={f.from} onClick={() => window.dispatchEvent(new CustomEvent('casefilm:play', { detail: shot.i }))}>▶ {from}</button>
    </div>
  );
}
