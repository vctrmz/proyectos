import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
/* La decisión que sostiene la factura rápida: un estado intermedio. La factura
   existe con importe y sin destinatario, y se completa sola cuando el cliente
   rellena sus datos desde el QR o el correo. */
export default function PendingInvoice({ s }: { s: Record<string, string> }) {
  return (
    <>
      <motion.g variants={V}>
        <rect x={20} y={130} width={190} height={110} rx={18} className={s.box} />
        <text x={115} y={168} textAnchor="middle" className={s.t}>Pendiente</text>
        <text x={115} y={192} textAnchor="middle" className={s.t3}>importe y fecha</text>
        <text x={115} y={212} textAnchor="middle" className={s.t3}>sin destinatario</text>
        <path d="M210 185 H 262" className={`${s.line} ${s.acc}`} />
      </motion.g>
      <motion.g variants={V}>
        <rect x={262} y={92} width={176} height={78} rx={16} className={s.box} />
        <text x={350} y={124} textAnchor="middle" className={s.t}>QR</text>
        <text x={350} y={148} textAnchor="middle" className={s.t3}>lo escanea en el sitio</text>
        <rect x={262} y={200} width={176} height={78} rx={16} className={s.box} />
        <text x={350} y={232} textAnchor="middle" className={s.t}>Correo</text>
        <text x={350} y={256} textAnchor="middle" className={s.t3}>le llega el enlace</text>
        <path d="M438 131 C 480 131, 486 185, 520 185" className={s.line} />
        <path d="M438 239 C 480 239, 486 185, 520 185" className={s.line} />
      </motion.g>
      <motion.g variants={V}>
        <rect x={520} y={130} width={140} height={110} rx={18} className={s.box} />
        <text x={590} y={172} textAnchor="middle" className={s.t}>El cliente</text>
        <text x={590} y={196} textAnchor="middle" className={s.t3}>pone sus datos</text>
        <text x={590} y={216} textAnchor="middle" className={s.t3}>fiscales</text>
        <path d="M660 185 H 676" className={`${s.line} ${s.acc}`} />
      </motion.g>
      <motion.g variants={V}>
        <rect x={676} y={130} width={116} height={110} rx={18} className={s.boxInk} />
        <text x={734} y={178} textAnchor="middle" className={s.tw}>Completada</text>
        <text x={734} y={202} textAnchor="middle" className={`${s.tw} ${s.small}`} opacity={0.72}>sola, en</text>
        <text x={734} y={220} textAnchor="middle" className={`${s.tw} ${s.small}`} opacity={0.72}>la app</text>
      </motion.g>
      <text x={400} y={318} textAnchor="middle" className={s.t3}>quien factura no espera a nadie · quien recibe rellena cuando le viene bien</text>
    </>
  );
}
