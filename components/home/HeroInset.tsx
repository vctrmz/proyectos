import Image from 'next/image';
import Inset from '@/components/ui/Inset';
import ScaleIn from '@/components/motion/ScaleIn';
import { getProject } from '@/lib/content/projects';
import { shotSize } from '@/lib/content/shots';
import s from './HeroInset.module.css';

export default function HeroInset() {
  const p = getProject('hermes')!;
  const size = shotSize(p.image!.src);
  return (
    <div className={s.wrap}>
      <ScaleIn from={0.6}>
        <Inset className={s.inset}>
          <div className={s.img}><Image src={p.image!.src} alt={p.image!.alt} width={size.width} height={size.height} priority sizes="100vw" /></div>
          <p className={s.cap}>HERMES · {p.years} · en producción</p>
        </Inset>
      </ScaleIn>
    </div>
  );
}
