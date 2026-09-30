'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { motionAllowed } from '@/lib/motion/prefs';
import s from './StarfieldButton.module.css';

type Props = { label: string; href: string; external?: boolean; size?: 'md' | 'lg'; className?: string };

/* El botón con la luz recorriendo el borde y la retícula de píxeles al pasar
   (el mismo "Escríbeme" del portfolio anterior), adaptado al tema claro.
   Debajo hay siempre un <a> real: es el que navega y recibe el foco, así que
   sin JS, sin motion o si el custom element no define, el botón sigue siendo
   un enlace normal. El efecto es decorativo. */
export default function StarfieldButton({ label, href, external, size = 'md', className = '' }: Props) {
  const [fx, setFx] = useState(false);
  useEffect(() => { setFx(motionAllowed()); }, []);
  const pad = size === 'lg' ? '0px 28px' : '0px 22px';
  const font = size === 'lg' ? 16 : 14.5;
  return (
    <span className={`${s.wrap} ${size === 'lg' ? s.lg : ''} ${fx ? s.hasFx : ''} ${className}`}>
      {external
        ? <a href={href} target="_blank" rel="noopener" className={s.link}>{label} <span aria-hidden="true">↗</span></a>
        : <Link href={href} className={s.link}>{label}</Link>}
      {fx && (
        <>
          {/* inert: el custom element pinta su propio botón y el foco no puede
              caer dentro de una capa aria-hidden. */}
          <span className={s.fx} aria-hidden="true" inert>
          <starfield-button
            label={external ? `${label} ↗` : label}
            accent="#8bde5f"
            fill="#121317"
            text-color="#ffffff"
            border-color="#121317"
            rounded={100}
            padding={pad}
            font-size={font}
            light-size={92}
            light-thickness={2}
            speed={55}
            pixel-size={4}
            pixel-density={48}
            glow-size={16}
          />
          </span>
          <Script src="/effects/starfield-button.js" strategy="lazyOnload" />
        </>
      )}
    </span>
  );
}
