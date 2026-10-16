'use client';
import { useEffect, type RefObject } from 'react';
import { motionAllowed } from '@/lib/motion/prefs';

/* Traza un dibujo como lo haría una mano al entrar en pantalla: cada trazo a
   velocidad constante, en el orden del marcado, y los rellenos al final. En
   reposo —sin JS o con menos movimiento pedido— el dibujo está completo. */
const SPEED = 260; // unidades del viewBox por segundo
const EASE = 'cubic-bezier(.65,0,.35,1)';

export function useDrawOn(ref: RefObject<SVGSVGElement | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    const strokes = [...el.querySelectorAll<SVGGeometryElement>('[data-k], [data-a]')];
    const fills = [...el.querySelectorAll<SVGElement>('[data-f]')];
    const lens = strokes.map((p) => (typeof p.getTotalLength === 'function' ? p.getTotalLength() : 0));
    strokes.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]} ${lens[i]}`; p.style.strokeDashoffset = String(lens[i]); });
    fills.forEach((f) => { f.style.opacity = '0'; });
    const anims: Animation[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      let t = 0;
      strokes.forEach((p, i) => {
        const dur = Math.max(140, (lens[i] / SPEED) * 1000);
        anims.push(p.animate([{ strokeDashoffset: lens[i] }, { strokeDashoffset: 0 }], { duration: dur, delay: t, easing: EASE, fill: 'forwards' }));
        // Muchos trazos: se solapan más para que el dibujo entero no pase de ~1,6 s.
        t += Math.min(dur * 0.45, 1600 / Math.max(strokes.length, 1));
      });
      fills.forEach((f, i) => anims.push(f.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: t + 100 + i * 30, easing: 'ease-out', fill: 'forwards' })));
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); anims.forEach((a) => a.cancel()); strokes.forEach((p) => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }); fills.forEach((f) => { f.style.opacity = ''; }); };
  }, [ref, enabled]);
}
