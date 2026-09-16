'use client';

import { useState } from 'react';
import Loader from '@/components/Loader';
import Hero from './Hero';
import Trabajo from './Trabajo';
import UsoIA from './UsoIA';
import Logos from './Logos';
import Sectores from './Sectores';
import Contacto from '@/components/Contacto';
import CasoModal from './CasoModal';
import { useAfterIntro, useSectionReveal } from '@/components/effects/neat';

export default function Home() {
  const [box, setBox] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  useAfterIntro(() => setReady(true));
  useSectionReveal(ready);
  return (
    <div className="page">
      <Loader />
      <Hero />
      <Trabajo onOpen={setBox} />
      <UsoIA />
      <Logos />
      <Sectores onOpen={setBox} />
      <Contacto variant="home" />
      <CasoModal index={box} onClose={() => setBox(null)} onOpen={setBox} />
    </div>
  );
}
