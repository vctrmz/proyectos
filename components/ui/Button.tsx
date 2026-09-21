import Link from 'next/link';
import s from './Button.module.css';
type Props = { variant?: 'solid' | 'outline' | 'ghost'; size?: 'md' | 'lg'; href?: string; external?: boolean; onClick?: () => void; children: React.ReactNode; className?: string; 'aria-label'?: string };
export default function Button({ variant = 'solid', size = 'md', href, external, onClick, children, className = '', ...rest }: Props) {
  const cls = `${s.btn} ${s[variant]} ${size === 'lg' ? s.lg : ''} ${className}`;
  if (href && external) return <a href={href} target="_blank" rel="noopener" className={cls} {...rest}>{children} <span aria-hidden="true">↗</span></a>;
  if (href) return <Link href={href} className={cls} {...rest}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls} {...rest}>{children}</button>;
}
