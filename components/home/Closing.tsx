import Inset from '@/components/ui/Inset';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import ContactButton from '@/components/contact/ContactButton';
import Starfield from './Starfield';
import Competencies from './Competencies';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './Closing.module.css';

/* El bloque de cierre: el inset oscuro con el campo de estrellas y el titular
   a dos tonos. La acción vive aquí: disponibilidad y «Contactar», que abre el
   modal con las tres vías —copiar el correo, LinkedIn o el formulario—. El
   footer lo repite para quien llega al final. Debajo, las competencias en
   filas desplegables. */
export default function Closing({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getUi(locale);
  return (
    <section id="contacto" className={`container ${s.wrap}`} aria-labelledby="closing-title">
      <Inset className={s.inset}>
        <Starfield />
        <div className={s.content}>
          <TwoToneHeading as="h2" id="closing-title" size="xl" lines={ui.home.closingTitle} />
          <div className={s.grid}>
            {ui.home.closingGrid.map((x) => <div key={x.k}><p className={s.k}>{x.k}</p><p className={s.v}>{x.v}</p></div>)}
          </div>
          <div className={s.action}>
            <p className={s.available}><span className={s.dot} aria-hidden="true" />{ui.home.availability}</p>
            <div className={s.ctas}>
              <ContactButton size="lg" />
            </div>
          </div>
          <Competencies />
        </div>
      </Inset>
    </section>
  );
}
