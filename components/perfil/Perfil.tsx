'use client';

import { useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { useSectionReveal } from '@/components/effects/neat';
import Cabecera from './Cabecera';
import Quien from './Quien';
import Fuerte from './Fuerte';
import FormaTrabajo from './FormaTrabajo';
import Competencias from './Competencias';
import Contacto from '@/components/Contacto';

export default function Perfil() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (isLight()) gsap.from('.fade', { opacity: 0, y: 12, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
    else gsap.from('.fade', { opacity: 0, y: 24, filter: 'blur(8px)', duration: 1, stagger: 0.1, ease: 'power3.out' });
    setReady(true);
  }, []);
  useSectionReveal(ready);
  return (
    <div className="page">
      <Cabecera />
      <Quien />
      <Fuerte />
      <FormaTrabajo />
      <Competencias />
      <Contacto variant="perfil" />
    </div>
  );
}
