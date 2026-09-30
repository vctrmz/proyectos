import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Button from '@/components/ui/Button';
import StarfieldButton from '@/components/ui/StarfieldButton';
import CvDownload from '@/components/ui/CvDownload';
import CopyEmail from '@/components/ui/CopyEmail';
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
import Bookshelf from './Bookshelf';
import Quote from './Quote';
import ContactForm from '@/components/contact/ContactForm';
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
              {/* Debajo de la presentación: quien acaba de leer quién eres es
                  quien quiere el CV, y ahí no compite con la tarjeta. Las redes
                  van en la misma fila porque son la misma decisión —saber más
                  de esta persona— y se comparan de un vistazo. */}
              <div className={s.cvRow}>
                <CvDownload locale={locale} />
                <BioDrawer locale={locale} />
              </div>
              {/* Las redes, debajo: son el camino secundario y no compiten con
                  los dos que sí quieres que se pulsen. */}
              <SocialLinks />
            </div>
            <div className={s.aside}>
              <IdCard locale={locale} />
            </div>
          </section>
          <section className={s.sec} aria-labelledby="a-formacion"><h2 id="a-formacion">{t.education}</h2>
            <div className={s.edu}>{ABOUT.education.map((e) => <p key={e.degree}><strong>{e.degree}</strong> · {e.school} · {e.place} · {e.years}</p>)}<p>{t.eduNote}</p></div>
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
          <section className={s.sec} aria-labelledby="a-libros">
            {/* La cita va antes del título: enmarca por qué están estos libros
                y no otros, y después vienen. */}
            <Quote locale={locale} />
            <h2 id="a-libros">{t.books}</h2>
            <Bookshelf locale={locale} />
          </section>
          <section id="contacto" className={s.sec} aria-labelledby="a-contacto"><h2 id="a-contacto">{t.contact}</h2>
            <div className={s.contact}><StarfieldButton label={SITE.email} href={`mailto:${SITE.email}`} /><CopyEmail /><Button href={SITE.linkedin} external variant="outline">LinkedIn</Button></div>
            {/* Aquí el fondo es claro, así que el formulario va en su tono. */}
            <ContactForm locale={locale} tono="claro" />
          </section>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
