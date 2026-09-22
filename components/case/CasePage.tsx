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
import DecisionBlock from './DecisionBlock';
import ResultBlock from './ResultBlock';
import NextCase from './NextCase';
import s from './case.module.css';

export default function CasePage({ c }: { c: CaseStudy }) {
  const p = getProject(c.slug)!;
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
          </div>
        </div>
        <CaseHero slug={c.slug} hero={c.hero} />
        <div className="container">
          <div className={s.cols}><div><h2>Contexto</h2><p>{c.context}</p></div><div><h2>Rol</h2><p>{c.role}</p></div><div><h2>Entrega</h2><p>{c.delivery}</p></div></div>
          <section className={`${s.sec} ${s.problem}`} aria-labelledby="c-problema"><h2 id="c-problema">Problema</h2><p>{c.problem[0]}</p><p>{c.problem[1]}</p></section>
          <section className={s.sec} aria-labelledby="c-complejidad"><h2 id="c-complejidad">Complejidad</h2><Diagram id={c.complexity.diagram} caption={c.complexity.caption} /></section>
          <section className={s.sec} aria-labelledby="c-decisiones"><h2 id="c-decisiones">Decisiones</h2>{c.decisions.map((d) => <DecisionBlock key={d.title} d={d} brand={c.brand} />)}</section>
          <section className={s.sec} aria-labelledby="c-sistema"><h2 id="c-sistema">Sistema</h2>
            <Disclosure title="Tokens, componentes y reglas" defaultOpen>
              <div className={s.body}>{c.system.body.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div>
              {c.system.code && <CodeDemo {...c.system.code} />}
            </Disclosure>
          </section>
          <section className={s.sec} aria-labelledby="c-diseno"><h2 id="c-diseno">Diseño</h2>
            <div className={s.gallery}>{c.design.map((d) => { const z = shotSize(d.src); return <Figure key={d.src + d.caption} src={d.src} alt={d.alt} caption={d.caption} width={z.width} height={z.height} sizes="(max-width: 900px) 100vw, 580px" />; })}</div>
          </section>
          <section className={s.sec} aria-labelledby="c-impl"><h2 id="c-impl">Implementación</h2>
            <Disclosure title="Cómo llegó a producción" defaultOpen><div className={s.body}>{c.implementation.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div></Disclosure>
          </section>
          <section className={s.sec} aria-labelledby="c-resultado"><h2 id="c-resultado">Resultado</h2><ResultBlock r={c.result} /></section>
          <section className={s.sec} aria-labelledby="c-apr"><h2 id="c-apr">Aprendizajes</h2><div className={s.learn}><p>{c.learnings[0]}</p><p>{c.learnings[1]}</p></div></section>
          <NextCase slug={c.next} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
