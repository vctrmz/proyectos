'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import GlitchText from '@/components/ui/GlitchText';
import { useUi } from '@/lib/i18n/LocaleContext';
import s from './Manifesto.module.css';

/* Una sola frase en dos tramos: el primero en tinta, el segundo atenuado.
   El texto viene del diccionario de idioma. */

/* El texto completo va en el HTML. Con permiso de motion, las palabras
   arrancan atenuadas y se "escriben" al ritmo del scroll (scrub). */
export default function Manifesto() {
  const LINES = useUi().home.manifesto;
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !scrollEffectsAllowed()) return;
    const words = el.querySelectorAll(`.${s.w}`);
    const tween = gsap.fromTo(words, { opacity: 0.5 }, { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.4 } });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); };
  }, []);
  return (
    <section className={`container ${s.wrap}`} aria-label="Manifesto">
      <p ref={ref} className={s.text}>
        {LINES.map((line, li) => (
          <span key={li}>{line.split(' ').map((w, i) => <span key={i} className={s.w}><GlitchText text={w} trigger="hover" />&nbsp;</span>)}{li === 0 && <br />}</span>
        ))}
      </p>
    </section>
  );
}
