'use client';

import { sectorRows } from '@/lib/data';
import { Words } from '@/components/effects/neat';

export default function Sectores({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div id="sectores" data-screen-label="Sectores" style={{ padding: 'clamp(56px, 7vw, 96px) clamp(20px, 4vw, 64px)' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 1, background: '#343a4a' }} />
          <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Recorrido</span>
        </div>
        <Words style={{ margin: '20px 0 0', fontSize: 'clamp(30px, 4.6vw, 58px)', fontWeight: 400, letterSpacing: '-0.02em' }}>Cinco sectores, el mismo <span className="bebas" style={{ letterSpacing: '0.01em' }}>tipo de problema</span></Words>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 'clamp(28px, 3.4vw, 44px)' }}>
          {sectorRows().map((s) => (
            <div key={s.n}>
              {s.head && <p className="sector-head">{s.head}</p>}
              <div className="sector-row">
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 999, border: '1px solid #343a4a', fontSize: 12, color: s.color }}>{s.n}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 'clamp(17px, 1.8vw, 22px)' }}>{s.name}</p>
                  <p style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.6, color: '#878787', textWrap: 'pretty' }}>{s.body}</p>
                  {s.cta && (s.external
                    ? <a href={s.href} target="_blank" rel="noopener" className="sector-cta">{s.cta}</a>
                    : <a href={s.href} className="sector-cta" onClick={(e) => { e.preventDefault(); onOpen(s.caseIdx as number); }}>{s.cta}</a>)}
                </div>
                <span className="sector-year">{s.years}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
