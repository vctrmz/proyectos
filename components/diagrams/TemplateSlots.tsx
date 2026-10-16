import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } };
/* La plantilla del certificado: cabecera con logotipo y pie fijos, y en
   medio el cuerpo editable, con un dato del sistema como variable y lo que se
   inserta con /. */
export default function TemplateSlots({ s }: { s: Record<string, string> }) {
  const line = (y: number, w: number) => <rect x={80} y={y} width={w} height={8} rx={4} fill="var(--line)" />;
  return (
    <>
      <rect x={40} y={20} width={520} height={360} rx={20} className={s.box} />
      <motion.g variants={V}><rect x={60} y={36} width={480} height={40} rx={10} fill="var(--line)" /><text x={80} y={61} className={s.t3}>cabecera · logotipo</text></motion.g>
      {line(100, 420)}{line(122, 380)}
      <motion.g variants={V}><rect x={80} y={146} width={190} height={26} rx={13} className={s.boxInk} /><text x={175} y={164} textAnchor="middle" className={s.tw}>{'${tomador.nombre}'}</text></motion.g>
      {line(196, 440)}{line(218, 300)}
      <motion.g variants={V}><rect x={80} y={242} width={150} height={26} rx={13} fill="var(--focus)" /><text x={155} y={260} textAnchor="middle" className={s.tw}>/ Tablas</text></motion.g>
      {line(292, 400)}
      <motion.g variants={V}><rect x={60} y={322} width={480} height={40} rx={10} fill="var(--line)" /><text x={80} y={347} className={s.t3}>pie de página</text></motion.g>
      <text x={600} y={61} className={s.t}>fijo, no se edita</text>
      <text x={600} y={164} className={s.t}>datos del sistema</text>
      <text x={600} y={260} className={s.t}>/ estilos y datos</text>
      <text x={600} y={210} className={s.t3}>cuerpo editable</text>
      <text x={600} y={347} className={s.t}>fijo, no se edita</text>
    </>
  );
}
