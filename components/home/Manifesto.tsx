'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import s from './Manifesto.module.css';

const LINES = ['Diseño producto B2B donde un error operativo cuesta dinero.', 'Diseñé reglas en lugar de casos.'];

/* El texto completo va en el HTML. Con permiso de motion, las palabras
   arrancan atenuadas y se "escriben" al ritmo del scroll (scrub). */
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !scrollEffectsAllowed()) return;
    const words = el.querySelectorAll(`.${s.w}`);
    const tween = gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.4 } });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); };
  }, []);
  return (
    <section className={`container ${s.wrap}`} aria-label="Manifiesto">
      <p ref={ref} className={s.text}>
        {LINES.map((line, li) => (
          <span key={li}>{line.split(' ').map((w, i) => <span key={i} className={s.w}>{w}&nbsp;</span>)}{li === 0 && <br />}</span>
        ))}
      </p>
    </section>
  );
}
