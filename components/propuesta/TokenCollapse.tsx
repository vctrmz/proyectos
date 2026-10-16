'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, LayoutGroup, motion, useInView, useMotionValue, useTransform } from 'motion/react';
import { motionAllowed } from '@/lib/motion/prefs';
import { TOKENS, TOTAL, buildSwatches } from './tokens';
import s from './TokenCollapse.module.css';

/* La idea de la propuesta hecha objeto: los 267 valores de color que había en
   el monorepo caen sobre los 24 tokens con rol que los sustituyeron. Es la
   misma pieza en los dos estados —el campo desordenado y la paleta con
   nombre— y el paso de uno a otro es una animación de layout de Motion: cada
   muestra viaja desde su sitio en el campo hasta la ficha de su token.

   Se dispara sola una vez al entrar en pantalla; el interruptor deja ir y
   volver. Con menos movimiento pedido, cambia de estado sin viajar. Sin
   JavaScript se ve el campo de 267, que ya cuenta el problema. */
type Mode = 'audit' | 'tokens';
const COLS = 12;      // fichas por fila en escritorio
const COLS_M = 6;     // y en el móvil

export default function TokenCollapse() {
  const swatches = useMemo(() => buildSwatches(), []);
  const [mode, setMode] = useState<Mode>('audit');
  const touched = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { once: true, amount: 0.45 });

  const n = useMotionValue(TOTAL);
  const shown = useTransform(n, (v) => Math.round(v));

  useEffect(() => {
    if (!seen || touched.current || !motionAllowed()) return;
    const t = setTimeout(() => { if (!touched.current) setMode('tokens'); }, 1300);
    return () => clearTimeout(t);
  }, [seen]);

  useEffect(() => {
    const to = mode === 'tokens' ? TOKENS.length : TOTAL;
    if (!motionAllowed()) { n.set(to); return; }
    const c = animate(n, to, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [mode, n]);

  const pick = (m: Mode) => { touched.current = true; setMode(m); };
  const tokens = mode === 'tokens';

  return (
    <figure className={s.wrap}>
      <div className={s.bar}>
        <p className={s.count} aria-hidden="true">
          <motion.span className={s.num}>{shown}</motion.span>
          <span className={s.unit}>{tokens ? 'tokens con rol' : 'valores de color en el código'}</span>
        </p>
        <div className={s.switch} role="group" aria-label="Estado del sistema de color">
          {(['audit', 'tokens'] as Mode[]).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} className={mode === m ? s.on : undefined} onClick={() => pick(m)}>
              {mode === m && <motion.span layoutId="tc-pill" className={s.pill} transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }} />}
              <span className={s.label}>{m === 'audit' ? 'Antes: auditoría' : 'Después: tokens'}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={stage} className={`${s.field} ${tokens ? s.tokens : s.audit}`} role="img"
        aria-label={tokens ? `Los ${TOTAL} valores agrupados en ${TOKENS.length} tokens: ${TOKENS.map((t) => t.name).join(', ')}.` : `${TOTAL} valores de color sueltos, casi iguales entre sí.`}>
        <LayoutGroup>
          {swatches.map((w, i) => {
            const ti = w.token;
            const pos = { '--c': (ti % COLS) + 1, '--r': Math.floor(ti / COLS) + 1, '--cm': (ti % COLS_M) + 1, '--rm': Math.floor(ti / COLS_M) + 1 } as React.CSSProperties;
            const lead = w.hex === TOKENS[ti].hex;
            return (
              <motion.span key={w.id} layout className={s.sw}
                style={{ ...pos, background: w.hex, zIndex: lead ? 2 : 1, borderRadius: tokens ? 10 : 4 }}
                transition={{ layout: { type: 'spring', stiffness: 170, damping: 24, delay: (tokens ? i : swatches.length - i) * 0.0016 } }} />
            );
          })}
        </LayoutGroup>
        {tokens && TOKENS.map((t, ti) => (
          <motion.span key={t.name} className={s.name} aria-hidden="true"
            style={{ '--c': (ti % COLS) + 1, '--r': Math.floor(ti / COLS) + 1, '--cm': (ti % COLS_M) + 1, '--rm': Math.floor(ti / COLS_M) + 1 } as React.CSSProperties}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + ti * 0.02, duration: 0.35 }}>
            <b>{t.name}</b><span>×{t.count}</span>
          </motion.span>
        ))}
      </div>

      <figcaption className={s.cap} aria-live="polite">
        {tokens
          ? `24 tokens, uno por rol, adoptados por los cuatro desarrolladores front. Cada ficha absorbe sus variantes casi idénticas.`
          : `267 valores de color en uso en el monorepo: el mismo gris escrito de veinte maneras.`}
        <span className={s.note}> Reparto ilustrativo; los totales son los de la auditoría.</span>
      </figcaption>
    </figure>
  );
}
