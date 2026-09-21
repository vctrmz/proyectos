import { shot, type CaseStudy } from './types';

export const suscripcion: CaseStudy = {
  slug: 'suscripcion', title: 'Módulo de suscripción de cliente', company: 'HERMES Admin', years: '2025',
  tagline: 'Tres meses de proceso manual en Excel, convertidos en un módulo en producción en cinco semanas.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'SaaS multi-tenant'], brand: '#24346e',
  hero: shot('01-datos-del-contacto', 'Fase 1, cualificación: contacto principal y perfil del cliente', 'Fase 1 · Cualificación: contacto principal, perfil del cliente y resumen vivo de la empresa'),
  context: 'Cualificación, negociación, presupuesto, contrato y facturación se operaban a mano entre hojas de cálculo y correos: hasta tres meses de ciclo y seis roles distintos. El encargo cabía en una frase: automatizar esto, dame ideas.',
  role: 'Único diseñador, con triple aprobación de CTO, CEO y responsable de la empresa, y la restricción de entregar sobre el catálogo de componentes que ya existía.',
  delivery: 'Módulo web en tres fases sobre el catálogo Hermes Tenant, con agenda, comité, preparación de producto, método de pago y contratos.',
  problem: [
    'No había módulo: había un proceso manual que nadie había mirado de frente, sin especificación, sin alcance y sin una sola métrica.',
    'Un proceso repartido en correos no deja rastro que medir; el encargo incluía acotar el alcance, no solo diseñarlo.',
  ],
  complexity: { diagram: 'state-machine', caption: 'Tres fases con audiencias, permisos y criterios de salida propios, en lugar de un asistente de veinte pasos.' },
  decisions: [
    { title: 'No abrir Figma hasta entender el proceso manual.', why: 'El Excel que ya usaban era la mejor especificación disponible: un proceso manual que funciona te dice qué información necesita el negocio y en qué orden.', changed: 'Tres entrevistas con el closer que lo hacía a mano y los criterios de salida de cada stakeholder antes de dibujar una pantalla.', figure: { shot: shot('02-notas-y-comite', 'Comité: acuerdo votado con quórum y deadline', 'Comité: el acuerdo se vota con quórum, deadline y conversación trazada') } },
    { title: 'Research por observación indirecta.', why: 'Sin acceso a usuarios de módulos comparables, la alternativa era diseñar de memoria.', changed: 'Benchmark en Mobbin y grabaciones de operadores reales como proxy. Los patrones no se copiaron: se filtraron contra nuestro modelo de negocio y varios se recategorizaron en otros módulos.', figure: { shot: shot('06-agenda-participantes', 'Agenda con participantes sugeridos por tipo de reunión', 'Agenda: el tipo de reunión sugiere quién debe asistir de cada lado') } },
    { title: 'Máquina de estados, no wizard.', why: 'Veinte pasos lineales obligan a todos los roles a recorrer el mismo camino.', changed: 'Tres fases (cualificación, negociación, cerrado) con audiencias, permisos y criterios de salida propios. El 100 % de la interfaz se apoya en el sistema de componentes consolidado antes de empezar.', figure: { shot: shot('03-metodo-de-pago', 'Método de pago con checklist de bloqueos', 'Método de pago: SEPA, datos fiscales y calendario, con checklist de lo que bloquea la firma') } },
    { title: 'Mover al producto lo que vivía en la experiencia del closer.', why: 'En las entrevistas apareció algo que ningún requisito recogía: el closer justificaba cada dato al cliente en directo.', changed: 'Dos bloques persistentes junto a cada formulario. Un closer nuevo opera el flujo sin haber hecho las llamadas.', figure: { shot: shot('05-contratos', 'Contratos firmados con estado por documento', 'Contratos firmados, con firmantes, motor de firma y estado por documento') } },
  ],
  system: {
    body: [
      'Partí de los componentes de Hermes Tenant en lugar de inventar patrones: el equipo ensambla en vez de construir y quien ya opera el producto no tiene curva de aprendizaje.',
      'El panel de contexto, el editor con comentarios y el agendador se diseñaron para reincorporarse al catálogo: el sistema alimenta el módulo y el módulo devuelve componentes al sistema.',
    ],
    code: { title: 'Una fase como objeto, no como pantalla', lang: 'ts', code: `const fases = [
  { id: 'cualificacion', audiencia: ['closer', 'cliente'], salida: ['contacto', 'perfil', 'comite:aprobado'] },
  { id: 'negociacion',   audiencia: ['closer', 'legal', 'cliente'], salida: ['propuesta:firmada'] },
  { id: 'cerrado',       audiencia: ['finanzas', 'onboarding'], salida: ['pago:validado', 'producto:preparado'] },
] as const;

// la UI no decide el siguiente paso: lo decide la salida cumplida
const siguiente = (f: typeof fases[number], hechos: string[]) =>
  f.salida.every((s) => hechos.includes(s)) ? fases[fases.indexOf(f) + 1] : f;` },
  },
  design: [
    shot('01-datos-del-contacto', 'Datos del contacto', 'Fase 1 · Cualificación: contacto principal, perfil del cliente y resumen vivo de la empresa'),
    shot('04-preparar-producto', 'Preparar producto', 'Preparar producto: módulos, plugins e idiomas del sistema por cliente'),
    shot('19-reservar-agenda', 'Reservar agenda', 'Reservar agenda: disponibilidad de ambos lados en la misma vista'),
    shot('20-drawer-contrato', 'Detalle de contrato en panel lateral', 'Contrato en panel lateral: el contexto no se pierde al revisar'),
  ],
  implementation: [
    'La agenda con transcripción y resumen automáticos no estaba en el encargo. La llevé primero a front y back para validar viabilidad, herramientas y coste, y solo después al PO y al CEO: una propuesta con la viabilidad validada deja de ser una petición y pasa a ser una opción.',
    'La triple aprobación obligaba a defender la misma decisión en tres lenguajes: viabilidad técnica, impacto de negocio y operación diaria.',
  ],
  result: {
    output: [
      { value: '5', label: 'semanas del arranque al primer cliente en producción', meaning: 'Frente a un ciclo manual de hasta tres meses. Sale en cinco semanas porque la interfaz se apoya en un sistema consolidado antes de empezar.' },
      { value: '3 · 6', label: 'fases y roles', meaning: 'Cada fase con su audiencia, sus permisos y su criterio de salida: el alcance deja de negociarse dos veces.' },
      { value: '1', label: 'artefacto para ventas y producto', meaning: 'El mismo módulo sirve a ventas para cerrar y a producto para estimar.' },
    ],
    outcome: 'unavailable',
    measure: 'Tiempo de ciclo por cliente antes y después, errores por fase y cuántos closers nuevos operan el flujo sin acompañamiento. Nada de eso se instrumentó al salir.',
  },
  learnings: [
    'Definir el problema antes de resolverlo fue el encargo real; la pantalla vino después.',
    'La parte del trabajo que más me formó como lead fue defender la misma decisión ante tres audiencias.',
  ],
  next: 'editor-propuesta',
};
