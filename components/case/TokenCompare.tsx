'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import type { TokenCompare as Datos } from '@/lib/content/cases/types';
import { motionAllowed } from '@/lib/motion/prefs';
import s from './TokenCompare.module.css';

/* Los mismos valores nombrados de dos formas, en una sola tabla que cambia de
   nombre delante de ti. Por apariencia, cada fila deja una pregunta abierta;
   por intención, el nombre la responde y el valor queda como equivalencia.
   Se leen las tres capas: propiedad del componente, token y valor.

   Al entrar en pantalla cambia sola una vez, para que el cambio se vea sin
   tener que buscarlo; si alguien ya tocó el interruptor, o pide menos
   movimiento, no. El modo actual se anuncia en una región viva. */
type Modo = 'apariencia' | 'intencion';
const ETIQUETA: Record<Modo, string> = { apariencia: 'Por apariencia', intencion: 'Por intención' };

export default function TokenCompare({ t }: { t: Datos }) {
  const base = useId();
  const [modo, setModo] = useState<Modo>('apariencia');
  const tocado = useRef(false);
  const caja = useRef<HTMLElement>(null);
  const visto = useInView(caja, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!visto || tocado.current || !motionAllowed()) return;
    const reloj = setTimeout(() => { if (!tocado.current) setModo('intencion'); }, 1600);
    return () => clearTimeout(reloj);
  }, [visto]);

  const elegir = (m: Modo) => { tocado.current = true; setModo(m); };
  const intencion = modo === 'intencion';

  return (
    <figure ref={caja} className={s.wrap}>
      <div className={s.head}>
        <h3 className={s.title}>{t.title}</h3>
        <p className={s.lead}>{t.lead}</p>
      </div>

      <div className={s.switch} role="group" aria-label="Cómo se nombran los tokens">
        {(['apariencia', 'intencion'] as Modo[]).map((m) => (
          <button key={m} type="button" aria-pressed={modo === m} className={modo === m ? s.on : undefined} onClick={() => elegir(m)}>
            {modo === m && <motion.span layoutId={`${base}-pill`} className={s.pill} transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
            <span className={s.label}>{ETIQUETA[m]}</span>
          </button>
        ))}
      </div>

      <div className={s.card}>
        <div className={s.cardHead} aria-hidden="true"><span>{ETIQUETA[modo]}</span><code>tokens.json</code></div>
        <table className={s.table}>
          <caption className="visually-hidden" aria-live="polite">{ETIQUETA[modo]}</caption>
          <thead className="visually-hidden">
            <tr><th scope="col">Propiedad</th><th scope="col">{intencion ? 'Token' : 'Valor'}</th><th scope="col">{intencion ? 'Equivale a' : 'Lo que no dice'}</th></tr>
          </thead>
          <tbody>
            {t.rows.map((r, i) => (
              <tr key={r.use}>
                <th scope="row">{r.use}</th>
                <td className={s.value}>
                  <span className={s.tok}>
                    {r.swatch ? <i className={s.swatch} style={{ background: r.swatch }} aria-hidden="true" /> : <i className={s.noSwatch} aria-hidden="true" />}
                    <span className={s.morph}>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={modo} className={intencion ? s.intent : undefined}
                          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                          transition={{ duration: 0.35, delay: i * 0.07 }}>
                          {intencion ? r.after : r.before}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </span>
                </td>
                <td className={s.note}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={modo} className={intencion ? s.equals : s.question}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}>
                      {intencion ? <><span aria-hidden="true">= </span><span className="visually-hidden">equivale a </span>{r.before}</> : r.question}
                    </motion.span>
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.note && <figcaption className={s.foot}>{t.note}</figcaption>}
    </figure>
  );
}
