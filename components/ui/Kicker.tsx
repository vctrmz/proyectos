import t from './text.module.css';
export default function Kicker({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`${t.kicker} ${className}`}>{children}</p>;
}
