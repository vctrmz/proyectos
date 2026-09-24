'use client';
import { useEffect, useRef, useState } from 'react';
import { motionAllowed } from '@/lib/motion/prefs';
import s from './rolling.module.css';

/* Cifras que ruedan al entrar en pantalla, como un odómetro: cada dígito da
   una vuelta y aterriza en el suyo, con un desfase por posición. Una sola vez
   por visita.

   Reglas que respeta:
   - El valor real se pinta en el servidor, así que sin JS —o con
     prefers-reduced-motion— se lee la cifra tal cual, quieta.
   - La capa que rueda es decorativa (aria-hidden) y el valor accesible va en
     un span propio: un lector de pantalla oye «165», no diez dígitos.
   - Los dígitos usan cifras tabulares, así que rodar no cambia el ancho y
     nada se mueve alrededor.

   Acepta cualquier cadena: rueda los tramos de dígitos y deja quieto el resto
   («60 → 14», «267 → 24», «3 · 6» funcionan sin tocar el contenido). */
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function RollingNumber({ value, className = '' }: { value: string; className?: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const [fx, setFx] = useState(false);   // ¿montamos la versión que rueda?
  const [run, setRun] = useState(false); // ¿ya entró en pantalla?

  useEffect(() => { setFx(motionAllowed() && typeof IntersectionObserver !== 'undefined'); }, []);

  useEffect(() => {
    const el = host.current;
    if (!el || !fx) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setRun(true);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [fx]);

  if (!fx) return <span className={className}>{value}</span>;

  const chars = [...value];
  let digitIndex = -1;
  return (
    <span ref={host} className={`${s.wrap} ${className}`}>
      <span className="visually-hidden">{value}</span>
      <span aria-hidden="true" className={s.reelRow}>
        {chars.map((ch, i) => {
          if (!/[0-9]/.test(ch)) return <span key={i} className={s.static}>{ch}</span>;
          digitIndex += 1;
          const d = Number(ch);
          /* Una vuelta completa antes de aterrizar: la tira lleva los dígitos
             dos veces y el destino es la segunda pasada. */
          const target = run ? 10 + d : 0;
          return (
            <span key={i} className={s.col}>
              <span className={s.reel} style={{ transform: `translateY(-${target}em)`, transitionDelay: `${digitIndex * 70}ms` }}>
                {[...DIGITS, ...DIGITS].map((n, j) => <span key={j} className={s.digit}>{n}</span>)}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
