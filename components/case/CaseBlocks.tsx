import Reveal from '@/components/motion/Reveal';
import type { Audience, Challenge, Finding, Flow, Severity } from '@/lib/content/cases';
import s from './blocks.module.css';

/* Los bloques que el caso usa para explicarse en estructura y no en párrafo:
   el reto en tensiones, las audiencias con su entrada y su salida, los flujos
   numerados y la tabla de hallazgos con su severidad. Cada caso enseña solo
   los que tiene. */

export function ChallengeGrid({ items }: { items: Challenge[] }) {
  return (
    <ul className={s.challenge}>
      {items.map((c, i) => (
        <Reveal key={c.title} as="li" delay={i * 0.04} className={s.tension}>
          <span className={s.n} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}

/* La identidad va arriba y separada de la pregunta por una línea: el nombre no
   es parte de la frase. Si la audiencia es una persona (trae `role`) lleva su
   monograma; si es un segmento, el nombre se lee como etiqueta. */
export function AudienceGrid({ items }: { items: Audience[] }) {
  return (
    <ul className={s.aud}>
      {items.map((a, i) => (
        <Reveal key={a.name} as="li" delay={i * 0.04} className={s.audCard}>
          <div className={s.audHead}>
            {a.role && <span className={s.mono} aria-hidden="true">{a.name.trim().charAt(0)}</span>}
            <h3 className={a.role ? s.name : s.segment}>
              {a.name}
              {a.role && <span className={s.role}>{a.role}</span>}
            </h3>
          </div>
          <p className={s.q}>«{a.question}»</p>
          <p className={s.entry}>{a.entry}</p>
          <p className={s.exit}><span aria-hidden="true">→ </span>{a.exit}</p>
        </Reveal>
      ))}
    </ul>
  );
}

export function FlowList({ list }: { list: Flow[] }) {
  return (
    <div className={s.flows}>
      {list.map((f) => (
        <div key={f.title} className={s.flow}>
          <p className={s.flowHead}>{f.title}{f.side && <span className={s.side}>{f.side}</span>}</p>
          <ol className={s.steps}>
            {f.steps.map((st: Flow['steps'][number], i: number) => (
              <Reveal key={st.n} as="li" delay={i * 0.04} className={s.step}>
                <span className={s.stepN} aria-hidden="true">{st.n}</span>
                <span className={s.stepT}>{st.t}</span>
                <span className={s.stepD}>{st.d}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

const SEV: Record<Severity, string> = { 'crítica': s.sevCrit, alta: s.sevHigh, media: s.sevMed, baja: s.sevLow };

export function FindingsTable({ items }: { items: Finding[] }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <caption className="visually-hidden">Hallazgos ordenados por severidad, con la regla que incumplen y la pantalla donde ocurren</caption>
        <thead>
          <tr><th scope="col">#</th><th scope="col">Hallazgo</th><th scope="col">Regla</th><th scope="col">Severidad</th><th scope="col">Dónde</th></tr>
        </thead>
        <tbody>
          {items.map((f) => (
            <tr key={f.n}>
              <td className={s.fn}>{f.n}</td>
              <td><strong>{f.title}</strong> {f.body}</td>
              <td className={s.rule}>{f.rule}</td>
              <td><span className={`${s.sev} ${SEV[f.severity]}`}>{f.severity}</span></td>
              <td className={s.rule}>{f.where}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
