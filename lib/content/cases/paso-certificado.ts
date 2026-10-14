import { shot, type CaseStudy } from './types';

/* Fuentes: el ticket APRD-513, el Figma del paso (anatomía, plantillas y
   pantallas del flujo) y el proceso tal como lo contó Víctor el 2026-10-14.
   El cliente no se nombra y las capturas salen de la demo con datos
   ficticios o de pantallas de HERMES sin marca de cliente. Lo que solo
   existe en la demo se dice en la propia frase. */
export const pasoCertificado: CaseStudy = {
  slug: 'paso-certificado', title: 'Paso Certificado: cuatro modelos legales, un solo cuerpo editable', company: 'HERMES', years: '2025',
  tagline: 'Un paso nuevo en el flujo de emisión de caución: elegir idioma y modelo de certificado, y adaptar el cuerpo sin tocar lo que obliga a la aseguradora.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Editor', 'TipTap'], brand: '#123a63',
  hero: shot('pc-paso', 'Paso Certificados: idioma, plantilla, panel de variables y el A4 con el cuerpo editable', 'Demo del paso con datos ficticios: variables a la izquierda, el certificado a la derecha'),
  context: 'Un tenant de HERMES que emite seguros de caución necesitaba un paso nuevo, CERTIFICADO, en el flujo de emisión: elegir español o inglés, elegir uno de cuatro modelos y editar el contenido de cada documento con variables de la póliza.',
  role: 'Diseño del paso y del modelo del documento. Research desk y benchmark, y la elección del editor junto a front lead, PO y back.',
  delivery: 'Paso CERTIFICADO con el A4 partido en regiones, cuerpo editable sobre TipTap y variables de la póliza. Hoy hay además una demo pública que lo reconstruye con datos ficticios.',
  problem: [
    'Cuatro modelos (Abogacía del Estado, Privado, Almacenamiento y Público con fecha para tasas aeroportuarias) en dos idiomas. Cada operación pide su cuerpo, pero cabecera, logotipo y pie no pueden cambiar.',
    'Nunca había diseñado un sistema de creación de documentos en HERMES, y el ticket pedía un editor «WYSIWYG o similar» sin decir cuál.',
  ],
  complexity: { diagram: 'certificate-regions', caption: 'La anatomía antes que las pantallas: cinco regiones, cuatro fijas y comunes a las cuatro plantillas. Solo el cuerpo entra en el editor.' },
  challenge: {
    title: 'El reto',
    items: [
      { title: 'Un terreno nuevo', body: 'Primer sistema de creación de documentos en HERMES: no había patrón propio del que partir ni editor elegido.' },
      { title: 'Flexibilidad frente a control', body: 'Quien emite necesita adaptar el cuerpo a cada operación; lo que obliga a la aseguradora tiene que salir igual en cada certificado.' },
      { title: 'Un dato que backend pueda guardar', body: 'El contenido tenía que llegar al document_model como estructura, no como HTML libre que luego haya que interpretar.' },
    ],
  },
  flows: {
    title: 'Cómo se eligió el editor',
    caption: 'Cuando no sé por dónde empezar, pido ayuda. El orden importa: primero qué hacen otros, después el equipo.',
    list: [{
      title: 'De la investigación a TipTap', side: 'Diseño, front lead, PO y back',
      steps: [
        { n: '1', t: 'Research desk', d: 'Benchmark de otros productos y herramientas de design thinking para ordenar lo encontrado.' },
        { n: '2', t: 'Front lead', d: 'Le explico la idea que sale de la investigación.' },
        { n: '3', t: 'PO', d: 'La contrasto con negocio: qué necesita el paso y para quién.' },
        { n: '4', t: 'Los tres juntos', d: 'A los dos o tres días, el front lead trae un par de aplicaciones. Coincidimos en dos.' },
        { n: '5', t: 'Back', d: 'No sabíamos cómo encajaban con la base de datos: un par de horas de investigación y reunión con back. Las dos funcionaban.' },
        { n: '6', t: 'Decisión de diseño', d: 'Con las dos viables, me tocó elegir cuál se adaptaba mejor al diseño: TipTap.' },
      ],
    }],
  },
  decisions: [
    { title: 'Partir el A4 en regiones antes de dibujar pantallas.', why: 'Las cuatro plantillas comparten cabecera, apoderamiento, firma y pie; solo cambia el cuerpo.', changed: 'Lo fijo se pinta desde la plantilla y no entra en el editor, así que no hay permiso que saltarse: la restricción es estructural.', figure: { shot: shot('pc-anatomia', 'Modo anatomía de la demo con las cinco regiones etiquetadas', 'Anatomía: cuatro regiones fijas y el cuerpo editable, etiquetadas sobre el A4') } },
    { title: 'Pedir ayuda antes de elegir herramienta.', why: 'Era un terreno nuevo. El research desk dio las opciones; el equipo, el filtro técnico.', changed: 'Front lead y PO por separado y después juntos. La duda sobre la base de datos se resolvió con back en un par de horas, no con una suposición.', figure: { shot: shot('pc-figma-comandos', 'Exploración en Figma del editor de HERMES con el menú de comandos abierto', 'Exploración en Figma: comandos con / agrupados en estilo global, estilo de documento y datos de sistema') } },
    { title: 'TipTap, elegido por cómo encaja en el diseño.', why: 'Front y back validaron las dos finalistas: la última pregunta ya no era técnica.', changed: 'TipTap es headless: toolbar, menús y chips salen del design system. La variable puede ser un nodo propio y el cuerpo sale como JSON para el document_model.', tradeoff: 'Al ser headless, toda la interfaz del editor (toolbar, menús y variables) hay que diseñarla y construirla; no viene de serie.', figure: { shot: shot('pc-variables', 'Menú de variables abierto con @ en el cuerpo del certificado', 'Variables con @ y desde el panel lateral: el dato de la póliza entra como un nodo, no como texto entre llaves') } },
    { title: 'Las variables, a la vista y con nombre de negocio.', why: 'El ticket pedía el listado de variables a la izquierda y el editor a la derecha: quien emite no tiene por qué saber qué es {{ tomador.nombre }}.', changed: 'Cada variable se lee como «Tomador · Nombre» y la clave queda para backend. En la demo se puede alternar entre la etiqueta y el dato real de la póliza.', figure: { shot: shot('pc-document-model', 'Demo con los datos de la póliza resueltos y el document_model abierto', 'Datos de la póliza resueltos y, al lado, el document_model que recibe backend') } },
  ],
  system: {
    body: [
      'La anatomía es el sistema: la misma estructura de cinco regiones sirve a las cuatro plantillas y a los dos idiomas, y el tenant solo aporta marca y razón social.',
      'La demo pública reconstruye el paso con datos ficticios sobre TipTap: variables como nodos atómicos, comandos con / y @, y el document_model en vivo. Cada criterio de aceptación del ticket tiene su test.',
    ],
    code: {
      title: 'Una variable como nodo atómico de TipTap',
      lang: 'ts',
      source: 'repo',
      href: 'https://github.com/vctrmz/proyectos/blob/main/demos/certificado-caucion/src/editor/VariableNode.ts',
      code: "export const VariableNode = Node.create({\n  name: 'variable',\n  group: 'inline',\n  inline: true,\n  atom: true, // se mueve y se borra entera; no se escribe dentro\n  addAttributes() {\n    return { key: { default: null } }; // 'tomador.nombre'\n  },\n  renderText({ node }) {\n    return `{{ ${node.attrs.key} }}`; // al copiar, la sintaxis del ticket\n  },\n});",
    },
    uiKit: [
      { kind: 'slots', title: 'Cuerpo con variables', body: 'El dato de la póliza entra como un nodo con nombre de negocio. El resto de la página se pinta desde la plantilla.', wide: true },
      { kind: 'phases', title: 'Un paso más en la emisión', body: 'CERTIFICADO va entre Bastanteo y Resumen: la póliza ya tiene sus datos cuando llega aquí.', wide: true, label: 'Paso 10 de 11 · salida: certificado emitido' },
      { kind: 'states', title: 'Estado del cuerpo', body: 'Se ve si el cuerpo sigue igual que la plantilla aprobada o si se ha adaptado.', wide: true, labels: ['Plantilla', 'Modificado', 'Sin dato', 'Emitido'] },
      { kind: 'actions', title: 'Jerarquía de acción', body: 'Continuar cierra el paso; guardar es reversible; volver no pesa.', wide: true, label: 'Continuar', labels: ['Guardar y terminar después', 'Anterior'] },
    ],
  },
  demo: { id: 'paso-certificado', intro: 'Reconstrucción navegable del paso, hecha para este portfolio con datos ficticios: el prototipo y la presentación del caso, en una pestaña aparte.' },
  design: [
    shot('pc-hueco', 'Vista previa del certificado con un dato de la póliza sin rellenar', 'En la demo, un dato que falta se marca en la vista previa y no deja emitir'),
    shot('pc-emitida', 'Resumen de la póliza emitida con el certificado entre los documentos', 'En la demo, el certificado sale como uno más de los documentos de la póliza'),
    shot('pc-figma-emitida', 'Pantalla de póliza emitida en HERMES con los documentos generados', 'Figma: cierre del flujo en HERMES, con los documentos que se generan'),
  ],
  implementation: [
    'Tras la elección, implementación y desarrollo con front sobre TipTap.',
    'La demo pública de este portfolio usa el mismo modelo de regiones, variables y document_model, con un test por criterio de aceptación.',
  ],
  result: {
    output: [
      { value: '4 · 2', label: 'modelos de certificado e idiomas', meaning: 'Abogacía del Estado, Privado, Almacenamiento y Público con fecha, en español e inglés, sobre una sola anatomía.' },
      { value: '1 de 5', label: 'regiones editables', meaning: 'Solo el cuerpo entra en el editor; cabecera, apoderamiento, firma y pie salen de la plantilla.' },
      { value: '2', label: 'finalistas viables antes de elegir', meaning: 'Front y back validaron las dos aplicaciones; la elección de TipTap fue de diseño.' },
    ],
    outcome: 'unavailable',
    measure: 'Sin instrumentar: tiempo de emisión por certificado, certificados rehechos fuera del sistema y cuerpos modificados respecto a la plantilla.',
  },
  learnings: [
    'Cuando no sé por dónde empezar, pido ayuda: research desk primero y el equipo después.',
    'Si front y back validan dos opciones, la última decisión puede y debe ser de diseño.',
    'Partir el documento en regiones antes de dibujar pantallas resolvió a la vez lo legal y lo técnico.',
  ],
  next: 'vista-360',
};
