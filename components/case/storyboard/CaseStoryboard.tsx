import Diagram from '@/components/diagrams/Diagram';
import CodeDemo from '@/components/ui/CodeDemo';
import { shotSize } from '@/lib/content/shots';
import type { CaseStudy, StoryFrame, StoryShot } from '@/lib/content/cases';
import type { Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import TokenCollapse from '../TokenCollapse';
import TokenCompare from '../TokenCompare';
import UiKit from '../UiKit';
import ResultBlock from '../ResultBlock';
import DrawFrame from './DrawFrame';
import ShotFrame from './ShotFrame';
import { StoryMap, StoryStrip, type MapAct } from './StoryMap';
import cs from '../case.module.css';
import s from './storyboard.module.css';

/* El caso contado como storyboard: una ficha arriba, el mapa a escala de los
   planos, una tira que sigue el plano activo y los actos con sus paneles.

   Cada panel es un paso: su fotograma, lo que pasa y, si la hay, la decisión
   que lo mueve, con el puente al plano siguiente. La forma del panel la decide
   su contenido: una pieza viva va a lo ancho, un plano con decisión pone
   fotograma y razonamiento a la par, y los planos de contexto van en fila,
   como las viñetas de un storyboard. */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
/* Las etiquetas del bloque de decisión clásico llevan punto final («Por qué.»):
   como término de una lista de definición, sin él. */
const bare = (l: string) => l.replace(/\.$/, '');
const pad = (n: number) => String(n).padStart(2, '0');
const kindOf = (f: StoryFrame) => ('draw' in f ? 'draw' : 'live' in f ? 'live' : 'shot' in f ? 'shot' : 'diagram') as 'draw' | 'live' | 'shot' | 'diagram';

/* Flecha del puente, dibujada con el mismo trazo que los fotogramas. */
const Arrow = () => (
  <svg viewBox="0 0 24 12" className={s.arrow} aria-hidden="true" focusable="false"><path d="M1 6 H21 M16 1.5 L21 6 L16 10.5" /></svg>
);

function Frame({ f, c, locale }: { f: StoryFrame; c: CaseStudy; locale: Locale }) {
  const ui = getUi(locale);
  if ('draw' in f) return <div className={s.sheet}><DrawFrame id={f.draw} alt={f.alt} /></div>;
  if ('shot' in f) { const z = shotSize(f.shot.src); return <div className={s.sheet}><ShotFrame shot={f.shot} width={z.width} height={z.height} /></div>; }
  if ('diagram' in f) return <div className={`${s.sheet} ${s.sheetDiagram}`}><Diagram id={f.diagram} /></div>;
  switch (f.live) {
    case 'token-collapse': return <TokenCollapse />;
    case 'token-compare': return c.system.tokens ? <TokenCompare t={c.system.tokens} /> : null;
    case 'code': return c.system.code ? <CodeDemo {...c.system.code} locale={locale} /> : null;
    case 'uikit': return c.system.uiKit ? <UiKit brand={c.brand} pieces={c.system.uiKit} label={ui.case.kitLabel} /> : null;
  }
}

function Panel({ x, no, c, locale, layout }: { x: StoryShot; no: string; c: CaseStudy; locale: Locale; layout: 'live' | 'split' | 'card' }) {
  const t = getUi(locale).case;
  const d = x.decision != null ? c.decisions[x.decision] : undefined;
  const kind = kindOf(x.frame);
  const head = (
    <>
      <h3 className={s.pTitle}><span className={s.pNo}>{no}</span>{x.title}</h3>
      <p className={s.action}>{x.action}</p>
    </>
  );
  const decision = d && (
    <div className={s.decision}>
      <p className={s.dHead}><i aria-hidden="true" />{t.story.decision}</p>
      <h4 className={s.dTitle}>{d.title}</h4>
      <dl className={s.dl}>
        <div><dt>{bare(t.why)}</dt><dd>{d.why}</dd></div>
        <div><dt>{bare(t.changed)}</dt><dd>{d.changed}</dd></div>
        {d.tradeoff && <div><dt>{t.tradeoff}</dt><dd>{d.tradeoff}</dd></div>}
        {d.wouldFix && <div><dt>{t.wouldFix}</dt><dd>{d.wouldFix}</dd></div>}
      </dl>
    </div>
  );
  const foot = (
    <>
      <p className={s.tags}><span>{t.story.frame[kind]}</span>{d && <span className={s.tagDec}>{t.story.decision}</span>}</p>
      {x.bridge && <p className={s.bridge}><Arrow /><span className={s.bLabel}>{t.story.bridge}</span><span>{x.bridge}</span></p>}
    </>
  );
  return (
    <article id={`p-${no}`} className={`${s.panel} ${s[layout]}`} aria-labelledby={`p-${no}-t`}>
      {layout === 'live' ? (
        <>
          <div className={s.liveText}>
            <div id={`p-${no}-t`}>{head}{foot}</div>
            {decision}
          </div>
          <div className={s.liveStage}><Frame f={x.frame} c={c} locale={locale} /></div>
        </>
      ) : (
        <>
          <div className={s.framed}><Frame f={x.frame} c={c} locale={locale} /></div>
          <div className={s.text}>
            <div id={`p-${no}-t`}>{head}</div>
            {decision}
            {foot}
          </div>
        </>
      )}
    </article>
  );
}

export default function CaseStoryboard({ c, locale }: { c: CaseStudy; locale: Locale }) {
  const ui = getUi(locale);
  const t = ui.case.story;
  const acts = c.storyboard!.acts;
  let n = 0;
  const numbered = acts.map((a) => a.shots.map((x) => ({ x, no: pad(++n) })));
  const total = n;
  const decisions = acts.flatMap((a) => a.shots).filter((x) => x.decision != null).length;
  const map: MapAct[] = acts.map((a, i) => ({
    id: `act-${i + 1}`, roman: ROMAN[i], title: a.title,
    shots: numbered[i].map(({ x, no }) => ({ id: `p-${no}`, no, title: x.title, decision: x.decision != null, kind: t.frame[kindOf(x.frame)] })),
  }));
  /* Solo cadenas: `meta` es una función y no cruza del servidor al cliente. */
  const labels = { map: t.map, mapNote: t.mapNote, rowActs: t.rowActs, rowShots: t.rowShots, rowDecision: t.rowDecision, rowFrame: t.rowFrame, act: t.act, shot: t.shot, decision: t.decision, progress: t.progress };

  return (
    <div className={s.sb}>
      <dl className={s.slate} aria-label={t.slate}>
        <div><dt>{t.company}</dt><dd>{c.company}</dd></div>
        <div><dt>{t.years}</dt><dd>{c.years}</dd></div>
        <div><dt>{t.acts}</dt><dd>{acts.length}</dd></div>
        <div><dt>{t.shots}</dt><dd>{total}</dd></div>
        <div><dt>{t.decisions}</dt><dd>{decisions}</dd></div>
      </dl>

      <StoryMap acts={map} labels={labels} />
      <StoryStrip acts={map} labels={labels} />

      {acts.map((a, i) => {
        const shots = numbered[i];
        const single = shots.length === 1;
        const dec = a.shots.filter((x) => x.decision != null).length;
        return (
          <section key={a.title} id={`act-${i + 1}`} className={s.act} aria-labelledby={`act-${i + 1}-t`}>
            <header className={s.actHead}>
              <span className={s.roman} aria-hidden="true">{ROMAN[i]}</span>
              <div>
                <h2 id={`act-${i + 1}-t`}><span className="visually-hidden">{t.act} {ROMAN[i]}: </span>{a.title}</h2>
                <p className={s.meta}>{t.meta(a.shots.length, dec)}</p>
              </div>
            </header>
            <p className={s.summary}>{a.summary}</p>
            <div className={s.panels}>
              {shots.map(({ x, no }) => (
                <Panel key={no} x={x} no={no} c={c} locale={locale}
                  layout={'live' in x.frame ? 'live' : x.decision != null || single ? 'split' : 'card'} />
              ))}
            </div>
            {i === acts.length - 1 && (
              <div className={s.close}>
                <section aria-labelledby="sb-result"><h3 id="sb-result" className={s.closeH}>{t.close}</h3><ResultBlock r={c.result} ui={ui.case} /></section>
                <section aria-labelledby="sb-learn">
                  <h3 id="sb-learn" className={s.closeH}>{t.learnings}</h3>
                  <ol className={cs.learn}>{c.learnings.map((l, k) => (
                    <li key={l.slice(0, 24)}><span className={cs.learnN} aria-hidden="true">{pad(k + 1)}</span>{l}</li>
                  ))}</ol>
                </section>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
