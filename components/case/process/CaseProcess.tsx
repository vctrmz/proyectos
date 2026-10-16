import Image from 'next/image';
import { shotSize } from '@/lib/content/shots';
import type { CaseProcess as Process } from '@/lib/content/cases/process';
import type { Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import { fit } from './wire';
import Sheet from './Sheet';
import Evolve from './Evolve';
import { BenchArt, BriefArt, FlowArt, IdeasArt, seedOf } from './drawings';
import s from './process.module.css';

/* El proceso del caso, repartido por las fases del film del caso:
   - Discover: requisitos, benchmark e ideas, en fila, como las viñetas de una
     reunión (ProcessDiscover).
   - Develop: la misma pantalla del boceto al producto (ProcessEvolve).
   - Deliver: el flujo que se entregó a desarrollo (ProcessHandover).
   Cada fotograma dice qué es: reconstrucción dibujada, material original o
   producto real. */
type Props = { slug: string; p: Process; locale: Locale };
const geo = (p: Process) => {
  const z = shotSize(p.evolve.shot.src);
  const aspect = z.width / z.height;
  return { z, aspect, r: fit(aspect, { x: 6, y: 6, w: 148, h: 88 }) };
};
function Tag({ kind, locale }: { kind: 'rebuilt' | 'original' | 'real'; locale: Locale }) {
  const t = getUi(locale).case.process;
  return <span className={s.chip} data-kind={kind}>{kind === 'rebuilt' ? t.rebuilt : kind === 'original' ? t.original : t.real}</span>;
}

export function ProcessDiscover({ slug, p, locale }: Props) {
  const t = getUi(locale).case.process;
  const { aspect } = geo(p);
  const seed = seedOf(slug);
  const uid = `pr-${slug}`;
  const steps = [
    { title: t.steps.brief, text: p.brief, art: <Sheet id={`${uid}-b`} alt={t.alt.brief}><BriefArt seed={seed} /></Sheet> },
    { title: t.steps.bench, text: p.bench, art: <Sheet id={`${uid}-bn`} alt={t.alt.bench}><BenchArt boxes={p.evolve.wire} aspect={aspect} seed={seed} uid={`${uid}-bn`} /></Sheet> },
    { title: t.steps.ideas, text: p.ideas, art: <Sheet id={`${uid}-i`} alt={t.alt.ideas}><IdeasArt seed={seed} /></Sheet> },
  ];
  return (
    <div className={s.wrap}>
      <p className={s.lead}>{t.lead}</p>
      <ol className={s.steps}>
        {steps.map((st) => (
          <li key={st.title} className={s.step}>
            <div className={s.frame}>{st.art}</div>
            <h3 className={s.stepTitle}>{st.title}</h3>
            <p className={s.text}>{st.text}</p>
            <Tag kind="rebuilt" locale={locale} />
          </li>
        ))}
      </ol>
      <p className={s.note}>{t.note}</p>
    </div>
  );
}

export function ProcessEvolve({ slug, p, locale }: Props) {
  const t = getUi(locale).case.process;
  const { z, r } = geo(p);
  return (
    <div className={s.wrap}>
      <p className={s.lead}>{p.evolve.text}</p>
      {/* El contorno de la pantalla va primero: el boceto empieza por el marco. */}
      <Evolve id={`pr-${slug}`} boxes={[['frame', 0, 0, 100, 100], ...p.evolve.wire]} r={r}
        shot={{ src: p.evolve.shot.src, alt: p.evolve.shot.alt, width: z.width, height: z.height }}
        labels={{ phase: t.phase, states: t.states, rebuilt: t.rebuilt, real: t.real, alt: { sketch: t.alt.sketch, wire: t.alt.wire } }} />
    </div>
  );
}

export function ProcessHandover({ slug, p, locale }: Props) {
  const t = getUi(locale).case.process;
  const { aspect } = geo(p);
  const hz = p.handoff.shot ? shotSize(p.handoff.shot.src) : null;
  const uid = `pr-${slug}-h`;
  return (
    <div className={s.split}>
      <div className={s.frame} data-shot={p.handoff.shot ? 'true' : undefined}>
        {p.handoff.shot && hz
          ? <a href={p.handoff.shot.src} target="_blank" rel="noopener" className={s.open} aria-label={`${p.handoff.shot.alt}. ${t.open}`}>
              <Image src={p.handoff.shot.src} alt="" width={hz.width} height={hz.height} sizes="(max-width: 900px) 100vw, 760px" className={s.handoffShot} />
              <span className={s.openHint} aria-hidden="true">{t.open} ↗</span>
            </a>
          : <Sheet id={uid} alt={t.alt.handoff}><FlowArt boxes={p.evolve.wire} aspect={aspect} uid={uid} /></Sheet>}
      </div>
      <div className={s.step}>
        <p className={s.text}>{p.handoff.text}</p>
        <Tag kind={p.handoff.shot ? 'original' : 'rebuilt'} locale={locale} />
      </div>
    </div>
  );
}
