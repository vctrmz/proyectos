'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { motionAllowed } from '@/lib/motion/prefs';
import type { StoryDrawId } from '@/lib/content/cases/types';
import { DRAWINGS } from './drawings';
import s from './storyboard.module.css';

/* Un fotograma dibujado. En reposo —sin JS o con menos movimiento pedido— el
   dibujo está completo. Con movimiento, al entrar en pantalla se traza como lo
   haría una mano: cada trazo a velocidad constante, en el orden del marcado,
   y los rellenos de acento entran al cerrar el contorno. Mientras el plano
   cruza la pantalla, la cámara hace un push-in suave ligado al scroll. */
const SPEED = 340;          // unidades del viewBox por segundo
const EASE = 'cubic-bezier(.65,0,.35,1)';

export default function DrawFrame({ id, alt }: { id: StoryDrawId; alt: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, (v) => 1 + v * 0.07);
  const Art = DRAWINGS[id];

  useEffect(() => {
    const el = svg.current;
    if (!el || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    const strokes = [...el.querySelectorAll<SVGGeometryElement>('[data-k], [data-a]')];
    const fills = [...el.querySelectorAll<SVGElement>('[data-f]')];
    const lens = strokes.map((p) => (typeof p.getTotalLength === 'function' ? p.getTotalLength() : 0));
    strokes.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]} ${lens[i]}`; p.style.strokeDashoffset = String(lens[i]); });
    fills.forEach((f) => { f.style.opacity = '0'; });
    const anims: Animation[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      /* Los trazos se solapan: cada uno arranca cuando el anterior va por la
         mitad. Así el dibujo entero dura poco más de un segundo. */
      let t = 0;
      strokes.forEach((p, i) => {
        const dur = Math.max(160, (lens[i] / SPEED) * 1000);
        anims.push(p.animate([{ strokeDashoffset: lens[i] }, { strokeDashoffset: 0 }], { duration: dur, delay: t, easing: EASE, fill: 'forwards' }));
        t += Math.min(dur * 0.5, 70);
      });
      fills.forEach((f, i) => anims.push(f.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: t + 120 + i * 40, easing: 'ease-out', fill: 'forwards' })));
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); anims.forEach((a) => a.cancel()); strokes.forEach((p) => { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; }); fills.forEach((f) => { f.style.opacity = ''; }); };
  }, []);

  return (
    <div ref={box} className={s.drawBox}>
      <svg ref={svg} viewBox="0 0 320 180" className={s.draw} role="img" aria-label={alt}>
        <motion.g className={s.cam} style={{ scale }}>
          <Art />
        </motion.g>
      </svg>
    </div>
  );
}
