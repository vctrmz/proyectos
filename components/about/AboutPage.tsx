import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Button from '@/components/ui/Button';
import StarfieldButton from '@/components/ui/StarfieldButton';
import Diagram from '@/components/diagrams/Diagram';
import { ABOUT } from '@/lib/content/about';
import { SITE } from '@/lib/content/site';
import Polaroid from './Polaroid';
import CityChips from './CityChips';
import IkigaiDiagram from './IkigaiDiagram';
import CompanyTabs from './CompanyTabs';
import BioDrawer from './BioDrawer';
import SocialLinks from './SocialLinks';
import s from './about.module.css';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <div className="container">
          <h1 className="visually-hidden">Sobre mí</h1>
          <section className={s.intro} aria-labelledby="a-personal">
            <div>
              <h2 id="a-personal">Personal</h2>
              <div className={s.lines}>
                {ABOUT.intro.map((l) => <p key={l}>{l}</p>)}
                <p>Vivo en <CityChips country="ES" only="current" /></p>
                <p>Antes, en <CityChips country="ES" only="past" /></p>
                <p>Nací en Venezuela.</p>
              </div>
            </div>
            <div className={s.aside}>
              <Polaroid src="/assets/victor.jpg" alt="Víctor Maza" caption="Víctor Maza · Málaga" />
              <SocialLinks />
            </div>
          </section>
          <section className={s.sec} aria-labelledby="a-formacion"><h2 id="a-formacion">Formación</h2>
            <div className={s.edu}>{ABOUT.education.map((e) => <p key={e.degree}><strong>{e.degree}</strong> · {e.school} · {e.place} · {e.years}</p>)}<p>Informático de formación, Product Designer de oficio.</p></div>
            <div className={s.eduCta}><BioDrawer /></div>
          </section>
          <section className={s.sec} aria-labelledby="a-ikigai"><h2 id="a-ikigai">Ikigai</h2><IkigaiDiagram /></section>
          <section className={s.sec} aria-labelledby="a-empresas"><h2 id="a-empresas">Empresas</h2><CompanyTabs /><div className={s.timeline}><Diagram id="timeline" /></div></section>
          <section className={`${s.sec} ${s.vision}`} aria-labelledby="a-vision"><h2 id="a-vision">{ABOUT.vision.title}</h2>
            {ABOUT.vision.paragraphs.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}
            <div className={s.two}>
              <ul className={s.list}>{ABOUT.skills.map((k) => <li key={k}>{k}</li>)}</ul>
              <div className={s.tools}>{ABOUT.tools.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          </section>
          <section id="contacto" className={s.sec} aria-labelledby="a-contacto"><h2 id="a-contacto">Contacto</h2>
            <div className={s.contact}><StarfieldButton label={SITE.email} href={`mailto:${SITE.email}`} /><Button href={SITE.linkedin} external variant="outline">LinkedIn</Button></div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
