import Inset from '@/components/ui/Inset';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Starfield from './Starfield';
import Competencies from './Competencies';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './Closing.module.css';

/* El bloque de cierre: el inset oscuro con el campo de estrellas y el titular
   a dos tonos, y debajo las competencias en filas desplegables. El contacto
   vive en el footer, así que aquí no hay botones. */
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
          <Competencies />
        </div>
      </Inset>
    </section>
  );
}
