export default function Inset({ children, className = '', as: Tag = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'section' }) {
  return <Tag className={`inset ${className}`}>{children}</Tag>;
}
