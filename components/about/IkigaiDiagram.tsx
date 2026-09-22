'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ABOUT } from '@/lib/content/about';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import s from './ikigai.module.css';

type K = 'design' | 'tech' | 'business';
const C: { k: K; cx: number; cy: number; from: string; to: string; lx: number; ly: number }[] = [
  { k: 'design', cx: 280, cy: 170, from: '#4a44f2', to: '#8bde5f', lx: 280, ly: 80 },
  { k: 'tech', cx: 200, cy: 300, from: '#8bde5f', to: '#4a44f2', lx: 110, ly: 400 },
  { k: 'business', cx: 360, cy: 300, from: '#ffb547', to: '#4a44f2', lx: 450, ly: 400 },
];

/* Tres círculos con degradado que gira (SMIL) y respiran (motion). Clic o
   foco en uno: los otros se atenúan y su frase aparece en el status. Con
   reduced-motion no se monta el SMIL y MotionConfig deja la respiración quieta. */
export default function IkigaiDiagram() {
  const [active, setActive] = useState<K | null>(null);
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setAnimate(!prefersReducedMotion()); }, []);
  const toggle = (k: K) => setActive((a) => (a === k ? null : k));
  return (
    <div className={s.wrap}>
      <svg viewBox="0 0 560 480" className={s.svg} role="group" aria-label="Diagrama: diseño, tecnología y negocio se cruzan en product design">
        <defs>
          {C.map((c) => (
            <linearGradient key={c.k} id={`g-${c.k}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={c.from} stopOpacity="0.55" /><stop offset="100%" stopColor={c.to} stopOpacity="0.35" />
              {animate && <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="18s" repeatCount="indefinite" />}
            </linearGradient>
          ))}
        </defs>
        {C.map((c, i) => (
          <motion.g key={c.k} role="button" tabIndex={0} aria-label={c.k} aria-pressed={active === c.k}
            className={`${s.circle} ${active && active !== c.k ? s.dim : ''}`}
            onClick={() => toggle(c.k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(c.k); } }}
            animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}>
            <circle cx={c.cx} cy={c.cy} r={130} fill={`url(#g-${c.k})`} stroke="rgba(18,19,23,.12)" />
          </motion.g>
        ))}
        {C.map((c) => <text key={c.k} x={c.lx} y={c.ly} textAnchor="middle" className={s.label}>{c.k}</text>)}
        <text x={280} y={262} textAnchor="middle" className={s.center}>{ABOUT.ikigai.center}</text>
      </svg>
      <p role="status" aria-live="polite" className={s.status}>{active ? ABOUT.ikigai[active] : 'Toca un círculo.'}</p>
    </div>
  );
}
