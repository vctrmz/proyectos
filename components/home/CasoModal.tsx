'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { WORKS, card, thumb } from '@/lib/data';

interface Props { index: number | null; onClose: () => void; onOpen: (i: number) => void }

/* El clic más repetido de toda la web era el aspa de este modal: se abría un
   caso y la única salida era cerrarlo. El pie ofrece dos continuaciones, el
   otro caso y el contacto, para que leer un caso no termine en un callejón. */
export default function CasoModal({ index, onClose, onOpen }: Props) {
  const [shot, setShot] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => { setShot(0); if (panel.current) panel.current.scrollTop = 0; }, [index]);

  useEffect(() => {
    if (index === null || !panel.current) return;
    const p = panel.current;
    const lines = p.querySelectorAll('[data-box-line]');
    const light = isLight();
    gsap.killTweensOf([p, veil.current, lines]);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (veil.current) tl.fromTo(veil.current, { opacity: 0 }, { opacity: 1, duration: 0.32 }, 0);
    tl.fromTo(p, { opacity: 0, y: light ? 24 : 46, scale: light ? 1 : 0.965 }, { opacity: 1, y: 0, scale: 1, duration: light ? 0.45 : 0.72 }, 0.04);
    if (lines.length) tl.fromTo(lines, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, 0.16);
  }, [index]);

  if (index === null) return null;
  const w = WORKS[index];
  const cur = w.gallery[shot] || w.gallery[0];
  const nextIdx = WORKS.length > 1 ? (index + 1) % WORKS.length : null;
  const next = nextIdx === null ? null : WORKS[nextIdx];

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    /* Salto instantáneo a propósito: ScrollTrigger cancela el scroll suave en
       el primer frame. Espera un tick a que el modal se apague antes de medir. */
    setTimeout(() => {
      const t = document.getElementById('contacto');
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
    }, 0);
  };

  return (
    <div className="box">
      <div ref={veil} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.9)', backdropFilter: 'blur(8px)' }} />
      <div ref={panel} role="dialog" aria-label={w.title} style={{ position: 'relative', width: '100%', maxWidth: 1180, maxHeight: '90vh', overflow: 'auto', borderRadius: 24, border: '1px solid #262626', background: '#101010', willChange: 'transform' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, padding: '22px clamp(20px, 2.6vw, 34px) 0', background: 'linear-gradient(180deg, #101010 70%, transparent)' }}>
          <div>
            <p data-box-line style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8bde5f' }}>{w.kicker}</p>
            <h3 data-box-line className="bebas" style={{ margin: '10px 0 0', fontWeight: 400, fontSize: 'clamp(24px, 3vw, 40px)' }}>{w.title}</h3>
          </div>
          <button type="button" aria-label="Cerrar" className="box-close" onClick={onClose} style={{ background: 'transparent' }}><i className="ri-close-line" style={{ fontSize: 20 }} /></button>
        </div>

        <div className="box-grid">
          <div style={{ minWidth: 0 }}>
            {w.star.map(([, , body, label], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr)', gap: 14, borderTop: '1px solid #2c3140', padding: '16px 0' }}>
                <span className="bebas" style={{ fontSize: 22, color: '#8bde5f' }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.4, color: '#ececec' }}>{label}</p>
                  <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.65, color: '#949494', textWrap: 'pretty' } as React.CSSProperties}>{body}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 'clamp(22px, 2.6vw, 32px)', borderTop: '1px solid #2c3140', paddingTop: 18 }}>
              <p style={{ margin: '0 0 14px', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#878787' }}>Equipo y liderazgo</p>
              {w.team.map(([icon, name, body]) => (
                <div key={name} style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: 12, marginBottom: 14 }}>
                  <i className={icon} style={{ fontSize: 16, marginTop: 2, color: '#8bde5f' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 14.5, color: '#ececec' }}>{name}</p>
                    <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.6, color: '#949494', textWrap: 'pretty' } as React.CSSProperties}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div role="img" aria-label={cur[1]} style={{ width: '100%', height: 'clamp(320px, 62vh, 720px)', borderRadius: 24, border: '1px solid #2c3140', backgroundColor: '#0d0d0d', backgroundImage: `url(${card(cur[0])})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, marginTop: 12 }}>
              {w.gallery.map((g, i) => (
                <div key={g[0]} role="button" tabIndex={0} aria-label={`Captura ${i + 1} de ${w.gallery.length}: ${g[1]}`} aria-pressed={shot === i} title={g[1]}
                  onClick={() => setShot(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShot(i); } }}
                  style={{ cursor: 'pointer', height: 62, borderRadius: 14, border: '1px solid ' + (shot === i ? '#8bde5f' : '#2c3140'), backgroundColor: '#232733', backgroundImage: `url(${thumb(g[0])})`, backgroundSize: 'cover', backgroundPosition: 'top left', opacity: shot === i ? 1 : 0.55, transition: 'opacity 0.25s ease, border-color 0.25s ease' }} />
              ))}
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 12, letterSpacing: '0.1em', color: '#6d6d6d' }}>{cur[1]}</p>
            <div style={{ marginTop: 'clamp(22px, 2.6vw, 32px)', borderTop: '1px solid #2c3140', paddingTop: 18 }}>
              <p style={{ margin: '0 0 14px', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#878787' }}>Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {w.skills.map((k) => <span key={k} style={{ border: '1px solid #262626', borderRadius: 999, padding: '7px 14px', fontSize: 12.5, color: '#d6d6d6', background: 'rgba(139,222,95,0.07)' }}>{k}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginTop: 22 }}>
                {w.facts.map(([v, k]) => (
                  <div key={k} style={{ borderTop: '1px solid #2c3140', paddingTop: 12 }}>
                    <p className="bebas" style={{ margin: 0, fontSize: 'clamp(24px, 2.6vw, 34px)', lineHeight: 1 }}>{v}</p>
                    <p style={{ margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.45, color: '#878787' }}>{k}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, margin: '0 clamp(20px, 2.6vw, 34px) clamp(24px, 3vw, 40px)', borderTop: '1px solid #2c3140', paddingTop: 20 }}>
          {next && nextIdx !== null && (
            <a href="#trabajo" className="box-next" onClick={(e) => { e.preventDefault(); onOpen(nextIdx); }}>
              <span style={{ fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#878787' }}>Siguiente caso</span>
              <span style={{ fontSize: 15, lineHeight: 1.3, color: '#ececec' }}>{next.title} →</span>
            </a>
          )}
          <a href="#contacto" className="box-contact" onClick={goContact}>Escríbeme ↗</a>
        </div>
      </div>
    </div>
  );
}
