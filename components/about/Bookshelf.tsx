import Image from 'next/image';
import { BOOKS } from '@/lib/content/books';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './bookshelf.module.css';

/* La estantería: portada, título y autor. La portada es decorativa (el
   título va escrito debajo), así que su alt va vacío. Cada portada conserva
   su proporción y se apoya abajo, como en una balda: recortarlas a 2:3
   cortaría el título de las más anchas. Sin imagen, la portada se compone
   con tipografía: nunca un hueco. */
export default function Bookshelf({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getUi(locale).about;
  return (
    <ul className={s.shelf} aria-label={t.books}>
      {BOOKS.map((b) => (
        <li key={b.slug} className={s.book}>
          <div className={s.slot}>
            {b.cover
              ? <Image src={b.cover} alt="" width={240} height={360} sizes="(max-width: 600px) 45vw, 160px" className={s.cover} />
              : <div className={s.fallback} aria-hidden="true"><span className={s.fTitle}>{b.title}</span><span className={s.fAuthor}>{b.author}</span></div>}
          </div>
          <p className={s.title}>{b.title}</p>
          <p className={s.author}>{b.author}</p>
        </li>
      ))}
    </ul>
  );
}
