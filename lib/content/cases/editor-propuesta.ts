import { shot, type CaseStudy } from './types';

export const editorPropuesta: CaseStudy = {
  slug: 'editor-propuesta', title: 'Editor de propuesta con TipTap', company: 'HERMES Admin', years: '2025',
  tagline: 'La fase en que se arma la propuesta con el cliente: documento, variables y comentarios en un sitio, auditable mientras se escribe.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Editor'], brand: '#2b3f85',
  hero: shot('12-editor-variables', 'Editor de propuesta con variables', 'Editor: variables con @ y componentes con /'),
  context: 'Segunda fase del módulo de suscripción: se arma la propuesta, se ajustan condiciones y se recogen los comentarios de las dos partes. Todo eso vivía en documentos sueltos.',
  role: 'Diseño del editor y del modelo del documento, en pareja estable con Legal y con backend.',
  delivery: 'Editor headless sobre TipTap con plantilla, variables, bloques opcionales e historial de comentarios.',
  problem: [
    'Cada versión de la propuesta se alejaba un poco más de la plantilla aprobada, y al firmar nadie sabía qué se había cambiado.',
    'Hacía falta rastro auditable de lo que se rellena, lo que es opcional y lo que está bloqueado.',
  ],
  complexity: { diagram: 'template-slots', caption: 'Plantilla con huecos: variables con @, componentes con /, cláusulas opcionales como bloques que se activan.' },
  decisions: [
    { title: 'Frenar el editor libre y reconducirlo a plantilla con huecos.', why: 'Menos libertad, mucho menos riesgo: el texto libre es donde se pierde la trazabilidad.', changed: 'Las cláusulas opcionales son bloques que se activan; lo bloqueado no se puede tocar.', figure: { shot: shot('14-document-model', 'Modelo del documento', 'Modelo del documento: la restricción vive en el dato') } },
    { title: 'TipTap, decidido con el front lead.', why: 'Se ajustaba a los requerimientos del cliente y a nuestro modelo de bloques sin coste de licencia, frente a levantar un editor desde cero.', changed: 'La elección salió de una conversación, no de una imposición: pesaba lo que el cliente pedía, lo que el sistema aguantaba y lo que costaba mantener.', figure: { shot: shot('13-historial-comentarios', 'Historial de comentarios', 'Historial de comentarios de las dos partes sobre el mismo documento') } },
    { title: 'Las validaciones, diseñadas con quien responde de la auditoría.', why: 'Diseñarlas después de Legal es diseñarlas dos veces.', changed: 'Trabajé el modelo del documento con Legal y backend a la vez, para que la restricción viviera en el dato y no solo en la interfaz.', figure: { shot: shot('04-detalle-documento', 'Detalle del documento', 'Detalle del documento: qué falta, qué es opcional y qué no se puede tocar') } },
  ],
  system: {
    body: [
      'Variables con @ y componentes con /: un patrón de comandos que se explica en una guía de uso y una demo en vivo antes del despliegue, porque asumir que se entiende es donde se pierden los editores.',
      'Usé IA generativa para redactar variantes de microcopy legal y descartarlas rápido con Legal delante.',
    ],
    code: { title: 'Tokens del editor: variables, bloques y esquinas', lang: 'json', code: "{\n  \"color\": {\n    \"variable\":  { \"ink\": \"#ffffff\", \"bg\": \"#121317\" },\n    \"componente\": { \"ink\": \"#ffffff\", \"bg\": \"#4a44f2\" },\n    \"opcional\":  { \"ink\": \"#6a6a71\", \"border\": \"#6a6a71\", \"style\": \"dashed\" },\n    \"bloqueado\": { \"ink\": \"#6a6a71\", \"bg\": \"#f1f2f6\" }\n  },\n  \"font\": {\n    \"family\": { \"texto\": \"Inter\", \"codigo\": \"ui-monospace\" },\n    \"size\":   { \"variable\": 13, \"body\": 15, \"titulo\": 22 }\n  },\n  \"radius\": { \"variable\": 999, \"bloque\": 12, \"documento\": 16 },\n  \"space\":  { \"linea\": 8, \"parrafo\": 16, \"seccion\": 32 }\n}" },
  },
  design: [
    shot('12-editor-variables', 'Editor con variables', 'Editor con variables'),
    shot('14-document-model', 'Modelo del documento', 'Modelo del documento'),
    shot('13-historial-comentarios', 'Historial de comentarios', 'Historial de comentarios'),
    shot('21-notas-alternativa', 'Alternativa descartada de notas', 'Alternativa descartada: notas sueltas sin modelo'),
  ],
  implementation: [
    'El editor se desbloqueó cuando el equipo trajo TipTap: el filtro técnico cambió el diseño.',
    'Guía de uso y presentación al cliente antes del despliegue; el cliente se adaptó sin fricción.',
  ],
  result: {
    output: [
      { value: '@ · /', label: 'dos comandos para todo el documento', meaning: 'Variables con @ y componentes con /: el usuario aprende dos gestos, no un editor.' },
      { value: '2', label: 'equipos co-diseñando', meaning: 'Legal y backend en la misma mesa desde el modelo del documento, no después.' },
    ],
    outcome: 'unavailable',
    measure: 'Versiones por propuesta, cambios fuera de plantilla detectados y tiempo hasta firma antes y después.',
  },
  learnings: [
    'Un patrón nuevo no se entiende solo: la adopción se diseña igual que la interfaz.',
    'Las decisiones técnicas acordadas con el front lead duran más que las impuestas.',
  ],
  next: 'vista-360',
};
