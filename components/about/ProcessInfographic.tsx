'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { aboutIn } from '@/lib/content/en';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import { splitBold } from '@/lib/content/text';
import s from './process.module.css';

const Rich = ({ text }: { text: string }) => <>{splitBold(text).map((x, i) => (x.strong ? <strong key={i}>{x.text}</strong> : <span key={i}>{x.text}</span>))}</>;

/* Forma de trabajo como recorrido: los pasos sobre una línea con degradado,
   uno activo cada vez; debajo, los tres criterios no negociables, con la
   regla 60·30·10 dibujada como barra. */
export default function ProcessInfographic() {
  const ABOUT = aboutIn(useLocale());
  const t = useUi().about.proc;
  const { intro, steps, principles, outro } = ABOUT.process;
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + steps.length) % steps.length);
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + steps.length) % steps.length;
    setI(n);
    document.getElementById(`proc-tab-${steps[n].id}`)?.focus();
  };
  return (
    <section className={s.wrap} aria-labelledby="proc-title">
      <h3 id="proc-title" className={s.title}>{t.title}</h3>
      <p className={s.intro}><Rich text={intro} /></p>
      <div role="tablist" aria-label={t.steps} className={s.track} onKeyDown={onKey} style={{ '--n': steps.length } as React.CSSProperties}>
        <span className={s.line} aria-hidden="true"><span className={s.lineFill} style={{ width: `${(i / (steps.length - 1)) * 100}%` }} /></span>
        {steps.map((st, k) => (
          <button key={st.id} type="button" role="tab" id={`proc-tab-${st.id}`} aria-selected={i === k} aria-controls="proc-panel" tabIndex={i === k ? 0 : -1} className={`${s.step} ${k <= i ? s.done : ''} ${i === k ? s.active : ''}`} onClick={() => setI(k)}>
            <span className={s.dot} aria-hidden="true">{k + 1}</span>
            <span className={s.name}>{st.name}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id="proc-panel" aria-labelledby={`proc-tab-${steps[i].id}`} className={s.panel}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={steps[i].id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <p><Rich text={steps[i].body} /></p>
            {/* Lo concreto en lista: se ojea de un vistazo y el cajón no crece
                en párrafos que nadie lee de pie. */}
            <p className={s.doesTitle}>{t.does}</p>
            <ul className={s.does}>{steps[i].does.map((d) => <li key={d}>{d}</li>)}</ul>
          </motion.div>
        </AnimatePresence>
        <div className={s.nav}>
          <button type="button" className={s.navBtn} onClick={() => go(i - 1)} aria-label={t.prev}>←</button>
          <span className={s.count}>{i + 1} / {steps.length}</span>
          <button type="button" className={s.navBtn} onClick={() => go(i + 1)} aria-label={t.next}>→</button>
        </div>
      </div>
      <p className={s.kicker}>{t.principles}</p>
      <ul className={s.principles}>
        {principles.map((p) => (
          <li key={p.name} className={s.card}>
            <p className={s.pname}>{p.name}</p>
            {'bar' in p && p.bar && (
              <span className={s.bar} aria-hidden="true">
                {p.bar.map((w, k) => <span key={k} className={`${s.seg} ${s['seg' + k]}`} style={{ width: `${w}%` }}>{w}</span>)}
              </span>
            )}
            <p className={s.pbody}><Rich text={p.body} /></p>
          </li>
        ))}
      </ul>
      <p className={s.outro}><Rich text={outro} /></p>
    </section>
  );
}
