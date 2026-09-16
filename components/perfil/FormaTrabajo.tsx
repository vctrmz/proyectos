'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { TOOL_GROUPS } from '@/lib/data';

const S = { color: '#ececec', fontWeight: 500 } as const;

/* Los chips se inclinan hacia el cursor: escala y color según la distancia,
   el más cercano se resalta. */
function useProximity(stage: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = stage.current;
    if (!el || isLight()) return;
    const radius = 150, maxScale = 1.13;
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
        gsap.to(chip, { scale: 1 + (maxScale - 1) * pr, y: -4 * pr, borderColor: near ? '#8bde5f' : pr > 0.5 ? '#3a3a3a' : '#262626', color: pr > 0.4 ? '#ececec' : '#a8a8a8', backgroundColor: near ? '#1d1409' : '#232733', duration: 0.4, overwrite: true, ease: 'power2.out' });
      });
    };
    const onLeave = () => {
      chips().forEach((c) => { c.style.zIndex = '1'; });
      gsap.to(chips(), { scale: 1, y: 0, borderColor: '#262626', color: '#a8a8a8', backgroundColor: '#232733', duration: 0.6, overwrite: true, ease: 'power2.out' });
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [stage]);
}

export default function FormaTrabajo() {
  const stage = useRef<HTMLDivElement>(null);
  useProximity(stage);
  return (
    <div data-screen-label="Forma de trabajo" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(28px, 4vw, 64px)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 32, height: 1, background: '#343a4a' }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Forma de trabajo</span>
            <span style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#4d4d4d' }}>(03)</span>
          </div>
          <p style={{ margin: '22px 0 0', fontSize: 'clamp(15px, 1.3vw, 17.5px)', lineHeight: 1.72, color: '#949494', textWrap: 'pretty' } as React.CSSProperties}>
            Mi proceso es <strong style={S}>iterativo y se adapta a la madurez del producto</strong>. Arranco en <strong style={S}>discovery con Product Owners y stakeholders</strong> para separar el problema real de la solución que ya traen pensada. Según el caso, la estrategia cambia: <strong style={S}>benchmark e investigación a fondo</strong> cuando la funcionalidad es nueva, <strong style={S}>prototipado rápido sobre el design system</strong> cuando el terreno ya está construido. Diseño la <strong style={S}>arquitectura de la solución antes de dibujar pantallas</strong>, <strong style={S}>valido en ciclos cortos</strong> y cierro con un <strong style={S}>handoff que el equipo puede construir sin interpretar nada</strong>: estados, reglas, casos límite y componentes existentes. Tres criterios no negociables por debajo de todo: <strong style={S}>KISS</strong>, la solución más simple que resuelve el caso completo, porque en producto denso cada elemento de más es carga cognitiva y deuda de mantenimiento; <strong style={S}>mobile first</strong>, que obliga a jerarquizar lo esencial antes de disponer de espacio y hace que el escalado a escritorio sea una ampliación, no un rediseño; y la <strong style={S}>regla 60-30-10</strong> para repartir el color, con el neutro dominante sosteniendo la lectura, el secundario estructurando superficies y el acento reservado a la acción, de modo que lo importante se distinga sin recurrir a más saturación. Y lo cuento en <strong style={S}>lenguaje de negocio</strong>, porque un diseño que no se sabe defender no se aprueba. Por encima del método, lo que busco es <strong style={S}>crear atmósfera</strong>: que cada pantalla, cada estado y cada palabra hagan que <strong style={S}>la marca respire el mismo aire</strong> de un extremo a otro del producto.
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 32, height: 1, background: '#343a4a' }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Herramientas</span>
          </div>
          <div ref={stage} style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 22 }}>
            {TOOL_GROUPS.map((g) => (
              <div key={g.name}>
                <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8bde5f' }}>{g.name}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '11px 10px' }}>
                  {g.items.map((t) => <span key={t} data-tool style={{ position: 'relative', border: '1px solid #262626', borderRadius: 999, padding: '8px 14px', fontSize: 12.5, lineHeight: 1.2, whiteSpace: 'nowrap', color: '#d6d6d6', background: '#232733', willChange: 'transform' }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40 }}>
            <span style={{ width: 32, height: 1, background: '#343a4a' }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Idiomas</span>
          </div>
          <p style={{ margin: '18px 0 0', fontSize: 15, lineHeight: 1.6, color: '#949494' }}>Español nativo · Inglés B1, en formación activa hacia B2</p>
        </div>
      </div>
    </div>
  );
}
