'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import s from './ScaleIn.module.css';

/* Crece desde `from` hasta 1 mientras entra en pantalla (scrub). Sin permiso
   de motion se pinta a escala 1 y no toca nada. */
export default function ScaleIn({ from = 0.5, children, className = '' }: { from?: number; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !scrollEffectsAllowed()) return;
    const tween = gsap.fromTo(el, { scale: from }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 25%', scrub: 0.6 } });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); };
  }, [from]);
  return <div ref={ref} className={`${s.box} ${className}`}>{children}</div>;
}
