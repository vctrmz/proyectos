import RollingNumber from '@/components/motion/RollingNumber';
import s from './Metric.module.css';
export default function Metric({ value, label, meaning, tone = 'light' }: { value: string; label: string; meaning?: string; tone?: 'light' | 'dark' }) {
  return (
    <div className={`${s.m} ${tone === 'dark' ? s.dark : ''}`}>
      <p className={s.v}><RollingNumber value={value} /></p><p className={s.l}>{label}</p>{meaning && <p className={s.mean}>{meaning}</p>}
    </div>
  );
}
