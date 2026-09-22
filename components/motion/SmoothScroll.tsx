'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import { setLenis } from '@/lib/motion/lenisStore';

/* Inercia de scroll solo con puntero fino y sin reduced-motion. Lenis avisa
   a ScrollTrigger en cada frame y GSAP lleva el reloj. */
export default function SmoothScroll() {
  useEffect(() => {
    if (!scrollEffectsAllowed()) return;
    const lenis = new Lenis({ lerp: 0.1 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); setLenis(null); };
  }, []);
  return null;
}
