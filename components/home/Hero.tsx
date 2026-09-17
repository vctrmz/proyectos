'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { isMobileViewport } from '@/lib/loader';
import { SOCIAL } from '@/lib/data';
import Starfield from '@/components/effects/Starfield';
import { RollText, useAfterIntro } from '@/components/effects/neat';

const ROLES = ['complejo', 'regulado', 'escalable', 'medible'];

export default function Hero() {
  const [role, setRole] = useState(0);
  const [density, setDensity] = useState(300);

  useEffect(() => {
    const t = setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2200);
    setDensity(isMobileViewport() ? 170 : 300);
    return () => clearInterval(t);
  }, []);

  /* Intro: nombre y bloques entran cuando el loader termina. */
  useAfterIntro(() => {
    if (isLight()) {
      gsap.from('.name-reveal', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
      gsap.from('.blur-in', { opacity: 0, y: 12, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
    } else {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.name-reveal', { opacity: 0, y: 50, duration: 1.2 }, 0.1)
        .from('.blur-in', { opacity: 0, y: 20, filter: 'blur(10px)', duration: 1, stagger: 0.1 }, 0.3);
    }
  });

  return (
    <div id="inicio" data-screen-label="Hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <cursor-ring-field colors="#8bde5f,#4a44f2,#232733" background="#1b1e27" density={density} dot-size={120} speed={6} camera-distance={160} ring-radius={12} ring-width={9} push={50} turbulence={100} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 45%, rgba(27,30,39,0.35), rgba(27,30,39,0.82))', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: 'linear-gradient(to top, #1b1e27, transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: 'clamp(120px, 14vh, 180px) clamp(20px, 4vw, 64px) clamp(80px, 10vh, 120px)' }}>
        <p className="blur-in" style={{ margin: '0 0 28px' }}><span style={{ display: 'inline-block', padding: '5px 12px 4px', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#15181f', background: '#8bde5f' }}>Product Designer (UX/UI)</span></p>
        <h1 className="name-reveal bebas" style={{ margin: '0 0 22px', fontWeight: 400, fontSize: 'clamp(52px, 11vw, 148px)', lineHeight: 0.9, letterSpacing: '0.01em' }}>Víctor Maza</h1>
        <p className="blur-in" style={{ margin: '0 0 26px', fontSize: 'clamp(18px, 2.4vw, 30px)', color: '#c9c9c9' }}>
          Diseño producto <span key={role} className="bebas" style={{ fontSize: '1.15em', letterSpacing: '0.02em', color: '#ececec', display: 'inline-block', animation: 'roleFade 0.4s ease-out' }}>{ROLES[role]}</span> desde Málaga.
        </p>
        <p className="blur-in" style={{ margin: '0 0 40px', maxWidth: 520, fontSize: 'clamp(14px, 1.2vw, 17px)', lineHeight: 1.65, color: '#e2e4ea', textWrap: 'pretty' } as React.CSSProperties}>Nueve años en SaaS B2B e Insurtech: ordeno dominios densos y construyo design systems con reglas de decisión. Diseño y escribo el front, así el diseño llega entero a producción.</p>
        <div className="blur-in" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
          <a href="#trabajo" className="btn-ghost"><RollText>Ver casos</RollText></a>
          <Starfield label="Escríbeme ↗" href="#contacto" rounded={100} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener" title="LinkedIn" className="social-circle"><i className="ri-linkedin-fill" style={{ fontSize: 23 }} /></a>
            <a href={SOCIAL.behance} target="_blank" rel="noopener" title="Behance" className="social-circle"><i className="ri-behance-fill" style={{ fontSize: 23 }} /></a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener" title="Instagram" className="social-circle"><i className="ri-instagram-line" style={{ fontSize: 23 }} /></a>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: '50%', bottom: 28, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: 10 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#878787' }}>Scroll</span>
        <span style={{ position: 'relative', display: 'block', width: 1, height: 40, background: '#2c3140', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, #4a44f2, transparent)', animation: 'scrollDown 1.5s ease-in-out infinite' }} />
        </span>
      </div>
      {/* Decorativo: carga en idle para no bloquear la hidratación */}
      <Script src="/effects/cursor-ring-field.js" strategy="lazyOnload" />
    </div>
  );
}
