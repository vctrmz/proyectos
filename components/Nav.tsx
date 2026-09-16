'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RollText } from './effects/neat';
import Starfield from './effects/Starfield';

export default function Nav() {
  const p = usePathname();
  const legal = p === '/privacidad';
  return (
    <div className="nav">
      <div className="nav-pill">
        <Link href="/" className="nav-logo" aria-label="Inicio"><span>VM</span></Link>
        <span className="nav-sep" />
        <Link href="/" className={'nav-link' + (p === '/' ? ' is-active' : '')}><RollText>Inicio</RollText></Link>
        <Link href="/perfil" className={'nav-link' + (p === '/perfil' ? ' is-active' : '')}><RollText>Sobre mí</RollText></Link>
        {!legal && (
          <>
            <span className="nav-sep" />
            <Starfield label="Escríbeme ↗" href="#contacto" fill="rgba(35,39,51,0.55)" padding="8px 16px" fontSize={13} lightSize={58} pixelDensity={46} glowSize={14} />
          </>
        )}
      </div>
    </div>
  );
}
