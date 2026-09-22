import Image from 'next/image';
import { ViewTransition } from 'react';
import Inset from '@/components/ui/Inset';
import ScaleIn from '@/components/motion/ScaleIn';
import { shotSize } from '@/lib/content/shots';
import type { Shot } from '@/lib/content/cases';
import s from './case.module.css';
export default function CaseHero({ slug, hero }: { slug: string; hero: Shot }) {
  const size = shotSize(hero.src);
  return (
    <ScaleIn from={0.85}>
      <ViewTransition name={`case-${slug}`}>
        <Inset className={s.heroInset}><div className={s.heroImg}><Image src={hero.src} alt={hero.alt} width={size.width} height={size.height} priority sizes="100vw" /></div></Inset>
      </ViewTransition>
    </ScaleIn>
  );
}
