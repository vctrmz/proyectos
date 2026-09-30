import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, LOCALES, LOCALE_LABEL, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import Flag from '@/components/ui/Flag';
import s from './CvDownload.module.css';

/* El CV existe en dos idiomas, así que el enlace tiene que preguntar cuál. Es
   un <details> y no un menú con JavaScript: el desplegable nativo ya trae
   teclado, foco y Escape, funciona sin hidratar y no hay estado que pueda
   quedarse abierto a medias. El idioma de la página decide cuál va primero,
   pero los dos se ven: quien lee la web en español puede necesitar el CV en
   inglés para reenviarlo.

   Cada opción dice su peso, y un test comprueba ese número contra el archivo
   publicado: la etiqueta no puede mentir sobre lo que vas a descargar. */
export default function CvDownload({ locale = DEFAULT_LOCALE, className = '' }: { locale?: Locale; className?: string }) {
  const t = getUi(locale).cv;
  /* El idioma de la página primero: es el que casi siempre se quiere. */
  const orden = [locale, ...LOCALES.filter((l) => l !== locale)] as Locale[];
  return (
    <details className={`${s.wrap} ${className}`}>
      <summary className={s.trigger}>
        <span>{t.label}</span>
        <svg className={s.chev} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </summary>
      <ul className={s.list}>
        {orden.map((l) => {
          const cv = SITE.cv[l];
          const name = LOCALE_LABEL[l].name;
          return (
            <li key={l}>
              <a href={cv.href} download={cv.file} type="application/pdf" hrefLang={l} aria-label={t.download(name, cv.kb)}>
                <Flag locale={l} className={s.flag} />
                <span className={s.name}>{name}</span>
                <span className={s.meta}>{t.format} · {cv.kb} KB</span>
              </a>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
