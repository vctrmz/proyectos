'use client';
import { useEffect, useRef } from 'react';
import { addFrame, removeFrame } from '@/lib/motion/raf';
import { motionAllowed } from '@/lib/motion/prefs';
import s from './GlitchText.module.css';

/* Glifos estrechos y de ancho parecido: los bloques (█▓▒░) eran los que más
   ensanchaban la línea al entrar. */
const CHARS = '!<>-_/\\[]{}=+*^?#~:;·';
const WAVE_MS = 1200;     // lo que tarda una onda en recorrer el texto
const FRONT = 2;          // ancho del frente de la onda, en caracteres
const STEP_MS = 45;       // cada cuánto se repinta: a 60 fps el cambio se vuelve ruido

type Props = { text: string; className?: string; trigger?: 'hover' | 'scroll' };

/* Una onda de caracteres recorre el texto: nace en un punto, se abre a los
   lados mezclando glifos y devuelve cada letra a su sitio al pasar. Siempre
   una sola onda; el bucle de animación se apaga en cuanto termina.

   Dos disparadores:
   - 'hover' (frases largas, el manifiesto): nace donde entra el cursor y se
     puede repetir saliendo y volviendo a entrar.
   - 'scroll' (por defecto, titulares): nace una vez, cuando el titular entra
     en pantalla, y no vuelve a ocurrir en esa visita. Así el gesto no persigue
     al cursor por toda la web.

   El texto real vive en su propio span para lectores y buscadores; la capa
   mezclada es decorativa. Sin permiso de motion no se monta nada. El reloj es
   el bucle compartido de lib/motion/raf: una sola fuente de tiempo. */
export default function GlitchText({ text, className = '', trigger = 'scroll' }: Props) {
  const host = useRef<HTMLSpanElement>(null);
  const fx = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = host.current;
    const out = fx.current;
    if (!el || !out || !motionAllowed()) return;

    const chars = [...text];
    let waves: { pos: number; t0: number }[] = [];
    let ticking = false, dirty = false, lastPaint = 0;

    const tick = (now: number) => {
      waves = waves.filter((w) => now - w.t0 < WAVE_MS);
      if (!waves.length) {
        if (dirty) { out.textContent = text; dirty = false; }
        removeFrame(tick); ticking = false;
        return;
      }
      if (now - lastPaint < STEP_MS) return;
      lastPaint = now;
      out.textContent = chars.map((ch, i) => {
        if (ch === ' ') return ch;
        for (const w of waves) {
          const reach = ((now - w.t0) / WAVE_MS) * chars.length;
          const d = Math.abs(i - w.pos);
          if (d <= reach && d > reach - FRONT) return CHARS[(Math.random() * CHARS.length) | 0];
        }
        return ch;
      }).join('');
      dirty = true;
    };

    /* Lanza la única onda desde una posición relativa (0 = primera letra). */
    const spawn = (rel: number) => {
      if (waves.length) return;
      const now = performance.now();
      waves.push({ pos: Math.max(0, Math.min(chars.length - 1, Math.round(rel * chars.length))), t0: now });
      if (!ticking) { addFrame(tick); ticking = true; }
      tick(now);
    };

    if (trigger === 'hover') {
      const enter = (e: PointerEvent) => {
        const box = el.getBoundingClientRect();
        spawn(box.width ? (e.clientX - box.left) / box.width : 0.5);
      };
      el.addEventListener('pointerenter', enter);
      return () => {
        el.removeEventListener('pointerenter', enter);
        if (ticking) removeFrame(tick);
        out.textContent = text;
      };
    }

    /* Una vez al entrar en pantalla: el observador se desconecta al disparar,
       así que no hay nada escuchando el resto de la visita. */
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((x) => x.isIntersecting)) return;
      io.disconnect();
      spawn(0);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      if (ticking) removeFrame(tick);
      out.textContent = text;
    };
  }, [text, trigger]);

  /* El texto real va en flujo pero transparente: es el que ocupa sitio, el que
     leen buscadores y lectores de pantalla, y el que se copia. La mezcla se
     pinta encima en absoluto, así que ningún glifo ancho puede reflotar la
     línea ni empujar lo que viene debajo. */
  return (
    <span ref={host} className={`${s.host} ${className}`}>
      <span data-real className={s.ghost}>{text}</span>
      <span ref={fx} aria-hidden="true" className={s.fx}>{text}</span>
    </span>
  );
}
