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

/* La galería del primer grupo entra escalonada por columnas al hacer scroll:
   las piezas impares suben un poco más tarde, como una rejilla desfasada. */
function useStagger(grid: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = grid.current;
    if (!el || !scrollEffectsAllowed()) return;
    const tiles = el.querySelectorAll<HTMLElement>('[data-tile]');
    if (!tiles.length) return;
    const tween = gsap.fromTo(tiles,
      { y: (i: number) => 28 + (i % 2) * 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: { each: 0.06, from: 'start' }, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); ScrollTrigger.refresh(); };
  }, [grid]);
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
          {featured.items.map((t, i) => (
            <span key={t} data-tile role="listitem" className={`${s.tile} ${s['t' + (i % 4)]}`}>
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
