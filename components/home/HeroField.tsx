'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import s from './Hero.module.css';

/* El campo de cápsulas del hero original, adaptado al fondo claro. Solo con
   puntero fino y sin reduced-motion; el script carga en idle. */
export default function HeroField() {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(scrollEffectsAllowed()); }, []);
  if (!on) return null;
  return (
    <>
      <cursor-ring-field className={s.field} colors="#4a44f2,#8bde5f,#e3e6f0" background="#ffffff" density={260} dot-size={120} speed={6} camera-distance={160} ring-radius={12} ring-width={9} push={50} turbulence={100} />
      <Script src="/effects/cursor-ring-field.js" strategy="lazyOnload" />
    </>
  );
}
