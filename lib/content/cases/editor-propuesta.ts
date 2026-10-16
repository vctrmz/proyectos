import { shot, type CaseStudy } from './types';

export const editorPropuesta: CaseStudy = {
  slug: 'editor-propuesta', title: 'Editor de certificados con TipTap', company: 'HERMES Admin', years: '2025',
  tagline: 'El paso Certificado del flujo de caución: elegir el modelo, ajustar el texto con datos del sistema y emitirlo con la póliza, sin tocar lo que el documento legal fija.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Editor'], brand: '#2b3f85',
  hero: shot('ep-comandos', 'Editor del modelo de documento con el menú de comandos abierto', 'Editor: datos del sistema y estilos con /'),
  context: 'HERMES, tenant Barents, producto Caución: un paso nuevo, CERTIFICADO, dentro del flujo de emisión. Cuatro modelos en español o en inglés: Abogacía del Estado, Privado, Almacenamiento y Público con fecha para tasas aeroportuarias.',
  role: 'Diseño del paso, del editor y de las cuatro plantillas A4, con Legal y con backend.',
  delivery: 'Paso Certificado en el flujo, editor headless sobre TipTap con comandos /, plantillas rediseñadas y el certificado generado junto a la póliza.',
  problem: [
    'Un certificado de caución es un documento legal con la marca de quien lo emite: cabecera, logotipo y pie no se pueden tocar, pero el cuerpo tiene que ajustarse a cada operación.',
    'Un área de texto libre rompe el documento; una cerrada no deja ajustarlo. Había que decidir qué se edita, qué se rellena solo y qué queda fijo.',
  ],
  complexity: { diagram: 'template-slots', caption: 'La plantilla del certificado: cabecera, logotipo y pie fijos; el cuerpo editable, con datos del sistema y estilos insertados con /.' },
  decisions: [
    { title: 'Lo fijo se queda fuera del editor.', why: 'Cabecera, logotipo y pie son los del documento legal y la marca del tenant; si se pueden tocar, alguien los tocará.', changed: 'El editor solo abre el cuerpo del certificado. La plantilla se elige por tipo de certificado y el resto del A4 llega bloqueado.', figure: { shot: shot('ep-plantilla-nueva', 'Certificado de seguro de caución en A4 con el nuevo estilo', 'La plantilla del certificado: la estructura legal no se toca, solo el cuerpo') } },
    { title: 'Datos y estilos con un solo gesto: /.', why: 'El brief pedía una lista de variables a un lado del editor. Un menú / deja el foco en el texto y agrupa en un sitio el estilo global, el del documento y los datos del sistema.', changed: 'Personas, brokers, aseguradora, tablas y gráficas se insertan desde el mismo menú, y en el texto quedan como variables ${…} que se rellenan al emitir.', figure: { shot: shot('ep-comandos', 'Menú de comandos con estilo global, estilo de documento y datos de sistema', 'Comandos con /: estilo global, estilo del documento y datos del sistema') } },
    { title: 'TipTap, decidido con el front lead.', why: 'Headless y de núcleo MIT sobre ProseMirror: la interfaz es nuestra, sin coste de licencia, y su utilidad de sugerencias resuelve el menú / sin levantar un editor desde cero.', changed: 'La elección salió de una conversación, no de una imposición: pesaba lo que el cliente pedía, lo que el sistema aguantaba y lo que costaba mantener.', figure: { shot: shot('ep-variables', 'Texto del certificado con variables del sistema en negrita', 'En producción: el texto es plantilla y los datos entran como variables ${…}') } },
  ],
  system: {
    body: [
      'Un solo comando, /, para todo lo que se inserta: estilo global, estilo del documento y datos del sistema. Se explicó con una guía de uso y una demo en vivo antes del despliegue, porque asumir que se entiende es donde se pierden los editores.',
      'Las cuatro plantillas A4 se rediseñaron sobre la misma anatomía de márgenes, cabecera y pie para que el texto editable cayera siempre en el mismo sitio.',
      'Usé IA generativa para redactar variantes de microcopy legal y descartarlas rápido con Legal delante.',
    ],
    code: { title: 'Tokens del editor: variables, comandos y marco fijo', lang: 'json', code: "{\n  \"color\": {\n    \"variable\":  { \"ink\": \"#ffffff\", \"bg\": \"#121317\" },\n    \"comando\":   { \"ink\": \"#ffffff\", \"bg\": \"#4a44f2\" },\n    \"fijo\":      { \"ink\": \"#6a6a71\", \"bg\": \"#f1f2f6\", \"editable\": false }\n  },\n  \"font\": {\n    \"family\": { \"texto\": \"Inter\", \"codigo\": \"ui-monospace\" },\n    \"size\":   { \"variable\": 13, \"body\": 15, \"titulo\": 22 }\n  },\n  \"radius\": { \"variable\": 999, \"bloque\": 12, \"documento\": 16 },\n  \"space\":  { \"linea\": 8, \"parrafo\": 16, \"seccion\": 32 }\n}" },
    uiKit: [
      { kind: 'slots', title: 'Cuerpo editable, marco fijo', body: 'Cabecera y pie llegan bloqueados; en el cuerpo, los datos del sistema entran como variables y el resto se inserta con /. La restricción vive en la plantilla, no en la disciplina de quien escribe.', wide: true },
      { kind: 'actions', title: 'Jerarquía de acción', body: 'Continuar cierra el paso y va en color de marca; Actualizar regenera la vista previa; Anterior no pesa.', wide: true, label: 'Continuar', labels: ['Actualizar', 'Anterior'] },
      { kind: 'scale', title: 'Esquinas del documento', body: 'Variable, bloque y documento tienen su radio propio: la jerarquía se lee antes de leer el texto.', wide: true },
    ],
  },
  design: [
    shot('ep-editor-vacio', 'Editor del modelo de documento vacío con la plantilla de certificado elegida', 'Punto de partida: se elige la plantilla y se escribe, o se pulsa / para insertar'),
    shot('ep-comandos', 'Menú de comandos sobre el texto del certificado', 'Comandos con /: estilo global, estilo del documento y datos del sistema (personas, brokers, aseguradora, tablas y gráficas)'),
    shot('ep-certificados', 'Paso Certificados dentro del suplemento, con editor y vista previa', 'Certificados como un paso más del suplemento, con la vista previa a un clic'),
    shot('ep-variables', 'Texto del certificado en producción con variables del sistema', 'En producción: el texto lleva variables del sistema (${…}) que se rellenan al emitir'),
    shot('ep-plantilla-original', 'Plantilla original del certificado de caución en A4', 'Plantilla original del certificado de caución (datos personales ocultos)'),
    shot('ep-plantilla-nueva', 'Plantilla del certificado con el nuevo estilo en A4', 'La misma plantilla con el nuevo estilo: cabecera de marca y enlaces reconocibles (datos personales ocultos)'),
    shot('ep-resumen', 'Resumen de la oportunidad con el bloque Certificado entre coberturas y datos del vehículo', 'Resumen de la oportunidad: el tipo de certificado es un bloque más, editable como el resto'),
    shot('ep-poliza', 'Póliza emitida con la lista de documentos generados', 'Póliza emitida: el certificado se genera junto a las condiciones y el resumen de coberturas'),
    shot('ep-pdf', 'Visor PDF con el certificado de caución generado', 'Vista previa del certificado en PDF antes de descargarlo o imprimirlo (datos personales ocultos)'),
  ],
  implementation: [
    'El editor se desbloqueó cuando el equipo trajo TipTap: el filtro técnico cambió el diseño.',
    'Guía de uso y presentación al cliente antes del despliegue; el cliente se adaptó sin fricción.',
  ],
  result: {
    output: [
      { value: '4', label: 'plantillas sobre un mismo editor', meaning: 'Abogacía del Estado, Privado, Almacenamiento y Público con fecha para tasas aeroportuarias: un solo paso y un solo editor para los cuatro modelos.' },
      { value: '2', label: 'equipos co-diseñando', meaning: 'Legal y backend en la misma mesa desde la plantilla, no después.' },
    ],
    /* Outcome derivado: cada cifra es consecuencia del modelo que el caso
       documenta, y su explicación dice de dónde sale. Lo que no se midió sigue
       declarado abajo, en `measure`. */
    outcome: [
      { value: '0', label: 'ediciones posibles en cabecera, logotipo y pie', meaning: 'El editor solo abre el cuerpo del certificado: lo que fija el documento legal no se puede tocar. Es una consecuencia del diseño, no una medición.' },
      { value: '1', label: 'comando para estilos y datos', meaning: 'Con / se insertan estilo global, estilo del documento y datos del sistema: un gesto, y es lo que se explica en la guía de uso.' },
      { value: '1', label: 'flujo del borrador al PDF', meaning: 'El certificado se elige, se ajusta y se previsualiza dentro del flujo, y se genera con la póliza junto a las condiciones y el resumen de coberturas.' },
    ],
    measure: 'Certificados emitidos sin retoque manual, tiempo por certificado y errores de datos en el documento antes y después.',
  },
  learnings: [
    'Un patrón nuevo no se entiende solo: la adopción se diseña igual que la interfaz.',
    'Las decisiones técnicas acordadas con el front lead duran más que las impuestas.',
  ],
  next: 'vista-360',
};
