'use client';
import { motion } from 'motion/react';
import type { DiagramId } from '@/lib/content/cases/types';
import s from './diagram.module.css';
import ClientsToSystem from './ClientsToSystem';
import AreasMap from './AreasMap';
import BeforeAfter from './BeforeAfter';
import StateMachine from './StateMachine';
import TemplateSlots from './TemplateSlots';
import Grid12to4to1 from './Grid12to4to1';
import SystemCycle from './SystemCycle';
import Timeline from './Timeline';

const MAP: Record<DiagramId, { label: string; C: (p: { s: Record<string, string> }) => React.ReactElement; box?: string }> = {
  'clients-to-system': { label: 'Tres clientes con reglas distintas convergen en un sistema configurable', C: ClientsToSystem },
  'areas-map': { label: 'Mapa de las ocho áreas de producto de HERMES', C: AreasMap },
  'before-after': { label: 'De 60 campos visibles por paso a 14, mostrando solo los que pide la regla', C: BeforeAfter },
  'state-machine': { label: 'Máquina de estados de tres fases con audiencias y criterios de salida', C: StateMachine },
  'template-slots': { label: 'Plantilla con variables, componentes y cláusulas opcionales', C: TemplateSlots },
  'grid-12-4-1': { label: 'Doce composiciones, cuatro finalistas, una en producción', C: Grid12to4to1 },
  'system-cycle': { label: 'El design system alimenta el módulo y el módulo devuelve componentes', C: SystemCycle },
  'timeline': { label: 'Recorrido profesional de 2017 a 2026', C: Timeline, box: '0 130 800 140' },
};

export default function Diagram({ id, caption }: { id: DiagramId; caption?: string }) {
  const { label, C, box } = MAP[id];
  return (
    <figure className={s.fig}>
      <motion.svg viewBox={box ?? '0 0 800 400'} role="img" aria-label={label} className={s.svg} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ staggerChildren: 0.08 }}>
        <C s={s} />
      </motion.svg>
      {caption && <figcaption className={s.cap}>{caption}</figcaption>}
    </figure>
  );
}
