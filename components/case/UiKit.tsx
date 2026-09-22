'use client';
import { motion } from 'motion/react';
import s from './uikit.module.css';

/* El kit del sistema en formato bento: cinco piezas con una maqueta real
   construida con los mismos tokens del caso. Las maquetas son decorativas;
   lo que se lee es el título y para qué sirve la pieza. */

type Props = { brand: string };

const V = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

export default function UiKit({ brand }: Props) {
  return (
    <motion.ul className={s.grid} aria-label="Kit del sistema" initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ staggerChildren: 0.07 }}>
      <motion.li className={`${s.card} ${s.wide}`} variants={V}>
        <div data-mock aria-hidden="true" className={s.mock}>
          <span className={s.btnSolid} style={{ background: brand }}>Emitir póliza</span>
          <span className={s.btnOutline}>Guardar borrador</span>
          <span className={s.btnGhost}>Cancelar</span>
        </div>
        <h4>Acciones</h4>
        <p>Una sola jerarquía: la acción que cierra el paso en color de marca, la reversible en contorno, la de salida sin peso.</p>
      </motion.li>

      <motion.li className={s.card} variants={V}>
        <div data-mock aria-hidden="true" className={s.mock}>
          <span className={`${s.chip} ${s.cPend}`}>Pendiente</span>
          <span className={`${s.chip} ${s.cCurso}`}>En curso</span>
          <span className={`${s.chip} ${s.cOk}`}>Aprobado</span>
          <span className={`${s.chip} ${s.cBad}`}>Bloqueado</span>
        </div>
        <h4>Estados</h4>
        <p>Cuatro estados con color y fondo propios, nunca solo color: el mismo lenguaje en tabla, panel y documento.</p>
      </motion.li>

      <motion.li className={s.card} variants={V}>
        <div data-mock aria-hidden="true" className={s.mock}>
          <span className={s.row}><i /><i className={s.w40} /><span className={`${s.chip} ${s.cOk} ${s.tiny}`}>OK</span></span>
          <span className={s.row}><i /><i className={s.w60} /><span className={`${s.chip} ${s.cCurso} ${s.tiny}`}>···</span></span>
          <span className={s.row}><i /><i className={s.w30} /><span className={`${s.chip} ${s.cBad} ${s.tiny}`}>!</span></span>
          <span className={s.row}><i /><i className={s.w50} /><span className={`${s.chip} ${s.cPend} ${s.tiny}`}>—</span></span>
        </div>
        <h4>Tabla de alta densidad</h4>
        <p>La tabla es el espacio de trabajo: filas compactas, estado a la derecha y acciones que aparecen en la fila activa.</p>
      </motion.li>

      <motion.li className={s.card} variants={V}>
        <div data-mock aria-hidden="true" className={s.mock}>
          <span className={s.steps}>
            <i className={s.done} style={{ background: brand }} /><b />
            <i className={s.done} style={{ background: brand }} /><b />
            <i className={s.now} style={{ borderColor: brand }} /><b className={s.rest} />
            <i />
          </span>
          <span className={s.hint}>Fase 2 de 3 · salida: propuesta firmada</span>
        </div>
        <h4>Fases con criterio de salida</h4>
        <p>No un asistente lineal: cada fase declara su audiencia, sus permisos y qué tiene que cumplirse para avanzar.</p>
      </motion.li>

      <motion.li className={`${s.card} ${s.wide}`} variants={V}>
        <div data-mock aria-hidden="true" className={s.mock}>
          <span className={s.field}><i className={s.label} /><i className={s.input} /></span>
          <span className={s.field}><i className={s.label} /><i className={s.input} /></span>
          <span className={`${s.field} ${s.cond}`}><i className={s.label} /><i className={s.input} /><em>condicionado por regla</em></span>
        </div>
        <h4>Formulario por esquema</h4>
        <p>Los campos se declaran como dato y la interfaz los renderiza con su validación: un ramo nuevo no pide pantallas nuevas.</p>
      </motion.li>
    </motion.ul>
  );
}
