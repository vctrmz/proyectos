import { getUi } from '@/lib/i18n/ui';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import s from './SkipLink.module.css';
export default function SkipLink({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <a href="#contenido" className={s.skip}>{getUi(locale).skip}</a>;
}
