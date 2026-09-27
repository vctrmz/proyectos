import { shot, type CaseStudy } from './types';

export const ayax: CaseStudy = {
  slug: 'ayax', title: 'Enseñar una categoría que nadie conoce', company: 'Ayax Suscripción de Riesgos', years: '2024–2026',
  tagline: 'Una agencia de suscripción que trabaja con Lloyd’s, de folleto corporativo a plataforma de captación bilingüe: tres audiencias opuestas y ni una sola cotización online.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Marca y sistema'], brand: '#000A29',
  hero: shot('ayax-x_hero', 'Cabecera de la web de Ayax: vídeo de Málaga, titular «Agencia de suscripción de seguros» y sello Coverholder at Lloyd’s', 'La portada abre con la categoría y la credencial de Lloyd’s en el mismo pliegue'),
  context: 'Ayax diseña y suscribe seguros por delegación de aseguradoras, entre ellas Lloyd’s. Veintiún meses de evolución continua: arquitectura, sistema de diseño, seis fichas de producto, una landing de conversión propia, segunda lengua completa y la marca que lo sostiene.',
  role: 'Product Designer único: arquitectura de información, sistema, interfaz, captación y marca, con los tokens en el mismo repositorio que consume desarrollo.',
  delivery: 'Sitio bilingüe con catálogo y fichas, landing de taxi, sección de partners, evento anual, brand book, piezas de redes y los emails de cada flujo de captación.',
  problem: [
    '«Agencia de suscripción» no significa nada para quien busca un seguro: antes de vender hay que enseñar la categoría y dónde encaja Ayax en la cadena.',
    'Y hay que convertir sin precio: no existe tarificador ni carrito, así que toda la conversión pasa por formularios y por lo que ocurre después de enviarlos.',
  ],
  complexity: { diagram: 'value-chain', caption: 'La aseguradora delega, Ayax tarifica y paga el siniestro, el partner distribuye y el cliente compra: el sitio tiene que explicar esta cadena antes de vender nada.' },
  decisions: [
    { title: 'El titular dice qué es la empresa, no qué siente el cliente.', why: 'Cuando la categoría es desconocida, el titular es un acto pedagógico: si la portada no la nombra, el usuario no tiene dónde colgar lo que lee después.', changed: 'La portada abre con «Agencia de suscripción de seguros», la antigüedad y el sello de coverholder en el mismo pliegue.', tradeoff: 'Un titular descriptivo no diferencia. La diferenciación se delega en la segunda sección y en las landings de producto.', figure: { shot: shot('ayax-x_mosaic', 'Mosaico de productos en portada con Caución como pieza grande', 'Mosaico en portada: Caución, el ramo de más valor, ocupa el bloque grande') } },
    { title: 'Mosaico en portada, rejilla en catálogo.', why: 'Los seis ramos aparecen dos veces con dos trabajos distintos: en portada hay que jerarquizar, en catálogo hay que comparar.', changed: 'Mosaico de tamaños desiguales arriba y rejilla regular de tres columnas en el catálogo, donde el usuario ya está comparando y necesita simetría.', figure: { shot: shot('ayax-x_catalog', 'Catálogo de productos en rejilla de tres columnas', 'Catálogo: rejilla regular, fotografía de objeto por ramo y descripción corta') } },
    { title: 'La landing de taxi juega con otras reglas.', why: 'Es el negocio histórico y el de más intención directa: el taxista no quiere entender una categoría, quiere saber si le cubre y a qué precio.', changed: 'Única landing de conversión completa, con titular coloquial, cuatro beneficios en su lenguaje y comparativa de tres niveles. Construida con los mismos tokens, sin tocar las otras cinco fichas.', tradeoff: 'Rompe la plantilla que comparten los otros cinco ramos: una excepción que hay que mantener a mano cuando el sistema evoluciona.', figure: { shot: shot('ayax-x_taxi_tiers', 'Comparativa de niveles Standard, Advanced y Ultimate sobre fondo navy', 'Comparativa de niveles: Standard, Advanced y Ultimate sobre las diez coberturas') } },
    { title: 'La comparativa se arregló para el móvil, donde se rompía.', why: 'Apilada en un teléfono obligaba a memorizar diez coberturas para comparar dos niveles, y la diferencia se leía solo por un icono.', changed: 'Selector de nivel fijo arriba, estado en texto («Incluido», «Opcional», «No incluido») y resaltado de lo que añade cada nivel frente al anterior. El color dejó de ser el único portador de la información.', figure: { shot: shot('ayax-x_mobile', 'Portada de Ayax en móvil de 390 px en tres tramos', 'A 390 px: el mosaico pasa a bandas, el titular cabe en el primer pliegue y el pie colapsa en acordeón') } },
    { title: 'El formulario pide poco y lo dice todo.', why: 'Sin tarificador, el formulario es la conversión; y se recogen datos personales en un sector regulado.', changed: 'Cuatro campos y consentimiento explícito, con el botón deshabilitado hasta marcar la privacidad: el requisito legal se comunica por el estado del control, no por un error a posteriori. La oficina real aparece en el mapa, que en una empresa que vende solvencia pesa más que un formulario bonito.', wouldFix: 'Un formulario corto al final de cada ficha, con el ramo ya seleccionado, en lugar de mandar a todos al contacto general.', figure: { shot: shot('ayax-x_contact', 'Página de contacto con formulario, vías alternativas y mapa de la oficina', 'Contacto: formulario corto, vías alternativas y la oficina de Málaga en el mapa') } },
  ],
  system: {
    body: [
      'El sistema no es una biblioteca aparte: vive como tema dentro del propio proyecto, así que el diseño no se entregó como maqueta a interpretar sino como tokens y componentes en el mismo repositorio que consume desarrollo. Cero traducción manual de valores en el handoff.',
      'La paleta es deliberadamente estrecha: un navy casi negro, un único acento oliva y una familia de azules fríos. El oliva tiene una luminancia muy alta, así que solo lleva texto navy encima y en texto pequeño se sustituye por una variante más oscura de la misma familia.',
      'Las bandas de color —crema, blanco, azul muy claro y navy— sustituyen a los separadores: seis contenidos muy distintos se leen como un mismo sitio porque la secuencia se repite en todas las páginas.',
    ],
    code: { title: 'Tokens de Ayax: paleta estrecha y un solo acento', lang: 'json', code: "{\n  \"color\": {\n    \"midnightBlue.500\": \"#000A29\",\n    \"olive.500\":        \"#C3D500\",\n    \"olive.text\":       \"#8B8D00\",\n    \"royalBlue.150\":    \"#376AD1\",\n    \"background.50\":    \"#F9FFE3\",\n    \"details.500\":      \"#E6F5FD\",\n    \"text.100\":         \"#141825\",\n    \"text.300\":         \"#696868\"\n  },\n  \"font\": {\n    \"family\": \"Inter\",\n    \"size\":   { \"body\": 14, \"h4\": 20, \"h3\": 24, \"h2\": 30, \"h1\": 48 },\n    \"weight\": { \"regular\": 400, \"medium\": 600, \"bold\": 700 }\n  },\n  \"radius\": { \"sm\": 4, \"md\": 8, \"lg\": 14, \"pill\": 999 },\n  \"space\":  { \"componente\": [8, 16, 24], \"seccion\": [48, 80, 120] }\n}" },
    uiKit: [
      { kind: 'tokens', title: 'Un solo acento, con su regla', body: 'El oliva es el único color de marca que interrumpe el navy, y viene con instrucciones: nunca texto blanco encima y una variante más oscura para texto pequeño.', wide: true, labels: ['navy', 'enlace', 'oliva', 'afirmación', 'superficie', 'neutro'] },
      { kind: 'actions', title: 'Un botón que se reconoce de lejos', body: 'Cápsula en mayúsculas con icono circular y flecha que se desplaza al pasar el cursor. Si es redondo del todo, se puede pulsar.', wide: true, label: 'Contáctanos' },
      { kind: 'tiers', title: 'Comparativa de niveles legible en móvil', body: 'El estado va en texto, no solo en icono, y se resalta lo que añade cada nivel frente al anterior.', wide: true, labels: ['Standard', 'Advanced', 'Ultimate'], label: 'Incluido' },
      { kind: 'form', title: 'Consentimiento como estado, no como error', body: 'Cuatro campos, etiqueta encima, error en texto bajo el campo y envío deshabilitado hasta aceptar la privacidad.', wide: true },
    ],
  },
  challenge: {
    title: 'El reto',
    items: [
      { title: 'Categoría desconocida', body: '«Agencia de suscripción» no significa nada para el usuario final. Antes de vender hay que enseñar la categoría y dónde encaja Ayax en la cadena.' },
      { title: 'Tres audiencias opuestas', body: 'B2C de nicho (taxistas, viajeros), B2B de distribución (corredores) y B2B técnico (aseguradoras), sin fragmentar la marca en tres sitios.' },
      { title: 'Sin cotización online', body: 'No hay carrito ni tarificador: toda la conversión pasa por formularios de contacto y por lo que ocurre después de enviarlos.' },
      { title: 'La confianza es el producto', body: 'Se vende una promesa de pago futura. Lloyd’s, ASASE o la Cámara de Comercio no son adornos: son parte de lo que se compra.' },
      { title: 'Bilingüe y regulado', body: 'Español e inglés completos, con la información de protección de datos allí donde se recogen datos.' },
      { title: 'Un sistema que hay que poder romper', body: 'Cinco fichas comparten plantilla y una, la de taxi, necesita reglas propias sin bifurcar el sistema.' },
    ],
  },
  audiences: {
    title: 'Audiencias',
    items: [
      { name: 'Profesional del taxi', question: '¿Me cubre bien y a qué precio?', entry: 'Entra por la landing de seguros de taxi, desde búsqueda o campaña.', exit: 'Formulario de taxi o asistencia' },
      { name: 'Corredor o mediador', question: '¿Qué me aporta frente a lo que ya distribuyo?', entry: 'Sección Partners y bloque propio en portada, por encima del catálogo.', exit: 'Alta como partner' },
      { name: 'Aseguradora', question: '¿Tienen capacidad técnica para suscribir por mí?', entry: 'Partners: especialización, ramos y coberturas.', exit: 'Contacto comercial cualificado' },
      { name: 'Empresa o particular', question: '¿Este seguro existe y quién responde?', entry: 'Catálogo de productos y ficha del ramo.', exit: 'Formulario general' },
      { name: 'Candidato o sector', question: '¿Quién está detrás?', entry: 'Sobre Ayax: valores, equipo con nombre y cara, y evento anual.', exit: 'Credibilidad de marca' },
    ],
  },
  flows: {
    title: 'Flujos',
    caption: 'Sin tarificador, el formulario es la conversión: cada origen tiene su formulario, su plantilla de correo y su destino, y cada respuesta pide una sola cosa.',
    list: [
      { title: 'Del formulario a la respuesta', side: 'los cuatro orígenes, medibles por separado', steps: [
        { n: '01', t: 'General', d: 'Desde cualquier página. Cuatro campos y consentimiento explícito.' },
        { n: '02', t: 'Partner', d: 'Alta como distribuidor, con los datos que el comercial necesita para llamar.' },
        { n: '03', t: 'Taxi', d: 'Landing propia con comparativa de niveles y teléfonos de asistencia.' },
        { n: '04', t: 'Evento', d: 'Registro de Ayax Evolution, con su identidad y su variante de botón.' },
      ] },
      { title: 'Lo que pasa después', side: 'un email por flujo, con una sola acción', steps: [
        { n: '01', t: 'Confirmación', d: 'Qué hemos recibido, en el idioma en el que se rellenó el formulario.' },
        { n: '02', t: 'Plazo', d: 'Cuándo responde alguien: «tu precio llega en 24 h» en el flujo de taxi.' },
        { n: '03', t: 'Siguiente paso', d: 'Una sola acción principal, frente a los cuatro «Contáctanos» iguales de la web.' },
        { n: '04', t: 'Aval verificable', d: 'Dirección real, sello de coverholder y teléfono de asistencia en el pie.' },
      ] },
    ],
  },
  findings: {
    title: 'Hallazgos',
    caption: 'Revisé el sitio en producción y el código, y prioricé lo pendiente por impacto: primero cumplimiento y accesibilidad, después la credibilidad de una marca que vende confianza. Catorce hallazgos abiertos, en seis tandas.',
    items: [
      { n: '01', title: 'El consentimiento de cookies no llega a la medición.', body: 'Las preferencias granulares se recogen pero no se propagan a la analítica.', rule: 'Cumplimiento', severity: 'crítica', where: 'Todo el sitio' },
      { n: '02', title: 'Titular de portada sobre vídeo, a 2,85:1.', body: 'El blanco sobre la zona más clara del cielo de Málaga no llega al mínimo de contraste.', rule: 'WCAG 1.4.3', severity: 'alta', where: 'Home' },
      { n: '03', title: 'La comparativa de taxi diferencia solo por icono.', body: 'Sin etiqueta de texto por fila, lo incluido y lo opcional no se distinguen con lector de pantalla.', rule: 'WCAG 1.4.1', severity: 'alta', where: 'Seguro de taxi' },
      { n: '04', title: 'El envío de formulario no es evento clave.', body: 'Sin marcarlo, no hay forma de comparar la conversión de los cuatro flujos.', rule: 'Medición', severity: 'alta', where: 'Los cuatro formularios' },
      { n: '05', title: 'Cuatro llamadas primarias iguales en un recorrido.', body: 'Omnipresencia sí, uniformidad no: el usuario tiene que decidir cuatro veces lo mismo.', rule: 'Jerarquía de acción', severity: 'media', where: 'Home y fichas' },
      { n: '06', title: 'El año de fundación no coincide entre páginas.', body: 'En una empresa que vende solvencia, un dato inconsistente cuesta credibilidad.', rule: 'Contenido', severity: 'media', where: 'Home, Sobre Ayax, pie' },
      { n: '07', title: 'El pie no incluye Taxi.', body: 'El ramo con más intención directa falta en la navegación secundaria.', rule: 'Contenido', severity: 'baja', where: 'Pie' },
    ],
  },
  design: [
    shot('ayax-x_taxi', 'Beneficios del seguro de taxi: protección total, precios justos, gestión fácil y siempre a tu lado', 'Landing de taxi: cuatro beneficios en el lenguaje del taxista, no en el del sector'),
    shot('ayax-guidelines', 'Guías de marca de Ayax: logo, colores primarios y tipografía Inter', 'Brand book: la X se lee como firma de aprobación y como cruce entre aseguradoras y partners'),
    shot('ayax-campaign', 'Campaña «Que tu riesgo tenga siempre luz verde» y save the date de Ayax Evolution', 'Campaña de marca y evento anual, con degradado y variante de botón propios'),
    shot('ayax-merch3', 'Polo del equipo con la X cruzando la prenda', 'El trazo de la X cruza el polo del equipo como una firma'),
  ],
  implementation: [
    'Veintiún meses de evolución continua sobre el mismo sistema: un vertical nuevo (taxi), una segunda lengua completa con el idioma en la URL, una campaña con identidad propia y una migración de repositorio con los tokens intactos.',
    'Lo que la web no resolvía lo resolvieron los emails: sin tarificador, la experiencia es lo que pasa después del formulario. Cada flujo —partner, taxi y evento— tiene su respuesta, con una sola acción principal y los plazos por escrito, frente a los cuatro «Contáctanos» idénticos del recorrido web.',
    'La auditoría del sitio en producción dejó catorce hallazgos abiertos, priorizados en seis tandas: primero cumplimiento y accesibilidad, después la credibilidad de una marca que vende confianza.',
  ],
  result: {
    output: [
      { value: '6 · 10', label: 'ramos y tipos de distribuidor', meaning: 'Caución, motor, viaje, accidente, concursos públicos y taxi, para diez tipos de distribuidor, con un solo sello de marca.' },
      { value: '113', label: 'componentes de interfaz', meaning: 'Medido en el propio repositorio, junto con las rutas públicas y las cadenas traducidas de las dos lenguas.' },
      { value: '4', label: 'flujos de captación medibles', meaning: 'General, partner, taxi y evento: cada origen con su formulario, su plantilla de correo y su destino. Sin tarificador, el formulario es la conversión.' },
    ],
    /* Outcome derivado: cada cifra es aritmética sobre un dato que el caso ya
       documenta, y su explicación dice de dónde sale. Lo que no se midió sigue
       declarado abajo, en `measure`. */
    outcome: [
      { value: '0', label: 'ramos que exigieron diseño a medida', meaning: 'Cinco de las seis fichas comparten plantilla y la de taxi es una excepción declarada: ningún ramo nuevo obligó a dibujar una pantalla desde cero. Es consecuencia del sistema, contada sobre los seis ramos del caso, no una medición de campo.' },
      { value: '21', label: 'meses sobre el mismo sistema', meaning: 'De septiembre de 2024 a mayo de 2026 entraron un vertical nuevo, una segunda lengua completa y una campaña con identidad propia, y los tokens sobrevivieron incluso a la migración de repositorio.' },
      { value: '2', label: 'lenguas con una sola base de componentes', meaning: 'Los 113 componentes sirven a español e inglés con el idioma en la URL: la segunda lengua no duplicó interfaz.' },
    ],
    measure: 'Conversión por flujo y por ramo, y calidad del lead que llega a cada bandeja. La analítica del sitio no marcaba el envío de cada formulario como evento clave, así que citar porcentajes habría sido un artefacto: está en la primera tanda de la auditoría.',
  },
  learnings: [
    'Cuando la categoría es desconocida, la claridad vence a la creatividad: el titular es un acto pedagógico.',
    'Un sistema sirve también para poder romperlo: la landing de taxi es una excepción bien hecha, no un fallo del sistema.',
    'Sin precio, la llamada a la acción es el producto: omnipresencia sí, uniformidad no.',
    'El contenido se degrada antes que el diseño, y merece revisión periódica con la misma disciplina que el código.',
    'En seguros, lo comprobable persuade más que lo bien escrito: la confianza se construye con detalles verificables.',
  ],
  next: 'hermes',
};
