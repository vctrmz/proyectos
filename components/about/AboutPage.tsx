import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Button from '@/components/ui/Button';
import StarfieldButton from '@/components/ui/StarfieldButton';
import Diagram from '@/components/diagrams/Diagram';
import { aboutIn } from '@/lib/content/en';
import { DEFAULT_LOCALE, ROUTES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import { splitBold } from '@/lib/content/text';
import { SITE } from '@/lib/content/site';
import IdCard from './IdCard';
import IkigaiDiagram from './IkigaiDiagram';
import CompanyTabs from './CompanyTabs';
import ToolGroups from './ToolGroups';
import BioDrawer from './BioDrawer';
import SocialLinks from './SocialLinks';
import s from './about.module.css';

export default function AboutPage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ABOUT = aboutIn(locale);
  const ui = getUi(locale);
  const t = ui.about;
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <div className="container">
          <h1 className="visually-hidden">{t.title}</h1>
          <section className={s.intro} aria-labelledby="a-personal">
            <div>
              <h2 id="a-personal">{t.personal}</h2>
              {/* Fuera dónde nací y dónde he vivido: es información personal que
                  no aporta a quien evalúa el trabajo. */}
              <div className={s.lines}>
                {ABOUT.intro.map((l) => <p key={l}>{l}</p>)}
              </div>
            </div>
            <div className={s.aside}>
              <IdCard locale={locale} />
              <SocialLinks />
            </div>
          </section>
          <section className={s.sec} aria-labelledby="a-formacion"><h2 id="a-formacion">{t.education}</h2>
            <div className={s.edu}>{ABOUT.education.map((e) => <p key={e.degree}><strong>{e.degree}</strong> · {e.school} · {e.place} · {e.years}</p>)}<p>{t.eduNote}</p></div>
            <div className={s.eduCta}><BioDrawer locale={locale} /></div>
          </section>
          <section className={s.sec} aria-labelledby="a-ikigai"><h2 id="a-ikigai">{t.ikigai}</h2><IkigaiDiagram /></section>
          <section className={s.sec} aria-labelledby="a-empresas"><h2 id="a-empresas">{t.companies}</h2><CompanyTabs /><div className={s.timeline}><Diagram id="timeline" /></div></section>
          <section className={`${s.sec} ${s.vision}`} aria-labelledby="a-vision"><h2 id="a-vision">{ABOUT.vision.title}</h2>
            {ABOUT.vision.paragraphs.map((para) => <p key={para.slice(0, 30)}>{splitBold(para).map((x, i) => (x.strong ? <strong key={i}>{x.text}</strong> : <span key={i}>{x.text}</span>))}</p>)}
            <div className={s.skillBox}>
              <p className={s.skillHead}>{t.skills}</p>
              <ul className={s.list}>{ABOUT.skills.map((k) => <li key={k}>{k}</li>)}</ul>
            </div>
          </section>
          <section className={s.sec} aria-labelledby="a-tools"><h2 id="a-tools">{t.tools}</h2>
            <ToolGroups />
          </section>
          <section id="contacto" className={s.sec} aria-labelledby="a-contacto"><h2 id="a-contacto">{t.contact}</h2>
            <div className={s.contact}><StarfieldButton label={SITE.email} href={`mailto:${SITE.email}`} /><Button href={SITE.linkedin} external variant="outline">LinkedIn</Button></div>
          </section>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
