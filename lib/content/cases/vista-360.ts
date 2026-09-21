import { shot, type CaseStudy } from './types';

export const vista360: CaseStudy = {
  slug: 'vista-360', title: 'Vista 360 del cliente', company: 'Atrinium', years: '2026',
  tagline: 'Doce alternativas para una decisión: que cualquiera del equipo entienda a un cliente en diez segundos.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Panel interno'], brand: '#1b2a4a',
  hero: shot('11-resumen-comercial', 'Resumen comercial del cliente', 'Resumen comercial: identidad persistente, riesgo y actividad antes del histórico'),
  context: 'Panel interno de Atrinium. No había vista única del cliente: para entender una cuenta había que reconstruirla saltando entre módulos antes de cada conversación.',
  role: 'Diseño y exploración, con usuarios a dos mesas de distancia y una sola pantalla como alcance.',
  delivery: 'Una pantalla en producción y un criterio reutilizable por escrito.',
  problem: [
    'El equipo perdía minutos reconstruyendo quién era un cliente antes de hablar con él.',
    'Había que elegir una composición con criterio de negocio, no de gusto, y dejar escrito por qué se descartaron las demás.',
  ],
  complexity: { diagram: 'grid-12-4-1', caption: 'Doce composiciones exploradas, cuatro direcciones finalistas, una pantalla en producción.' },
  decisions: [
    { title: 'Mirar fuera antes de dibujar.', why: 'Los paneles 360 están resueltos en CRM, banca y soporte; copiar capturas sueltas no enseña el flujo.', changed: 'Benchmark recorriendo flujos reales pantalla a pantalla con Mobbin: cabecera de identidad persistente, bloques de riesgo y actividad, resumen financiero antes del histórico. Se descartó lo que solo funciona con datos que no teníamos.' },
    { title: 'Doce exploraciones antes de decidir.', why: 'El método de las tres alternativas se queda corto cuando el coste de equivocarse es una pantalla que se usa cien veces al día.', changed: 'Doce composiciones reducidas a cuatro direcciones comparables.', figure: { diagram: 'grid-12-4-1' } },
    { title: 'Jerarquía por decisión.', why: 'Lo primero que se mira es lo que cambia una acción, no lo que hay más de.', changed: 'Riesgo y actividad arriba; histórico abajo.', figure: { shot: shot('11-resumen-comercial', 'Resumen comercial', 'Resumen comercial') } },
  ],
  system: { body: ['La pantalla se compone con los componentes del catálogo; el descarte documentado es lo que evita volver a discutir la misma decisión seis meses después.'] },
  design: [
    shot('11-resumen-comercial', 'Resumen comercial', 'Resumen comercial'),
    shot('17-agenda-reuniones', 'Agenda de reuniones', 'Agenda de reuniones del cliente'),
    shot('15-notas-comite', 'Notas de comité', 'Notas de comité vinculadas al cliente'),
  ],
  implementation: ['Una pantalla en producción y un documento de criterio: por qué se descartaron las otras once.'],
  result: {
    output: [
      { value: '12', label: 'alternativas exploradas', meaning: 'Composiciones completas, no variantes de color: cada una respondía a un criterio distinto.' },
      { value: '4', label: 'direcciones finalistas', meaning: 'Comparables entre sí y validadas con el equipo y con criterio de negocio.' },
    ],
    outcome: 'unavailable',
    measure: 'Validé con el equipo y no con usuarios. Teniéndolos a dos mesas, cinco sesiones de quince minutos habrían salido más baratas que cualquier debate interno: tiempo hasta entender una cuenta, antes y después.',
  },
  learnings: [
    'El criterio escrito vale más que la pantalla: es lo que sobrevive al siguiente debate.',
    'Con usuarios a dos mesas, no validar con ellos fue la decisión más cara del proyecto.',
  ],
  next: 'design-system',
};
