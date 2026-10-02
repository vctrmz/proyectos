import Image from 'next/image';
import Frame from '@/components/ui/Frame';
import Diagram from '@/components/diagrams/Diagram';
import Reveal from '@/components/motion/Reveal';
import { shotSize } from '@/lib/content/shots';
import type { Decision } from '@/lib/content/cases';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './case.module.css';
/* `span` pone la decisión como tarjeta de la rejilla bento, ocupando esas
   columnas de seis. Sin él, es el bloque de siempre, a lo ancho. */
export default function DecisionBlock({ d, brand, locale = DEFAULT_LOCALE, span }: { d: Decision; brand: string; locale?: Locale; span?: 2 | 4 | 6 }) {
  const t = getUi(locale).case;
  let media: React.ReactNode = null;
  if (d.figure && 'shot' in d.figure) { const z = shotSize(d.figure.shot.src); media = <Frame brand={brand} glow ratio="4/3"><Image src={d.figure.shot.src} alt={d.figure.shot.alt} width={z.width} height={z.height} sizes="(max-width: 900px) 100vw, 640px" /></Frame>; }
  else if (d.figure && 'diagram' in d.figure) media = <Diagram id={d.figure.diagram} />;
  return (
    <Reveal className={span ? `${s.card} ${s['span' + span]} ${media ? s.cardMedia : ''}` : s.decision}>
      <div>
        <h3>{d.title}</h3>
        <p><strong>{t.why}</strong> {d.why}</p>
        <p><strong>{t.changed}</strong> {d.changed}</p>
        {/* Las dos honestidades: lo que costó la decisión y lo que hoy haría
            distinto. Van aparte porque es lo que un lead busca leer. */}
        {d.tradeoff && <p className={s.tradeoff}><span>{t.tradeoff}</span>{d.tradeoff}</p>}
        {d.wouldFix && <p className={s.wouldFix}><span>{t.wouldFix}</span>{d.wouldFix}</p>}
      </div>
      {media}
    </Reveal>
  );
}
