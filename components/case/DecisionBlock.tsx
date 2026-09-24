import Image from 'next/image';
import Frame from '@/components/ui/Frame';
import Diagram from '@/components/diagrams/Diagram';
import Reveal from '@/components/motion/Reveal';
import { shotSize } from '@/lib/content/shots';
import type { Decision } from '@/lib/content/cases';
import s from './case.module.css';
export default function DecisionBlock({ d, brand }: { d: Decision; brand: string }) {
  let media: React.ReactNode = null;
  if (d.figure && 'shot' in d.figure) { const z = shotSize(d.figure.shot.src); media = <Frame brand={brand} glow ratio="4/3"><Image src={d.figure.shot.src} alt={d.figure.shot.alt} width={z.width} height={z.height} sizes="(max-width: 900px) 100vw, 640px" /></Frame>; }
  else if (d.figure && 'diagram' in d.figure) media = <Diagram id={d.figure.diagram} />;
  return (
    <Reveal className={s.decision}>
      <div>
        <h3>{d.title}</h3>
        <p><strong>Por qué.</strong> {d.why}</p>
        <p><strong>Qué cambió.</strong> {d.changed}</p>
        {/* Las dos honestidades: lo que costó la decisión y lo que hoy haría
            distinto. Van aparte porque es lo que un lead busca leer. */}
        {d.tradeoff && <p className={s.tradeoff}><span>Contrapartida asumida</span>{d.tradeoff}</p>}
        {d.wouldFix && <p className={s.wouldFix}><span>Lo que corregiría</span>{d.wouldFix}</p>}
      </div>
      {media}
    </Reveal>
  );
}
