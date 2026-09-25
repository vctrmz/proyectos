import Metric from '@/components/ui/Metric';
import type { CaseStudy } from '@/lib/content/cases';
import s from './case.module.css';
export default function ResultBlock({ r, ui }: { r: CaseStudy['result']; ui: { output: string; outcome: string; unavailable: string; measure: string } }) {
  return (
    <div className={s.result}>
      <div><h3>{ui.output}</h3><div className={s.metrics}>{r.output.map((m) => <Metric key={m.label} {...m} />)}</div></div>
      <div><h3>{ui.outcome}</h3>{r.outcome === 'unavailable' ? <p className={s.na}>{ui.unavailable}</p> : <div className={s.metrics}>{r.outcome.map((m) => <Metric key={m.label} {...m} />)}</div>}</div>
      <div><h3>{ui.measure}</h3><p className={s.measure}>{r.measure}</p></div>
    </div>
  );
}
