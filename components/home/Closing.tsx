import Inset from '@/components/ui/Inset';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Starfield from './Starfield';
import Competencies from './Competencies';
import s from './Closing.module.css';

/* El bloque de cierre: el inset oscuro con el campo de estrellas y el titular
   a dos tonos, y debajo las competencias en filas desplegables. El contacto
   vive en el footer, así que aquí no hay botones. */
export default function Closing() {
  return (
    <section id="contacto" className={`container ${s.wrap}`} aria-labelledby="closing-title">
      <Inset className={s.inset}>
        <Starfield />
        <div className={s.content}>
          <TwoToneHeading as="h2" id="closing-title" size="xl" lines={['¿Tienes un producto complejo?', 'Reglas densas, varios clientes, un equipo que necesita diseño construible.']} />
          <div className={s.grid}>
            <div><p className={s.k}>Problema</p><p className={s.v}>Complejidad B2B</p></div>
            <div><p className={s.k}>Método</p><p className={s.v}>UX + sistema + UI + implementación</p></div>
            <div><p className={s.k}>Evidencia</p><p className={s.v}>Nueve años · SaaS asegurador en producción</p></div>
            <div><p className={s.k}>Acción</p><p className={s.v}>Un correo</p></div>
          </div>
          <Competencies />
        </div>
      </Inset>
    </section>
  );
}
