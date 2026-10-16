'use client';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { aboutIn } from '@/lib/content/en';
import { BOOKS } from '@/lib/content/books';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import s from './quote.module.css';
import c from './quoteCarousel.module.css';

/* Cuánto dura cada diapositiva: lo que se tarda en leerla, no un número
   fijo. Unos 2 s para situarse y 300 ms por palabra (unas 200 por minuto,
   el ritmo de un texto grande que se lee entero), entre 6 y 12 s: menos de 6
   no da tiempo a llegar al final y más de 12 parece que se ha parado. */
const BASE = 2000, PER_WORD = 300, MIN = 6000, MAX = 12000;
const dwell = (text: string) => Math.min(MAX, Math.max(MIN, BASE + text.trim().split(/\s+/).length * PER_WORD));
const PAUSE = 'M6 5H8V19H6V5ZM16 5H18V19H16V5Z';
const PLAY = 'M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z';
const CHEVRON_L = 'M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z';
const CHEVRON_R = 'M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z';

/* La cita de Nielsen abre y, detrás, una idea de cada libro de la
   estantería. La cita es literal y lleva comillas; las ideas están en mis
   palabras, así que van sin comillas y firmadas como «una idea de».

   Pasa sola: cada diapositiva dura lo que se tarda en leerla (ver dwell) y
   el punto activo se llena mientras tanto. Se detiene con el botón de pausa
   (WCAG 2.2.2 lo pide para todo lo que se mueve solo más de 5 s), y se
   congela sin perder lo avanzado con el ratón encima, con el foco dentro,
   fuera de pantalla o con la pestaña en segundo plano. Con movimiento
   reducido sigue pasando, pero solo con un fundido. Flechas, puntos y
   deslizar con el dedo. Todas las
   diapositivas comparten celda, así que la tarjeta mide lo que la más alta y
   no salta al cambiar; las ocultas son inert. Mientras pasa sola no se
   anuncia: solo cuando la mueve quien lee. */
export default function QuoteCarousel({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const about = aboutIn(locale);
  const q = about.quote;
  const t = locale === 'es'
    ? { label: 'Ideas de los libros que recomiendo', slide: 'diapositiva', of: (i: number, n: number) => `${i} de ${n}`, prev: 'Anterior', next: 'Siguiente', from: 'Una idea de', go: (i: number) => `Ir a la ${i}`, pause: 'Pausar', play: 'Reanudar' }
    : { label: 'Ideas from the books I recommend', slide: 'slide', of: (i: number, n: number) => `${i} of ${n}`, prev: 'Previous', next: 'Next', from: 'An idea from', go: (i: number) => `Go to ${i}`, pause: 'Pause', play: 'Play' };
  const ideas = about.ideas.map((x) => ({ ...x, b: BOOKS.find((b) => b.slug === x.book)! })).filter((x) => x.b);
  const n = 1 + ideas.length;

  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [manual, setManual] = useState(false);
  const box = useRef<HTMLElement>(null);
  const start = useRef<number | null>(null);
  const bar = useRef<HTMLElement | null>(null);
  const elapsed = useRef(0);
  const times = useMemo(() => [q.text, ...ideas.map((x) => x.text)].map(dwell), [q.text, ideas]);

  useEffect(() => {
    const el = box.current;
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const vis = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  const go = useCallback((to: number, d: 1 | -1, byUser = true) => {
    setDir(d); setI(((to % n) + n) % n);
    if (byUser) setManual(true);
  }, [n]);

  /* El reloj acumula solo mientras corre: al pausar se congela y al volver
     sigue desde donde iba, en lugar de empezar la diapositiva otra vez. */
  const running = playing && seen && visible && !hold;
  useEffect(() => { elapsed.current = 0; if (bar.current) bar.current.style.transform = 'scaleX(0)'; }, [i]);
  useEffect(() => {
    if (!running) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      elapsed.current += now - last; last = now;
      const p = Math.min(1, elapsed.current / times[i]);
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (p >= 1) { go(i + 1, 1, false); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, i, go, times]);

  return (
    <section ref={box} className={`inset ${s.card} ${c.wrap}`} aria-roledescription={locale === 'es' ? 'carrusel' : 'carousel'} aria-label={t.label}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHold(true); }} onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false); }}
      onPointerDown={(e) => { start.current = e.clientX; }}
      onPointerUp={(e) => { if (start.current === null) return; const dx = e.clientX - start.current; start.current = null; if (Math.abs(dx) > 60) go(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); }}>
      <div className={c.track} aria-live={manual || !playing ? 'polite' : 'off'} data-dir={dir}>
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
              <span>{k === i && <i key={i} ref={bar} style={{ transform: 'scaleX(0)' }} />}</span>
            </button>
          ))}
        </div>
        <div className={c.arrows}>
          <button type="button" className={c.arrow} aria-label={playing ? t.pause : t.play} aria-pressed={!playing} onClick={() => setPlaying((v) => !v)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={playing ? PAUSE : PLAY} /></svg>
          </button>
          <button type="button" className={c.arrow} aria-label={t.prev} onClick={() => go(i - 1, -1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={CHEVRON_L} /></svg></button>
          <button type="button" className={c.arrow} aria-label={t.next} onClick={() => go(i + 1, 1)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={CHEVRON_R} /></svg></button>
        </div>
      </div>
    </section>
  );
}
