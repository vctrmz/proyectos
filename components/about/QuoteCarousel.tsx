'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { aboutIn } from '@/lib/content/en';
import { BOOKS } from '@/lib/content/books';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { prefersReducedMotion } from '@/lib/motion/prefs';
import s from './quote.module.css';
import c from './quoteCarousel.module.css';

const EVERY = 7000;
const CHEVRON_L = 'M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z';
const CHEVRON_R = 'M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z';

/* La cita de Nielsen abre y, detrás, una idea de cada libro de la
   estantería. La cita es literal y lleva comillas; las ideas están en mis
   palabras, así que van sin comillas y firmadas como «una idea de».

   Pasa sola cada siete segundos (el punto activo se llena mientras tanto) y
   se para con el ratón encima, con el foco dentro, fuera de pantalla o con
   movimiento reducido. Flechas, puntos y deslizar con el dedo. Todas las
   diapositivas comparten celda, así que la tarjeta mide lo que la más alta y
   no salta al cambiar; las ocultas son inert. Mientras pasa sola no se
   anuncia: solo cuando la mueve quien lee. */
export default function QuoteCarousel({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const about = aboutIn(locale);
  const q = about.quote;
  const t = locale === 'es'
    ? { label: 'Ideas de los libros que recomiendo', slide: 'diapositiva', of: (i: number, n: number) => `${i} de ${n}`, prev: 'Anterior', next: 'Siguiente', from: 'Una idea de', go: (i: number) => `Ir a la ${i}` }
    : { label: 'Ideas from the books I recommend', slide: 'slide', of: (i: number, n: number) => `${i} of ${n}`, prev: 'Previous', next: 'Next', from: 'An idea from', go: (i: number) => `Go to ${i}` };
  const ideas = about.ideas.map((x) => ({ ...x, b: BOOKS.find((b) => b.slug === x.book)! })).filter((x) => x.b);
  const n = 1 + ideas.length;

  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const [auto, setAuto] = useState(false);
  const [manual, setManual] = useState(false);
  const box = useRef<HTMLElement>(null);
  const start = useRef<number | null>(null);

  useEffect(() => { setAuto(!prefersReducedMotion()); }, []);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback((to: number, d: 1 | -1, byUser = true) => {
    setDir(d); setI(((to % n) + n) % n);
    if (byUser) setManual(true);
  }, [n]);

  const running = auto && seen && !paused;
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => go(i + 1, 1, false), EVERY);
    return () => clearTimeout(id);
  }, [running, i, go]);

  return (
    <section ref={box} className={`inset ${s.card} ${c.wrap}`} aria-roledescription={locale === 'es' ? 'carrusel' : 'carousel'} aria-label={t.label}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
      onPointerDown={(e) => { start.current = e.clientX; }}
      onPointerUp={(e) => { if (start.current === null) return; const dx = e.clientX - start.current; start.current = null; if (Math.abs(dx) > 60) go(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); }}>
      <div className={c.track} aria-live={manual ? 'polite' : 'off'} data-dir={dir}>
        <figure className={c.slide} data-on={i === 0} aria-roledescription={t.slide} aria-label={t.of(1, n)} aria-hidden={i !== 0} inert={i !== 0}>
          <blockquote className={s.quote}><p>{q.text.replace(/\.$/, '')}</p></blockquote>
          <figcaption className={s.by}>
            <span className={s.mono} aria-hidden="true">{q.author.split(/\s+/).slice(0, 2).map((w) => w[0]).join('')}</span>
            <span className={s.who}>
              <cite className={s.name}>{q.author}</cite>
              <span className={s.role}>{q.role}</span>
              <span className={s.role}>{q.org}</span>
            </span>
          </figcaption>
        </figure>
        {ideas.map((x, k) => (
          <figure key={x.book} className={c.slide} data-on={i === k + 1} aria-roledescription={t.slide} aria-label={t.of(k + 2, n)} aria-hidden={i !== k + 1} inert={i !== k + 1}>
            <p className={c.idea}>{x.text}</p>
            <figcaption className={s.by}>
              {x.b.cover && <Image src={x.b.cover} alt="" width={44} height={66} className={c.cover} />}
              <span className={s.who}>
                <span className={s.role}>{t.from}</span>
                <cite className={s.name}>{x.b.title}</cite>
                <span className={s.role}>{x.b.author}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={c.controls}>
        <div className={c.dots}>
          {Array.from({ length: n }, (_, k) => (
            <button key={k} type="button" className={c.dot} aria-label={t.go(k + 1)} aria-current={k === i ? 'true' : undefined}
              onClick={() => go(k, k >= i ? 1 : -1)}>
              <span>{k === i && <i key={`${i}-${running}`} className={running ? c.fill : c.full} />}</span>
            </button>
          ))}
        </div>
        <div className={c.arrows}>
          <button type="button" className={c.arrow} aria-label={t.prev} onClick={() => go(i - 1, -1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={CHEVRON_L} /></svg></button>
          <button type="button" className={c.arrow} aria-label={t.next} onClick={() => go(i + 1, 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={CHEVRON_R} /></svg></button>
        </div>
      </div>
    </section>
  );
}
