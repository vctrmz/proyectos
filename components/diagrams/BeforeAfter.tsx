import { motion } from 'motion/react';
const V = { hidden: { opacity: 0 }, show: { opacity: 1 } };
export default function BeforeAfter({ s }: { s: Record<string, string> }) {
  const rows = (n: number, x: number, dim: boolean) => Array.from({ length: n }, (_, i) => <rect key={i} x={x} y={110 + i * 12} width={220} height={7} rx={3} fill={dim ? 'var(--line)' : 'var(--ink)'} opacity={dim && i >= 14 ? 0.5 : 1} />);
  return (
    <>
      <motion.g variants={V}>
        <text x={150} y={80} textAnchor="middle" className={`${s.t} ${s.big}`}>60</text>
        <text x={150} y={100} textAnchor="middle" className={s.t3}>campos visibles por paso · antes</text>
        {rows(20, 40, true)}
      </motion.g>
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--focus)" /></marker></defs>
      <path d="M 330 200 H 450" className={`${s.line} ${s.acc}`} markerEnd="url(#arr)" />
      <motion.g variants={V}>
        <text x={620} y={80} textAnchor="middle" className={`${s.t} ${s.big}`}>14</text>
        <text x={620} y={100} textAnchor="middle" className={s.t3}>solo los que pide la regla · después</text>
        {rows(14, 510, false)}
      </motion.g>
    </>
  );
}
