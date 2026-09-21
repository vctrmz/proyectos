import s from './Frame.module.css';
type Props = { children: React.ReactNode; brand?: string; glow?: boolean; ratio?: '4/3' | '16/10' | 'auto'; className?: string };
export default function Frame({ children, brand, glow, ratio = '4/3', className = '' }: Props) {
  const r = ratio === '4/3' ? s.r43 : ratio === '16/10' ? s.r1610 : s.auto;
  return (
    <div className={`${s.frame} ${r} ${glow ? s.glow : ''} ${className}`} style={brand ? { background: brand } : undefined}>
      <div className={s.inner}>{children}</div>
    </div>
  );
}
