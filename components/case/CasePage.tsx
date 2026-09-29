import Link from 'next/link';
import { ViewTransition } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Diagram from '@/components/diagrams/Diagram';
import CodeDemo from '@/components/ui/CodeDemo';
import Disclosure from '@/components/ui/Disclosure';
import Figure from '@/components/ui/Figure';
import JsonLd from '@/components/seo/JsonLd';
import { SITE } from '@/lib/content/site';
import { getProject } from '@/lib/content/projects';
import { tagIn } from '@/lib/content/en';
import { DEFAULT_LOCALE, ROUTES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import { shotSize } from '@/lib/content/shots';
import type { CaseStudy } from '@/lib/content/cases';
import CaseNav from './CaseNav';
import DecisionBlock from './DecisionBlock';
import ResultBlock from './ResultBlock';
import NextCase from './NextCase';
import UiKit from './UiKit';
import { ChallengeGrid, AudienceGrid, FlowList, FindingsTable } from './CaseBlocks';
import s from './case.module.css';

/* La página de caso se lee como un documento numerado: el índice de la
   izquierda dice de cuántas partes consta y por dónde vas, y cada sección
   lleva su número. Las secciones opcionales —reto, audiencias, flujos y
   hallazgos— solo existen si el caso las trae, así que el índice se construye
   del contenido, no de una lista fija. */
export default function CasePage({ c, locale = DEFAULT_LOCALE }: { c: CaseStudy; locale?: Locale }) {
  const p = getProject(c.slug)!;
  const ui = getUi(locale);
  const r = ROUTES[locale];
  const L = (id: string, fallback: string) => ui.case.sections[id] ?? fallback;
  const sections: { id: string; label: string; node: React.ReactNode }[] = [
    { id: 'c-problema', label: L('c-problema', 'Problema'), node: (
      <>
        <p>{c.problem[0]}</p>
        <p>{c.problem[1]}</p>
      </>
    ) },
    ...(c.challenge ? [{ id: 'c-reto', label: L('c-reto', 'El reto'), node: <ChallengeGrid items={c.challenge.items} /> }] : []),
    { id: 'c-complejidad', label: L('c-complejidad', 'Complejidad'), node: <Diagram id={c.complexity.diagram} caption={c.complexity.caption} /> },
    ...(c.audiences ? [{ id: 'c-audiencias', label: L('c-audiencias', 'Audiencias'), node: <AudienceGrid items={c.audiences.items} /> }] : []),
    { id: 'c-decisiones', label: L('c-decisiones', 'Decisiones'), node: <>{c.decisions.map((d) => <DecisionBlock key={d.title} d={d} brand={c.brand} locale={locale} />)}</> },
    ...(c.flows ? [{ id: 'c-flujos', label: L('c-flujos', 'Flujos'), node: (
      <>
        {c.flows.caption && <p className={s.lead}>{c.flows.caption}</p>}
        <FlowList list={c.flows.list} />
      </>
    ) }] : []),
    { id: 'c-sistema', label: L('c-sistema', 'Sistema'), node: (
      <Disclosure title={ui.case.systemToggle} defaultOpen>
        <div className={s.body}>{c.system.body.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div>
        {c.system.code && <CodeDemo {...c.system.code} locale={locale} />}
        {c.system.uiKit && <UiKit brand={c.brand} pieces={c.system.uiKit} label={ui.case.kitLabel} />}
      </Disclosure>
    ) },
    { id: 'c-diseno', label: L('c-diseno', 'Diseño'), node: (
      <div className={s.gallery}>
        {c.design.map((d) => { const z = shotSize(d.src); return <Figure key={d.src + d.caption} src={d.src} alt={d.alt} caption={d.caption} width={z.width} height={z.height} />; })}
      </div>
    ) },
    ...(c.findings ? [{ id: 'c-hallazgos', label: L('c-hallazgos', 'Hallazgos'), node: (
      <>
        {c.findings.caption && <p className={s.lead}>{c.findings.caption}</p>}
        <FindingsTable items={c.findings.items} ui={{ findings: ui.case.findings, severity: ui.case.severity }} />
      </>
    ) }] : []),
    { id: 'c-impl', label: L('c-impl', 'Implementación'), node: (
      <Disclosure title={ui.case.implToggle} defaultOpen>
        <div className={s.body}>{c.implementation.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div>
      </Disclosure>
    ) },
    { id: 'c-resultado', label: L('c-resultado', 'Resultado'), node: <ResultBlock r={c.result} ui={ui.case} /> },
    { id: 'c-apr', label: L('c-apr', 'Aprendizajes'), node: (
      <ol className={s.learn}>{c.learnings.map((l, i) => (
        <li key={l.slice(0, 24)}><span className={s.learnN} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{l}</li>
      ))}</ol>
    ) },
  ];

  const titleOf = (id: string, label: string) => {
    const n = sections.findIndex((x) => x.id === id) + 1;
    return <h2 id={id}><span className={s.secN} aria-hidden="true">{String(n).padStart(2, '0')}</span>{label}</h2>;
  };

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: c.title, description: c.tagline, author: { '@type': 'Person', name: SITE.name }, url: `${SITE.url}/${locale}/cases/${c.slug}`, dateCreated: c.years.slice(0, 4) }} />
      <SiteHeader />
      <main id="contenido">
        <div className={`container ${s.top}`}>
          <Link href={r.work} className={s.back}>{ui.case.back}</Link>
          <ViewTransition name={`case-${c.slug}`}><div className={s.head}>
            <h1 className={s.title}><img src={p.logo} alt="" className={s.icon} />{c.title} · {c.company}</h1>
            <p className={s.tagline}>{c.tagline}</p>
            <p className={s.tags}>{c.tags.map((t) => <span key={t}>{tagIn(locale, t)}</span>)}<span>{c.years}</span></p>
          </div></ViewTransition>
        </div>
        <div className="container">
          <div className={s.cols}><div><h2>{ui.case.context}</h2><p>{c.context}</p></div><div><h2>{ui.case.role}</h2><p>{c.role}</p></div><div><h2>{ui.case.delivery}</h2><p>{c.delivery}</p></div></div>
          <div className={s.doc}>
            <CaseNav items={sections.map(({ id, label }) => ({ id, label }))} label={ui.case.index} heading={ui.case.parts(sections.length)} />
            <div className={s.stream}>
              {sections.map(({ id, label, node }) => (
                <section key={id} className={`${s.sec} ${id === 'c-problema' ? s.problem : ''}`} aria-labelledby={id}>
                  {titleOf(id, label)}
                  {node}
                </section>
              ))}
            </div>
          </div>
          <NextCase slug={c.next} locale={locale} />
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
