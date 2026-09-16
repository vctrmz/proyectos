'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { workRows, type WorkRow } from '@/lib/data';
import { RollText, Words } from '@/components/effects/neat';

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/* La imagen sigue al cursor en vez de vivir en la fila: la lista se lee como
   texto y la prueba visual aparece solo donde apunta la atención. */
export default function Trabajo({ onOpen }: { onOpen: (i: number) => void }) {
  const rows = workRows();
  const list = useRef<HTMLDivElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(BLANK);
  const move = useRef<{ x: (v: number) => void; y: (v: number) => void; placed: boolean } | null>(null);

  useEffect(() => {
    if (!peek.current || isLight()) return;
    move.current = {
      x: gsap.quickTo(peek.current, 'x', { duration: 0.55, ease: 'power3' }),
      y: gsap.quickTo(peek.current, 'y', { duration: 0.55, ease: 'power3' }),
      placed: false,
    };
  }, []);

  /* El primer pointerenter llega antes de cualquier pointermove: se coloca sin
     tween en la primera posición conocida para que no cruce la página. */
  const put = (e: React.PointerEvent, jump: boolean) => {
    const m = move.current;
    const el = peek.current;
    if (!m || !el) return;
    const w = el.offsetWidth || 280;
    const h = w * 0.75;
    const x = e.clientX - w / 2;
    const y = e.clientY - h / 2;
    if (!m.placed || jump) { gsap.set(el, { x, y }); m.placed = true; return; }
    m.x(x);
    m.y(y);
  };

  const enter = (row: WorkRow, e: React.PointerEvent<HTMLDivElement>) => {
    put(e, !move.current?.placed);
    if (!move.current) return;
    setSrc(row.img);
    gsap.to(peek.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: true });
    const arrow = e.currentTarget.querySelector('[data-work-arrow]');
    if (arrow) gsap.to(arrow, { color: '#8bde5f', x: 4, y: -4, duration: 0.35, ease: 'power2.out' });
  };
  const leave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!move.current) return;
    gsap.to(peek.current, { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.out', overwrite: true });
    const arrow = e.currentTarget.querySelector('[data-work-arrow]');
    if (arrow) gsap.to(arrow, { color: '#6d6d6d', x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
  };
  const act = (row: WorkRow) => {
    if (row.action.kind === 'case') onOpen(row.action.index);
    else window.open(row.action.url, '_blank', 'noopener');
  };

  return (
    <div id="trabajo" data-screen-label="Trabajo" style={{ padding: 'clamp(64px, 8vw, 110px) clamp(20px, 4vw, 64px)' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ display: 'inline-block', padding: '5px 11px 4px', fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#15181f', background: '#8bde5f' }}>Casos seleccionados</span>
          <span style={{ fontSize: 10.5, letterSpacing: '0.1em', color: '#a9a4f8' }}>{String(rows.length).padStart(2, '0')}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginTop: 14 }}>
          <Words style={{ margin: 0, fontSize: 'clamp(34px, 6vw, 78px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>Producto <span className="bebas" style={{ letterSpacing: '0.01em' }}>en producción</span></Words>
          <a href="#sectores" className="link-dim"><RollText>[ Todos los sectores ]</RollText></a>
        </div>
        <div ref={list} onPointerMove={(e) => put(e, false)} style={{ position: 'relative', marginTop: 'clamp(32px, 4vw, 56px)', borderTop: '1px solid #2c3140' }}>
          {rows.map((row) => (
            <div key={row.n} className="work-row" onClick={() => act(row)} onPointerEnter={(e) => enter(row, e)} onPointerLeave={leave}>
              <span style={{ fontSize: 11, color: '#8bde5f', paddingTop: 8 }}>{row.n}</span>
              <div>
                <p style={{ margin: 0, fontSize: 'clamp(22px, 3.2vw, 40px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{row.title}</p>
                <p style={{ margin: '10px 0 0', maxWidth: 520, fontSize: 14.5, lineHeight: 1.6, color: '#878787', textWrap: 'pretty' } as React.CSSProperties}>{row.desc}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, paddingTop: 6 }}>
                <span style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6d6d6d', whiteSpace: 'nowrap' }}>{row.kicker}</span>
                <i className="ri-arrow-right-up-line" data-work-arrow style={{ fontSize: 22, color: '#6d6d6d', transition: 'color 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
            </div>
          ))}
          <div ref={peek} className="work-peek">
            <img alt="" src={src} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
