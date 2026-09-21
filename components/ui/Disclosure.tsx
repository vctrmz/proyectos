import s from './Disclosure.module.css';
export default function Disclosure({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return <details className={s.d} open={defaultOpen}><summary className={s.s}>{title}</summary><div className={s.body}>{children}</div></details>;
}
