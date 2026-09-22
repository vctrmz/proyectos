'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { motionAllowed } from '@/lib/motion/prefs';
import { ABOUT } from '@/lib/content/about';
import s from './ikigai.module.css';

type K = 'design' | 'tech' | 'business';
const R = 130;
const C: { k: K; cx: number; cy: number; lx: number; ly: number }[] = [
  { k: 'design', cx: 280, cy: 170, lx: 280, ly: 70 },
  { k: 'tech', cx: 200, cy: 300, lx: 100, ly: 410 },
  { k: 'business', cx: 360, cy: 300, lx: 462, ly: 410 },
];
const LEN = 2 * Math.PI * R;

/* Tres anillos de trazo fino con degradado (violeta → verde → aire). Con
   motion permitido, GSAP los dibuja al entrar y hace girar cada anillo muy
   despacio: al girar, el degradado recorre la línea. Clic o foco en un anillo
   atenúa los otros y muestra su frase en el status. */
export default function IkigaiDiagram() {
  const [active, setActive] = useState<K | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !motionAllowed()) return;
    const rings = svg.querySelectorAll<SVGCircleElement>('[data-ring]');
    const tl = gsap.timeline();
    tl.fromTo(rings, { strokeDashoffset: LEN }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.18, ease: 'power3.out' });
    const spins = Array.from(rings).map((r, i) => gsap.to(r, { rotation: i % 2 ? -360 : 360, transformOrigin: '50% 50%', duration: 40 + i * 8, repeat: -1, ease: 'none' }));
    return () => { tl.kill(); spins.forEach((t) => t?.kill()); };
  }, []);

  const toggle = (k: K) => setActive((a) => (a === k ? null : k));
  return (
    <div className={s.wrap}>
      <svg ref={ref} viewBox="0 0 560 480" className={s.svg} role="group" aria-label="Diagrama: diseño, tecnología y negocio se cruzan en product design">
        <defs>
          <linearGradient id="ik-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4a44f2" />
            <stop offset="55%" stopColor="#8bde5f" />
            <stop offset="100%" stopColor="#4a44f2" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {C.map((c) => (
          <g key={c.k} role="button" tabIndex={0} aria-label={c.k} aria-pressed={active === c.k}
            className={`${s.ring} ${active && active !== c.k ? s.dim : ''} ${active === c.k ? s.on : ''}`}
            onClick={() => toggle(c.k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(c.k); } }}>
            <circle cx={c.cx} cy={c.cy} r={R + 14} fill="transparent" stroke="none" />
            <circle data-ring cx={c.cx} cy={c.cy} r={R} fill="none" stroke="url(#ik-line)" strokeWidth={1.5} strokeDasharray={LEN} strokeDashoffset={0} />
          </g>
        ))}
        {C.map((c) => <text key={c.k} x={c.lx} y={c.ly} textAnchor="middle" className={s.label}>{c.k}</text>)}
        <text x={280} y={262} textAnchor="middle" className={s.center}>{ABOUT.ikigai.center}</text>
      </svg>
      <p role="status" aria-live="polite" className={s.status}>{active ? ABOUT.ikigai[active] : 'Toca un círculo.'}</p>
    </div>
  );
}
