'use client';
import { useEffect, useRef } from 'react';
import { addFrame, removeFrame } from '@/lib/motion/raf';
import { motionAllowed } from '@/lib/motion/prefs';
import s from './GlitchText.module.css';

const CHARS = '.,·-─~+:;=*≡┐┌┘┴┬║░▒▓█▄▀▌▐■!?&#$@0123456789';
const WAVE_MS = 900;      // lo que tarda una onda en recorrer el texto
const WAVE_EVERY = 110;   // cada cuánto nace una onda mientras el cursor está encima
const FRONT = 3;          // ancho del frente de la onda, en caracteres

type Props = { text: string; className?: string };

/* Ondas de caracteres que recorren el texto al pasar el cursor: nacen en la
   letra señalada y se abren a los lados, mezclando glifos y devolviendo cada
   letra a su sitio al pasar. Sirve para fijar la mirada en una frase: el texto
   real vive en un span propio para lectores y buscadores, y la capa mezclada
   es decorativa. Sin permiso de motion no se monta nada.

   El reloj es el bucle compartido de lib/motion/raf: una sola fuente de tiempo
   para todas las frases, en lugar de un rAF por instancia. */
export default function GlitchText({ text, className = '' }: Props) {
  const host = useRef<HTMLSpanElement>(null);
  const fx = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = host.current;
    const out = fx.current;
    if (!el || !out || !motionAllowed()) return;

    const chars = [...text];
    let waves: { pos: number; t0: number }[] = [];
    let hover = false, lastSpawn = -Infinity, ticking = false, dirty = false;

    const tick = (now: number) => {
      waves = waves.filter((w) => now - w.t0 < WAVE_MS);
      if (!waves.length) {
        if (dirty) { out.textContent = text; dirty = false; }
        if (!hover) { removeFrame(tick); ticking = false; }
        return;
      }
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

    const spawn = (clientX: number) => {
      const now = performance.now();
      if (now - lastSpawn < WAVE_EVERY) return;
      lastSpawn = now;
      const box = el.getBoundingClientRect();
      const rel = box.width ? (clientX - box.left) / box.width : 0.5;
      waves.push({ pos: Math.max(0, Math.min(chars.length - 1, Math.round(rel * chars.length))), t0: now });
      if (!ticking) { addFrame(tick); ticking = true; }
      tick(now);
    };

    const enter = (e: PointerEvent) => { hover = true; spawn(e.clientX); };
    const move = (e: PointerEvent) => { if (hover) spawn(e.clientX); };
    const leave = () => { hover = false; };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      if (ticking) removeFrame(tick);
      out.textContent = text;
    };
  }, [text]);

  return (
    <span ref={host} className={`${s.host} ${className}`}>
      <span className="visually-hidden">{text}</span>
      <span ref={fx} aria-hidden="true" className={s.fx}>{text}</span>
    </span>
  );
}
