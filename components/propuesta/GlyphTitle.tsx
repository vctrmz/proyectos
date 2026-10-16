'use client';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import GlitchText from '@/components/ui/GlitchText';
import { Icon, type IconName } from './icons';
import s from './GlyphTitle.module.css';

/* Títulos de sección con el glitch de siempre (GlitchText: una onda de
   caracteres que recorre el título una vez al entrar en pantalla) y, como en
   tigranz.com («w✦rk»), una sola letra convertida en icono. Un único color
   por título, el del subrayado: índigo sobre claro, verde sobre oscuro. El
   icono entra con un giro corto cuando la onda ha pasado y vuelve a girar al
   pasar el ratón.

   El lector de pantalla oye la palabra entera (aria-label); el icono y las
   capas del glitch son decorativos. */
export default function GlyphTitle({ text, icon, at, id, tone = 'light' }: { text: string; icon: IconName; at: number; id?: string; tone?: 'light' | 'dark' }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const before = text.slice(0, at), after = text.slice(at + 1);
  return (
    <h2 ref={ref} id={id} className={`${s.title} ${tone === 'dark' ? s.dark : ''}`} aria-label={text}>
      <span className={s.word} aria-hidden="true">
        {before && <GlitchText text={before} />}
        <motion.span className={s.icon} initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
          animate={seen ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.55 }}>
          <Icon name={icon} />
        </motion.span>
        {after && <GlitchText text={after} />}
        <motion.span className={s.line} initial={{ scaleX: 0 }} animate={seen ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
      </span>
    </h2>
  );
}
