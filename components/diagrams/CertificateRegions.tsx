import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } };

/* La anatomía del certificado de caución: un A4 en cinco regiones. Cuatro son
   fijas y comunes a las cuatro plantillas; solo el cuerpo entra en el editor. */
export default function CertificateRegions({ s }: { s: Record<string, string> }) {
  const line = (x: number, y: number, w: number) => <rect x={x} y={y} width={w} height={6} rx={3} fill="var(--line)" />;
  const label = (y: number, title: string, note: string, editable = false) => (
    <motion.g variants={V}>
      <path d={`M372 ${y} H418`} className={`${s.line} ${editable ? s.acc : ''}`} />
      <text x={430} y={y - 3} className={s.t}>{title}</text>
      <text x={430} y={y + 15} className={s.t3}>{note}</text>
    </motion.g>
  );
  return (
    <>
      <rect x={120} y={20} width={252} height={360} rx={6} className={s.box} />
      <rect x={140} y={40} width={150} height={14} rx={3} className={s.boxInk} />
      {line(140, 70, 212)}{line(140, 82, 212)}{line(140, 94, 170)}
      <rect x={226} y={108} width={40} height={6} rx={3} className={s.boxInk} />
      <motion.g variants={V}>
        <rect x={132} y={126} width={228} height={160} rx={8} fill="none" stroke="var(--focus)" strokeWidth={1.5} strokeDasharray="6 5" />
        {line(146, 142, 200)}
        <rect x={146} y={156} width={74} height={14} rx={7} fill="var(--focus)" />
        {line(226, 160, 120)}{line(146, 182, 200)}{line(146, 196, 160)}
        <rect x={232} y={208} width={88} height={14} rx={7} fill="var(--focus)" />
        {line(146, 212, 80)}{line(146, 236, 200)}{line(146, 250, 120)}
      </motion.g>
      {line(140, 304, 190)}
      <rect x={130} y={330} width={232} height={24} rx={3} className={s.boxInk} />
      {line(140, 364, 212)}

      {label(47, 'Cabecera y nº de certificado', 'fija · la variable solo se resuelve')}
      {label(88, 'Apoderamiento de la aseguradora', 'fijo · lo que obliga a la aseguradora')}
      {label(206, 'Cuerpo: texto, formato y variables', 'editable · lo único que entra en TipTap', true)}
      {label(307, 'Firma, lugar y fecha', 'fija')}
      {label(342, 'Pie y logotipo del tenant', 'fijo · común a las cuatro plantillas')}
    </>
  );
}
