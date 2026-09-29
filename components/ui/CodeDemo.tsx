import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import type { CodeDemo as CodeDemoData } from '@/lib/content/cases/types';
import s from './CodeDemo.module.css';

/* Cada extracto dice de dónde sale. Sin `source` se asume ilustrativo: lo
   prudente es no presentar como real lo que no se puede enseñar. */
export default function CodeDemo({ title, lang, code, source = 'illustrative', href, locale = DEFAULT_LOCALE }: CodeDemoData & { locale?: Locale }) {
  const t = getUi(locale).case;
  return (
    <div className={s.wrap}>
      <div className={s.head}><span>{title}</span><span className={s.tag}>{lang} · {source === 'repo' ? t.codeRepo : t.codeIllustrative}</span></div>
      <pre className={s.pre} tabIndex={0}><code>{code}</code></pre>
      {href && <a className={s.open} href={href} target="_blank" rel="noopener">{t.codeOpen} <span aria-hidden="true">↗</span></a>}
    </div>
  );
}
