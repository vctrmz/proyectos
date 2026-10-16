'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { motionAllowed } from '@/lib/motion/prefs';
import s from './GlyphTitle.module.css';

/* Títulos de sección con glifos, adaptados de tigranz.com: al entrar en
   pantalla (y al pasar el ratón) algunas letras se cambian un instante por
   una forma de la paleta, y un subrayado de color se dibuja debajo. Las
   formas son las del sistema: el verde de Contactar, el índigo del foco y la
   lila de las láminas. El lector de pantalla oye el título entero; las
   letras sueltas son decorativas. */
const SHAPES = ['dot', 'square', 'diamond', 'pill'] as const;
const COLORS = ['var(--accent)', 'var(--focus)', 'var(--plate-tint)'];

export default function GlyphTitle({ text, id, as: Tag = 'h2', tone = 'light' }: { text: string; id?: string; as?: 'h2' | 'h3'; tone?: 'light' | 'dark' }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [swap, setSwap] = useState<Record<number, number>>({});
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const chars = [...text];
  const slots = chars.map((c, i) => (c.trim() ? i : -1)).filter((i) => i >= 0);

  const play = () => {
    if (!motionAllowed() || timer.current) return;
    let ticks = 0;
    timer.current = setInterval(() => {
      ticks++;
      if (ticks > 9) { clearInterval(timer.current!); timer.current = null; setSwap({}); return; }
      const next: Record<number, number> = {};
      for (let k = 0; k < Math.max(1, Math.round(slots.length / 4)); k++) {
        next[slots[Math.floor(Math.random() * slots.length)]] = Math.floor(Math.random() * SHAPES.length * COLORS.length);
      }
      setSwap(next);
    }, 130);
  };

  useEffect(() => { if (seen) play(); }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <Tag ref={ref} id={id} className={`${s.title} ${tone === 'dark' ? s.dark : ''}`} aria-label={text} onPointerEnter={play}>
      <span className={s.word} aria-hidden="true">
        {chars.map((c, i) => {
          const g = swap[i];
          if (g === undefined) return <span key={i} className={s.ch}>{c === ' ' ? ' ' : c}</span>;
          return (
            <span key={i} className={s.ch}>
              <span className={s.ghost}>{c}</span>
              <span className={`${s.glyph} ${s[SHAPES[g % SHAPES.length]]}`} style={{ background: COLORS[Math.floor(g / SHAPES.length) % COLORS.length] }} />
            </span>
          );
        })}
        <motion.span className={s.line} initial={{ scaleX: 0 }} animate={seen ? { scaleX: 1 } : undefined} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
      </span>
    </Tag>
  );
}
