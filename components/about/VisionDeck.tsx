'use client';
import { useState } from 'react';
import Link from 'next/link';
import { aboutIn } from '@/lib/content/en';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import { splitBold } from '@/lib/content/text';
import s from './vision.module.css';

const Rich = ({ text }: { text: string }) => <>{splitBold(text).map((x, i) => (x.strong ? <strong key={i}>{x.text}</strong> : <span key={i}>{x.text}</span>))}</>;

/* «Diseño sistemas, no pantallas» como tres cartas. De frente, cada una es un
   titular que se lee en un segundo; al girarla, la prueba. Quien tiene seis
   segundos lee los tres titulares; quien quiere más, gira. Las cartas vistas
   se cuentan, y al ver las tres aparece el caso donde se aplican: el premio
   de la curiosidad es una prueba, no un confeti.

   Debajo, «Lo que aporto» como checklist que se marca sola al abrir el cajón. */
export default function VisionDeck() {
  const locale = useLocale();
  const ABOUT = aboutIn(locale);
  const ui = useUi();
  const t = ui.about.deck;
  const { title, lead, cards } = ABOUT.vision;
  const [flipped, setFlipped] = useState<boolean[]>(() => cards.map(() => false));
  const [seen, setSeen] = useState<boolean[]>(() => cards.map(() => false));
  const n = seen.filter(Boolean).length;
  const flip = (i: number) => {
    setFlipped((f) => f.map((v, k) => (k === i ? !v : v)));
    setSeen((v) => v.map((x, k) => x || k === i));
  };

  return (
    <section className={s.wrap} aria-labelledby="vision-title">
      <h3 id="vision-title" className={s.title}>{title}</h3>
      <p className={s.lead}>{lead}</p>

      <ul className={s.deck}>
        {cards.map((c, i) => (
          <li key={c.head}>
            <button type="button" className={s.card} aria-pressed={flipped[i]} onClick={() => flip(i)} data-flipped={flipped[i] ? 'true' : undefined}>
              <span className={s.inner}>
                <span className={s.front} aria-hidden={flipped[i] ? 'true' : undefined}>
                  <span className={s.head}>{c.head}</span>
                  <span className={s.tags}>{c.tags.map((g) => <span key={g}>{g}</span>)}</span>
                  <span className={s.hint}><Turn />{t.flip}</span>
                </span>
                <span className={s.back} aria-hidden={flipped[i] ? undefined : 'true'}>
                  <span className={s.proof}><Rich text={c.proof} /></span>
                  <span className={s.hint}><Turn />{t.back}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className={s.progress}>
        <span className={s.pips} aria-hidden="true">{seen.map((v, i) => <i key={i} data-on={v ? 'true' : undefined} />)}</span>
        <p aria-live="polite">{n === cards.length
          ? <>{t.done} <Link href={`/${locale}/cases/hermes`} className={s.done}>{t.doneLink} →</Link></>
          : t.seen(n, cards.length)}</p>
      </div>

      <div className={s.skills}>
        <h3 className={s.skillsHead}>{ui.about.skills} <span>{t.skillsCount(ABOUT.skills.length)}</span></h3>
        <ul className={s.check}>
          {ABOUT.skills.map((k, i) => (
            <li key={k} style={{ '--i': i } as React.CSSProperties}>
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="9" /><path d="M6 10.4 L8.8 13 L14 7.4" /></svg>
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Flecha de giro, del mismo trazo que el resto de iconos. */
function Turn() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" className={s.turn}><path d="M15.5 8.5A6 6 0 1 0 16 12" /><path d="M16 4.5v4h-4" /></svg>;
}
