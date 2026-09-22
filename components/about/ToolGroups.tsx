'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import { ABOUT } from '@/lib/content/about';
import s from './tools.module.css';

/* Los chips se inclinan hacia el cursor: escala y tono según la distancia, y
   el más cercano se resalta. Solo con puntero fino y sin reduced-motion. */
function useProximity(stage: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = stage.current;
    if (!el || !scrollEffectsAllowed()) return;
    const radius = 150, maxScale = 1.12;
    const chips = () => Array.from(el.querySelectorAll<HTMLElement>('[data-tool]'));
    const onMove = (e: MouseEvent) => {
      let best: HTMLElement | null = null, bestD = Infinity;
      const data = chips().map((chip) => {
        const r = chip.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        if (d < bestD) { bestD = d; best = chip; }
        return { chip, d };
      });
      data.forEach(({ chip, d }) => {
        const pr = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, radius, 1, 0, d));
        const near = chip === best && bestD < 90;
        chip.style.zIndex = near ? '3' : '1';
        gsap.to(chip, { scale: 1 + (maxScale - 1) * pr, y: -3 * pr, borderColor: near ? '#8bde5f' : pr > 0.5 ? '#c9cddb' : 'rgba(183,191,217,0.18)', color: pr > 0.4 ? '#121317' : '#45474d', backgroundColor: near ? '#f2fbec' : '#f8f9fc', duration: 0.4, overwrite: true, ease: 'power2.out' });
      });
    };
    const onLeave = () => {
      const c = chips();
      c.forEach((x) => { x.style.zIndex = '1'; });
      gsap.to(c, { scale: 1, y: 0, borderColor: 'rgba(183,191,217,0.18)', color: '#45474d', backgroundColor: '#f8f9fc', duration: 0.6, overwrite: true, ease: 'power2.out' });
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [stage]);
}

/* La galería del primer grupo arranca comprimida hacia el centro y se abre a
   su sitio a medida que la sección entra en pantalla, con un desfase por
   pieza. El scroll manda (scrub), así que el movimiento va al ritmo del que
   lee, no a un tiempo fijo. */
function useStagger(grid: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = grid.current;
    if (!el || !scrollEffectsAllowed()) return;
    const tiles = el.querySelectorAll<HTMLElement>('[data-tile]');
    if (!tiles.length) return;
    const mid = (tiles.length - 1) / 2;
    const tween = gsap.fromTo(tiles,
      { scale: 0.82, opacity: 0, xPercent: (i: number) => (mid - i) * 14, yPercent: (i: number) => (i % 2 ? 16 : 26) },
      { scale: 1, opacity: 1, xPercent: 0, yPercent: 0, ease: 'power2.out', stagger: { each: 0.05, from: 'center' },
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: 0.6 } });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); ScrollTrigger.refresh(); };
  }, [grid]);
}

/* Cada mosaico lleva un glifo dibujado con los mismos trazos del sistema: no
   uso logos de terceros y el dibujo dice qué hago con la herramienta, no qué
   marca es. */
type Kind = 'frames' | 'board' | 'proto' | 'layers' | 'pen' | 'timeline' | 'cut';

const KIND: Record<string, Kind> = {
  'Figma (avanzado)': 'frames',
  'FigJam': 'board',
  'Prototipos interactivos': 'proto',
  'Photoshop': 'layers',
  'Illustrator': 'pen',
  'Premiere': 'timeline',
  'CapCut': 'cut',
};

function Glyph({ kind }: { kind: Kind }) {
  const common = { viewBox: '0 0 64 64', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const };
  switch (kind) {
    case 'frames': return (
      <svg {...common} className={s.glyph}>
        <rect x="6" y="6" width="38" height="30" rx="3" />
        <rect x="20" y="24" width="38" height="34" rx="3" />
        <path d="M20 16h24M20 22h14" />
      </svg>
    );
    case 'board': return (
      <svg {...common} className={s.glyph}>
        <rect x="6" y="8" width="24" height="24" rx="2" />
        <rect x="36" y="14" width="22" height="22" rx="2" transform="rotate(-7 47 25)" />
        <rect x="14" y="38" width="26" height="20" rx="2" transform="rotate(4 27 48)" />
      </svg>
    );
    case 'proto': return (
      <svg {...common} className={s.glyph}>
        <rect x="4" y="12" width="20" height="26" rx="3" />
        <rect x="40" y="26" width="20" height="26" rx="3" />
        <path d="M24 22h10a4 4 0 0 1 4 4v9" />
        <path d="M34 31l4 4-4 4" />
        <circle cx="14" cy="46" r="4" />
      </svg>
    );
    case 'layers': return (
      <svg {...common} className={s.glyph}>
        <path d="M32 6L58 20 32 34 6 20z" />
        <path d="M6 32l26 14 26-14" />
        <path d="M6 44l26 14 26-14" />
      </svg>
    );
    case 'pen': return (
      <svg {...common} className={s.glyph}>
        <path d="M8 50C8 26 26 14 56 14" />
        <rect x="4" y="46" width="8" height="8" rx="1" />
        <rect x="52" y="10" width="8" height="8" rx="1" />
        <path d="M24 58l6-16 12 6z" />
      </svg>
    );
    case 'timeline': return (
      <svg {...common} className={s.glyph}>
        <rect x="4" y="14" width="34" height="12" rx="2" />
        <rect x="14" y="32" width="46" height="12" rx="2" />
        <rect x="4" y="50" width="24" height="8" rx="2" />
        <path d="M46 6v54" />
      </svg>
    );
    case 'cut': return (
      <svg {...common} className={s.glyph}>
        <rect x="4" y="20" width="24" height="24" rx="3" />
        <rect x="36" y="20" width="24" height="24" rx="3" />
        <path d="M32 8v8M32 24v8M32 40v8M32 56v-8" />
      </svg>
    );
  }
}

export default function ToolGroups() {
  const stage = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  useProximity(stage);
  useStagger(grid);
  const [featured, ...rest] = ABOUT.toolGroups;
  const id = (n: string) => `tool-${n.replace(/\s+/g, '-')}`;
  return (
    <div ref={stage} className={s.stage}>
      <div data-featured className={s.featured}>
        <p className={s.name} id={id(featured.name)}>{featured.name}</p>
        <div ref={grid} className={s.tiles} role="list" aria-labelledby={id(featured.name)}>
          {featured.items.map((t) => (
            <span key={t} data-tile role="listitem" className={s.tile}>
              <Glyph kind={KIND[t] ?? 'frames'} />
              <span className={s.tileName}>{t}</span>
            </span>
          ))}
        </div>
      </div>
      {rest.map((g) => (
        <div key={g.name} className={s.group}>
          <p className={s.name} id={id(g.name)}>{g.name}</p>
          <ul className={s.chips} aria-labelledby={id(g.name)}>
            {g.items.map((t) => <li key={t} data-tool className={s.chip}>{t}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
