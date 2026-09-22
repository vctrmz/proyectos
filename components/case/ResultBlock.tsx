import Metric from '@/components/ui/Metric';
import type { CaseStudy } from '@/lib/content/cases';
import s from './case.module.css';
export default function ResultBlock({ r }: { r: CaseStudy['result'] }) {
  return (
    <div className={s.result}>
      <div><h3>Output</h3><div className={s.metrics}>{r.output.map((m) => <Metric key={m.label} {...m} />)}</div></div>
      <div><h3>Outcome</h3>{r.outcome === 'unavailable' ? <p className={s.na}>Dato no disponible</p> : <div className={s.metrics}>{r.outcome.map((m) => <Metric key={m.label} {...m} />)}</div>}</div>
      <div><h3>Qué mediría hoy</h3><p className={s.measure}>{r.measure}</p></div>
    </div>
  );
}
