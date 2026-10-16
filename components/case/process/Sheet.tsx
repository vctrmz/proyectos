'use client';
import { useRef } from 'react';
import { useDrawOn } from './useDrawOn';
import s from './process.module.css';

/* La hoja de un dibujo reconstruido: papel con retícula de puntos, un temblor
   de mano (feTurbulence + feDisplacementMap) y el trazado al entrar en
   pantalla. `id` viene del servidor para que los rellenos rayados del dibujo
   apunten a su propio patrón. */
export default function Sheet({ id, alt, children, draw = true }: { id: string; alt: string; children: React.ReactNode; draw?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useDrawOn(ref, draw);
  return (
    <svg ref={ref} viewBox="0 0 160 100" className={s.sketch} role="img" aria-label={alt}>
      <defs>
        <filter id={`${id}-r`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="0.9" />
        </filter>
        <pattern id={`${id}-h`} width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V2.4" className={s.hatch} />
        </pattern>
        <pattern id={`${id}-g`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.28" className={s.gridDot} />
        </pattern>
      </defs>
      <rect width="160" height="100" fill={`url(#${id}-g)`} />
      <g filter={`url(#${id}-r)`}>{children}</g>
    </svg>
  );
}
