import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Diagram from '@/components/diagrams/Diagram';
import CodeDemo from '@/components/ui/CodeDemo';
import Disclosure from '@/components/ui/Disclosure';
import Figure from '@/components/ui/Figure';
import JsonLd from '@/components/seo/JsonLd';
import { SITE } from '@/lib/content/site';
import { getProject } from '@/lib/content/projects';
import { shotSize } from '@/lib/content/shots';
import type { CaseStudy } from '@/lib/content/cases';
import CaseHero from './CaseHero';
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
export default function CasePage({ c }: { c: CaseStudy }) {
  const p = getProject(c.slug)!;
  const sections: { id: string; label: string; node: React.ReactNode }[] = [
    { id: 'c-problema', label: 'Problema', node: (
      <>
        <p>{c.problem[0]}</p>
        <p>{c.problem[1]}</p>
      </>
    ) },
    ...(c.challenge ? [{ id: 'c-reto', label: 'El reto', node: <ChallengeGrid items={c.challenge.items} /> }] : []),
    { id: 'c-complejidad', label: 'Complejidad', node: <Diagram id={c.complexity.diagram} caption={c.complexity.caption} /> },
    ...(c.audiences ? [{ id: 'c-audiencias', label: 'Audiencias', node: <AudienceGrid items={c.audiences.items} /> }] : []),
    { id: 'c-decisiones', label: 'Decisiones', node: <>{c.decisions.map((d) => <DecisionBlock key={d.title} d={d} brand={c.brand} />)}</> },
    ...(c.flows ? [{ id: 'c-flujos', label: 'Flujos', node: (
      <>
        {c.flows.caption && <p className={s.lead}>{c.flows.caption}</p>}
        <FlowList list={c.flows.list} />
      </>
    ) }] : []),
    { id: 'c-sistema', label: 'Sistema', node: (
      <Disclosure title="Tokens, componentes y reglas" defaultOpen>
        <div className={s.body}>{c.system.body.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div>
        {c.system.code && <CodeDemo {...c.system.code} />}
        {c.system.uiKit && <UiKit brand={c.brand} pieces={c.system.uiKit} />}
      </Disclosure>
    ) },
    { id: 'c-diseno', label: 'Diseño', node: (
      <div className={s.gallery}>
        {c.design.map((d) => { const z = shotSize(d.src); return <Figure key={d.src + d.caption} src={d.src} alt={d.alt} caption={d.caption} width={z.width} height={z.height} sizes="(max-width: 900px) 100vw, 580px" />; })}
      </div>
    ) },
    ...(c.findings ? [{ id: 'c-hallazgos', label: 'Hallazgos', node: (
      <>
        {c.findings.caption && <p className={s.lead}>{c.findings.caption}</p>}
        <FindingsTable items={c.findings.items} />
      </>
    ) }] : []),
    { id: 'c-impl', label: 'Implementación', node: (
      <Disclosure title="Cómo llegó a producción" defaultOpen>
        <div className={s.body}>{c.implementation.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div>
      </Disclosure>
    ) },
    { id: 'c-resultado', label: 'Resultado', node: <ResultBlock r={c.result} /> },
    { id: 'c-apr', label: 'Aprendizajes', node: (
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
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: c.title, description: c.tagline, author: { '@type': 'Person', name: SITE.name }, url: `${SITE.url}/casos/${c.slug}`, dateCreated: c.years.slice(0, 4) }} />
      <SiteHeader />
      <main id="contenido">
        <div className={`container ${s.top}`}>
          <Link href="/#trabajo" className={s.back}>← Trabajo</Link>
          <div className={s.head}>
            <h1 className={s.title}><img src={p.logo} alt="" className={s.icon} />{c.title} · {c.company}</h1>
            <p className={s.tagline}>{c.tagline}</p>
            <p className={s.tags}>{c.tags.map((t) => <span key={t}>{t}</span>)}<span>{c.years}</span></p>
            {/* Si el producto está en línea, el enlace es la evidencia más corta. */}
            {p.url && <p><a href={p.url} target="_blank" rel="noopener" className={s.live}>Ver en producción <span aria-hidden="true">↗</span></a></p>}
          </div>
        </div>
        <CaseHero slug={c.slug} hero={c.hero} />
        <div className="container">
          <div className={s.cols}><div><h2>Contexto</h2><p>{c.context}</p></div><div><h2>Rol</h2><p>{c.role}</p></div><div><h2>Entrega</h2><p>{c.delivery}</p></div></div>
          <div className={s.doc}>
            <CaseNav items={sections.map(({ id, label }) => ({ id, label }))} />
            <div className={s.stream}>
              {sections.map(({ id, label, node }) => (
                <section key={id} className={`${s.sec} ${id === 'c-problema' ? s.problem : ''}`} aria-labelledby={id}>
                  {titleOf(id, label)}
                  {node}
                </section>
              ))}
            </div>
          </div>
          <NextCase slug={c.next} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
