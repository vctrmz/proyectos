'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { needsLoader, markLoaderDone } from '@/lib/loader';

export const LOADER_MS = 1600;
const COUNT_MS = 1300; // el contador llega a 100 y aguanta el resto
const WORDS = ['Diseñar', 'Ordenar', 'Entregar'];

/* Pantalla de carga de la portada. En el HTML estático el velo va opaco (tapa
   la página hasta que hidrata); en cuanto monta, decide: si ya se vio en la
   sesión o es móvil, se apaga sin transición; si no, cuenta 0→100 y se funde. */
export default function Loader() {
  const [active, setActive] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!needsLoader()) { setActive(false); markLoaderDone(); return; }
    ran.current = true;
    setActive(true);
    const wt = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 550);
    const t0 = performance.now();
    let raf = 0;
    let hold: ReturnType<typeof setTimeout> | undefined;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / COUNT_MS);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(step);
      else hold = setTimeout(() => { clearInterval(wt); setActive(false); markLoaderDone(); }, LOADER_MS - COUNT_MS);
    };
    raf = requestAnimationFrame(step);
    return () => { clearInterval(wt); cancelAnimationFrame(raf); if (hold) clearTimeout(hold); };
  }, []);

  const hidden = active === false;
  const style: CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#1b1e27', opacity: hidden ? 0 : 1, pointerEvents: hidden ? 'none' : 'auto',
    transition: ran.current ? 'opacity 0.6s ease' : 'none',
  };
  return (
    <div data-loader style={style} aria-hidden={hidden}>
      {(active || ran.current) && (
        <>
          <span style={{ position: 'absolute', top: 'clamp(20px, 3vw, 40px)', left: 'clamp(20px, 3vw, 40px)', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Portfolio</span>
          <span className="bebas" style={{ fontSize: 'clamp(38px, 7vw, 84px)', color: 'rgba(236,236,236,0.8)' }}>{WORDS[word]}</span>
          <span data-count className="bebas" style={{ position: 'absolute', right: 'clamp(20px, 3vw, 40px)', bottom: 'clamp(44px, 6vw, 76px)', fontSize: 'clamp(56px, 12vw, 140px)', fontVariantNumeric: 'tabular-nums', color: '#ececec' }}>{String(count).padStart(3, '0')}</span>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(44,49,64,0.5)' }}>
            <div style={{ height: '100%', width: count + '%', background: 'linear-gradient(90deg, #4a44f2, #4e85bf)', boxShadow: '0 0 8px rgba(74,68,242,0.35)' }} />
          </div>
        </>
      )}
    </div>
  );
}
