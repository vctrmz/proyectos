import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
/* Mi sitio en el proceso del banco: el Product Owner define la oferta, yo la
   convierto en experiencia, se valida con UX y negocio, y comercial la lleva
   al mercado. El diseño no empieza en la pantalla ni acaba en el handoff. */
const STEPS = [
  ['Product Owner', 'define la oferta', 'producto y tarifas'],
  ['Product Designer', 'la traduce', 'flujos y prototipos'],
  ['PD + UX + PO', 'la valida', 'antes de lanzar'],
  ['Comercial', 'la lleva al mercado', 'ejecutivos y canales'],
];
export default function HandoffChain({ s }: { s: Record<string, string> }) {
  return (
    <>
      {STEPS.map(([n, verb, sub], i) => (
        <motion.g key={n} variants={V}>
          <rect x={16 + i * 196} y={130} width={168} height={110} rx={18} className={i === 1 ? s.boxInk : s.box} />
          <text x={100 + i * 196} y={166} textAnchor="middle" className={i === 1 ? s.tw : s.t}>{n}</text>
          <text x={100 + i * 196} y={190} textAnchor="middle" className={i === 1 ? `${s.tw} ${s.small}` : s.t3}>{verb}</text>
          <text x={100 + i * 196} y={212} textAnchor="middle" className={i === 1 ? `${s.tw} ${s.small}` : s.t3} opacity={i === 1 ? 0.72 : 1}>{sub}</text>
          {i < 3 && <path d={`M ${184 + i * 196} 185 H ${212 + i * 196}`} className={`${s.line} ${s.acc}`} />}
        </motion.g>
      ))}
      <text x={400} y={300} textAnchor="middle" className={s.t3}>cinco ofertas, cinco audiencias que no hablan igual</text>
    </>
  );
}
