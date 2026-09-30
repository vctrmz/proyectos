import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './CvLink.module.css';

/* El CV en PDF, para quien tiene que reenviarlo antes de llamar. Dice el
   formato y el peso antes del clic; `download` le da un nombre legible. */
export default function CvLink({ locale = DEFAULT_LOCALE, className = '' }: { locale?: Locale; className?: string }) {
  const t = getUi(locale).cv;
  const cv = SITE.cv[locale];
  return (
    <a href={cv.href} download={cv.file} type="application/pdf" className={`${s.cv} ${className}`}>
      {t.label} <span className={s.meta}>({t.format}, {cv.kb} KB)</span>
    </a>
  );
}
