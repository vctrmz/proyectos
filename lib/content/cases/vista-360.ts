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
  system: {
    body: ['La pantalla se compone con los componentes del catálogo; el descarte documentado es lo que evita volver a discutir la misma decisión seis meses después.'],
    code: { title: 'Tokens de la vista: jerarquía por decisión', lang: 'json', code: "{\n  \"color\": {\n    \"riesgo\":    { \"alto\": \"#c0392b\", \"medio\": \"#d97706\", \"bajo\": \"#1f9d55\" },\n    \"actividad\": { \"reciente\": \"#2f5bea\", \"inactiva\": \"#6a6a71\" },\n    \"surface\":   \"#f6f7fb\",\n    \"ink\":       \"#121317\"\n  },\n  \"font\": {\n    \"size\":   { \"dato\": 14, \"cifra\": 28, \"identidad\": 22 },\n    \"weight\": { \"regular\": 400, \"medium\": 500 }\n  },\n  \"radius\": { \"card\": 12, \"avatar\": 999 },\n  \"grid\":   { \"columnas\": 12, \"gutter\": 16, \"cabecera\": \"persistente\" }\n}" },
    uiKit: [
      { kind: 'identity', title: 'Cabecera de identidad', body: 'Persistente: quién es el cliente y su nivel de riesgo no se pierden al recorrer la pantalla.', wide: true, label: 'riesgo alto' },
      { kind: 'table', title: 'Pólizas, recibos y pagos', body: 'Una sola vista sostiene equipo, pólizas, recibos y los pagos a cada interesado, sin saltar de módulo.', wide: true },
      { kind: 'states', title: 'Riesgo y actividad', body: 'Alto, medio y bajo con color y fondo propios; la actividad reciente se distingue de la inactiva de un vistazo.', wide: true },
      { kind: 'scale', title: 'Tarjeta y avatar', body: 'Dos radios para toda la vista: tarjeta y avatar. Con doce columnas y una cabecera fija, basta.', wide: true },
    ],
  },
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
    /* Outcome derivado: cada cifra es aritmética sobre un dato que el caso ya
       documenta, y su explicación dice de dónde sale. Lo que no se midió sigue
       declarado abajo, en `measure`. */
    outcome: [
      { value: '12 → 1', label: 'composiciones hasta la que se usa', meaning: 'Doce exploraciones reducidas a cuatro direcciones comparables y de ahí a una en producción, con el motivo de cada descarte por escrito.' },
      { value: '0', label: 'veces que se reabrió la decisión', meaning: 'El descarte documentado es lo que evita volver a discutir la misma pantalla seis meses después: por eso se escribió.' },
      { value: '1', label: 'vista para todo el equipo', meaning: 'Comercial, soporte y dirección miran la misma pantalla en lugar de tres informes distintos.' },
    ],
    measure: 'Validé con el equipo y no con usuarios. Teniéndolos a dos mesas, cinco sesiones de quince minutos habrían salido más baratas que cualquier debate interno: tiempo hasta entender una cuenta, antes y después.',
  },
  learnings: [
    'El criterio escrito vale más que la pantalla: es lo que sobrevive al siguiente debate.',
    'Con usuarios a dos mesas, no validar con ellos fue la decisión más cara del proyecto.',
  ],
  next: 'design-system',
};
