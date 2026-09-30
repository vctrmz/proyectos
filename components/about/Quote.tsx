import { aboutIn } from '@/lib/content/en';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import s from './quote.module.css';

/* La cita que abre la estantería: explica el criterio con el que están
   elegidos los libros antes de enseñarlos.

   Marcado como <blockquote> con <cite>, no como un párrafo grande con una
   firma debajo: así un lector de pantalla anuncia que es una cita ajena y de
   quién es, que es justo lo que distingue esto de una frase propia.

   Las comillas las pone el CSS y no el texto, para que no se lean dos veces
   —la del carácter y la del marcado— y para que el dato quede limpio si
   mañana se usa en otro sitio. El punto final sí vive en el dato, que es una
   frase entera, y se quita al pintarla porque en español el punto va detrás
   del cierre de las comillas, no delante. El monograma sustituye al retrato:
   no tengo derechos sobre una foto de Jakob Nielsen. */
export default function Quote({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const q = aboutIn(locale).quote;
  const monograma = q.author.split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
  /* «…diferente».» es lo que sale si el punto se pinta dos veces. */
  const texto = q.text.replace(/\.$/, '');
  return (
    <figure className={`inset ${s.card}`}>
      <blockquote className={s.quote}>
        <p>{texto}</p>
      </blockquote>
      <figcaption className={s.by}>
        <span className={s.mono} aria-hidden="true">{monograma}</span>
        <span className={s.who}>
          <cite className={s.name}>{q.author}</cite>
          <span className={s.role}>{q.role}</span>
          <span className={s.role}>{q.org}</span>
        </span>
      </figcaption>
    </figure>
  );
}
