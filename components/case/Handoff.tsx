import type { Ui } from '@/lib/i18n/ui';
import s from './handoff.module.css';

/* Cómo sale el sistema del estudio: los cinco pasos de la entrega y lo que
   recibe el equipo. Es igual en todos los casos a propósito, porque es el
   método y no el producto; sustituye al extracto de JSON y al kit de
   tarjetas, que repetían lo mismo caso a caso. */
export default function Handoff({ ui }: { ui: Ui['case']['handoff'] }) {
  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <p className={s.eyebrow}>{ui.eyebrow}</p>
        <h3 className={s.title}>{ui.title}</h3>
        <p className={s.lead}>{ui.lead}</p>
      </div>
      <ol className={s.steps}>
        {ui.steps.map((st, i) => (
          <li key={st.t}>
            <span className={s.n} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h4>{st.t}</h4>
            <p>{st.d}</p>
          </li>
        ))}
      </ol>
      <div className={s.out}>
        <p className={s.eyebrow}>{ui.outLabel}</p>
        <ul>{ui.out.map((o) => <li key={o}>{o}</li>)}</ul>
      </div>
    </div>
  );
}
