'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { EMAIL, SOCIAL } from '@/lib/data';
import { resetConsent } from '@/lib/consent';
import Starfield from '@/components/effects/Starfield';
import { RollText } from '@/components/effects/neat';

export default function Contacto({ variant }: { variant: 'home' | 'perfil' }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copyMail = () => {
    const write = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(EMAIL) : Promise.reject();
    write.catch(() => {
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }).finally(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div id="contacto" data-screen-label="Contacto" data-no-reveal style={{ position: 'relative', padding: 'clamp(56px, 7vw, 96px) 0 0', overflow: 'hidden', borderTop: '1px solid #232733', background: '#15181f' }}>
      <div style={{ padding: '0 clamp(20px, 6vw, 100px)' }}>
        <div className="foot-grid">
          <p style={{ margin: 0, maxWidth: 260, fontSize: 14, lineHeight: 1.6, color: '#878787' }}>Diseño producto B2B donde un error operativo cuesta dinero.</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6d6d6d' }}>Ponte en contacto</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              <div onClick={copyMail} title="Copiar correo" style={{ display: 'inline-flex' }}>
                <Starfield label={EMAIL} padding="14px 24px" fontSize={16} lightSize={110} pixelDensity={50} speed={50} />
              </div>
              <Starfield label="LinkedIn ↗" href={SOCIAL.linkedin} newTab padding="14px 24px" fontSize={16} lightSize={110} pixelDensity={50} speed={50} />
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 12.5, letterSpacing: '0.1em', color: '#8bde5f', opacity: copied ? 1 : 0, transition: 'opacity 0.3s ease' }}>Correo copiado</p>
          </div>
          <div className="foot-links">
            <a href={SOCIAL.behance} target="_blank" rel="noopener" className="link-muted"><RollText>Behance ↗</RollText></a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener" className="link-muted"><RollText>Instagram ↗</RollText></a>
            {variant === 'home'
              ? <Link href="/perfil" className="link-muted"><RollText>Perfil ↗</RollText></Link>
              : <Link href="/" className="link-muted"><RollText>Portada ↗</RollText></Link>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 'clamp(36px, 4.6vw, 64px)', padding: '14px clamp(20px, 6vw, 100px)', background: '#3a34e8' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, fontSize: 12.5, color: '#d6e2ff' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#ececec' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#8bde5f', boxShadow: '0 0 10px rgba(139,222,95,0.6)' }} />
            Disponible para proyectos
          </span>
          <span>© 2026 Víctor Maza · Málaga, España · Trabajo en remoto · <Link href="/privacidad" className="strip-link">Privacidad</Link> · <Link href="/privacidad#cookies" className="strip-link" onClick={(e) => { e.preventDefault(); resetConsent(); }}>Cookies</Link></span>
        </div>
      </div>
    </div>
  );
}
