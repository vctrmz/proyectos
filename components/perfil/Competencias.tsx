'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { COMP_DATA } from '@/lib/data';
import { Words } from '@/components/effects/neat';

export default function Competencias() {
  const [shut, setShut] = useState<number[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  /* Cartas apiladas: cada una se encoge y oscurece cuando la siguiente sube. */
  useEffect(() => {
    const el = stage.current;
    if (!el || isLight()) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-comp-card]'));
    const tweens = cards.map((card, i) => {
      if (i === cards.length - 1) return null;
      return gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, { scale: 0.94, filter: 'brightness(0.62)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 30%', scrub: true } });
    });
    return () => tweens.forEach((t) => t?.kill());
  }, []);

  const toggle = (gi: number) => {
    setShut((s) => (s.includes(gi) ? s.filter((x) => x !== gi) : [...s, gi]));
    setTimeout(() => ScrollTrigger.refresh(), 0);
  };

  return (
    <div data-screen-label="Competencias" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 1, background: '#343a4a' }} />
          <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Competencias clave</span>
          <span style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#4d4d4d' }}>(04)</span>
        </div>
        <Words style={{ margin: '20px 0 0', fontSize: 'clamp(26px, 3.8vw, 46px)', fontWeight: 400, letterSpacing: '-0.02em' }}>Lo que sé <span className="bebas" style={{ letterSpacing: '0.01em' }}>hacer</span></Words>
        <div ref={stage} style={{ position: 'relative', marginTop: 'clamp(14px, 2vw, 26px)' }}>
          {COMP_DATA.map((g, gi) => {
            const closed = shut.includes(gi);
            return (
              <div key={g.name} className="comp-slot" style={{ zIndex: gi + 1 }}>
                <div data-comp-card className="comp-card" style={{ '--i': gi } as CSSProperties}>
                  <div onClick={() => toggle(gi)} style={{ cursor: 'pointer', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 18, borderBottom: '1px solid #262626' }}>
                    <p className="bebas" style={{ margin: 0, fontSize: 'clamp(24px, 2.8vw, 36px)', lineHeight: 1.1 }}>{g.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8bde5f' }}>{String(g.items.length).padStart(2, '0')} competencias</p>
                      <i className={closed ? 'ri-add-line' : 'ri-subtract-line'} style={{ fontSize: 18, color: closed ? '#4d4d4d' : '#8bde5f', transition: 'color 0.3s ease' }} />
                    </div>
                  </div>
                  <div className={'comp-list' + (closed ? ' is-shut' : '')}>
                    {g.items.map(([lead, rest], i) => (
                      <div key={lead} style={{ display: 'grid', gridTemplateColumns: '30px minmax(0, 1fr)', gap: 12, alignItems: 'baseline' }}>
                        <span style={{ fontSize: 11, color: '#4d4d4d' }}>{gi + 1}.{i + 1}</span>
                        <p style={{ margin: 0, fontSize: 'clamp(13.5px, 1.1vw, 15px)', lineHeight: 1.58, color: '#949494', textWrap: 'pretty' } as React.CSSProperties}><span style={{ color: '#ececec' }}>{lead}</span>{rest}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
