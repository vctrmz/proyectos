'use client';

import Link from 'next/link';
import Starfield from '@/components/effects/Starfield';
import { Lines, RollText } from '@/components/effects/neat';

export default function Cabecera() {
  return (
    <div data-screen-label="Cabecera" data-no-reveal style={{ padding: 'clamp(130px, 16vh, 190px) clamp(20px, 4vw, 64px) clamp(48px, 6vw, 80px)' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <p className="fade" style={{ margin: '0 0 26px', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8bde5f' }}>Perfil · Product Designer (UX/UI)</p>
        <Lines lines={['Diseño sistemas,', 'no pantallas']} className="bebas" style={{ margin: 0, fontWeight: 400, fontSize: 'clamp(42px, 8vw, 112px)', lineHeight: 0.94, letterSpacing: '-0.02em' }} />
        <div className="fade" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
          <Starfield label="Escríbeme ↗" href="#contacto" rounded={100} lightSize={86} />
          <Link href="/#trabajo" className="btn-ghost"><RollText>Ver casos</RollText></Link>
        </div>
        <a className="fade cue-link" href="#quien">
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, border: '1px solid #343a4a', borderRadius: 999 }}><i className="ri-arrow-down-line" style={{ fontSize: 13, color: '#8bde5f' }} /></span>
          <RollText>Baja y te cuento</RollText>
        </a>
      </div>
    </div>
  );
}
