import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import CvDownload from '@/components/ui/CvDownload';
import Diagram from '@/components/diagrams/Diagram';
import { aboutIn } from '@/lib/content/en';
import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, ROUTES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import PortraitField from './PortraitField';
import IkigaiDiagram from './IkigaiDiagram';
import CompanyTabs from './CompanyTabs';
import ToolGroups from './ToolGroups';
import BioDrawer from './BioDrawer';
import SocialLinks from './SocialLinks';
import Bookshelf from './Bookshelf';
import QuoteCarousel from './QuoteCarousel';
import FilmPlayer from './FilmPlayer';
import s from './about.module.css';

/* Los datos públicos que llevaba la tarjeta: oficio y modo de trabajo. */
const FACTS = {
  es: [['Rol', 'Senior Product Designer'], ['Base', 'España (CET) · remoto'], ['Sector', 'B2B y B2C SaaS'], ['En activo', 'Desde 2017'], ['Idiomas', 'Español nativo · Inglés B2']],
  en: [['Role', 'Senior Product Designer'], ['Based in', 'Spain (CET) · remote'], ['Field', 'B2B and B2C SaaS'], ['Practising', 'Since 2017'], ['Languages', 'Native Spanish · English B2']],
} as const;

export default function AboutPage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ABOUT = aboutIn(locale);
  const ui = getUi(locale);
  const t = ui.about;
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        {/* Es la portada: el h1 nombra a la persona y su oficio, no la sección. */}
        <h1 className="visually-hidden">{SITE.name} · Senior Product Designer</h1>
        {/* El hero entero es el retrato tramado: la foto entra por la derecha y
            el texto va a la izquierda, sobre la misma trama. */}
        <section className={s.hero} aria-labelledby="a-personal">
          <PortraitField className={s.field} label={locale === 'en' ? 'Portrait of Víctor Maza' : 'Retrato de Víctor Maza'} />
          <div className={`container ${s.heroInner}`}>
            <div className={s.heroCopy}>
              <h2 id="a-personal">{t.personal}</h2>
              {/* Fuera dónde nací y dónde he vivido: es información personal que
                  no aporta a quien evalúa el trabajo. */}
              <div className={s.lines}>
                {ABOUT.intro.map((l) => <p key={l}>{l}</p>)}
              </div>
              {/* Debajo de la presentación: quien acaba de leer quién eres es
                  quien quiere el CV. Las redes van en la misma fila porque son
                  la misma decisión —saber más de esta persona—. */}
              <div className={s.cvRow}>
                <CvDownload locale={locale} />
                <BioDrawer locale={locale} ctaClassName={s.heroCta} />
              </div>
              {/* Las redes, debajo: son el camino secundario y no compiten con
                  los dos que sí quieres que se pulsen. */}
              <SocialLinks />
              <dl className={s.facts}>{FACTS[locale].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            </div>
          </div>
        </section>
        <div className="container">
          <section className={s.sec} aria-labelledby="a-formacion"><h2 id="a-formacion">{t.education}</h2>
            <div className={s.edu}>{ABOUT.education.map((e) => <p key={e.degree}><strong>{e.degree}</strong> · {e.school} · {e.place} · {e.years}</p>)}<p>{t.eduNote}</p></div>
          </section>
          <section className={s.sec} aria-labelledby="a-ikigai"><h2 id="a-ikigai">{t.ikigai}</h2><IkigaiDiagram /></section>
          <section className={s.sec} aria-labelledby="a-empresas"><h2 id="a-empresas">{t.companies}</h2><CompanyTabs /><div className={s.timeline}><Diagram id="timeline" /></div></section>
          {/* El film va en su caja oscura y no arranca solo: se ve si se quiere.
              «Diseño sistemas, no pantallas» se fue al cajón «Mi forma de
              trabajar», donde se lee en tres titulares. */}
          <section className={s.sec} aria-labelledby="a-film"><h2 id="a-film">{t.film.title}</h2>
            <p className={s.filmLead}>{t.film.lead}</p>
            <FilmPlayer locale={locale} labels={{ play: t.film.play, pause: t.film.pause, replay: t.film.replay, music: t.film.music, fullscreen: t.film.fullscreen, exitFullscreen: t.film.exitFullscreen, timeline: t.film.timeline, hint: t.film.hint, stage: t.film.stage }} />
          </section>
          <section className={s.sec} aria-labelledby="a-tools"><h2 id="a-tools">{t.tools}</h2>
            <ToolGroups />
          </section>
          <section className={s.sec} aria-labelledby="a-libros">
            {/* La cita va antes del título: enmarca por qué están estos libros
                y no otros, y después vienen. */}
            <QuoteCarousel locale={locale} />
            <h2 id="a-libros">{t.books}</h2>
            <Bookshelf locale={locale} />
          </section>
          {/* Sin bloque de contacto al final: el pie, justo debajo, ya trae
              «Contactar» y LinkedIn, y el menú lo tiene siempre a la vista.
              Dos filas iguales una encima de otra solo restaban. */}
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
