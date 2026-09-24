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
    { title: 'El titular dice qué es la empresa, no qué siente el cliente.', why: 'Cuando la categoría es desconocida, el titular es un acto pedagógico: si la portada no la nombra, el usuario no tiene dónde colgar lo que lee después.', changed: 'La portada abre con «Agencia de suscripción de seguros», la antigüedad y el sello de coverholder en el mismo pliegue. La contrapartida asumida: un titular descriptivo no diferencia, así que la diferenciación se delega en la segunda sección y en las landings.', figure: { shot: shot('ayax-x_mosaic', 'Mosaico de productos en portada con Caución como pieza grande', 'Mosaico en portada: Caución, el ramo de más valor, ocupa el bloque grande') } },
    { title: 'Mosaico en portada, rejilla en catálogo.', why: 'Los seis ramos aparecen dos veces con dos trabajos distintos: en portada hay que jerarquizar, en catálogo hay que comparar.', changed: 'Mosaico de tamaños desiguales arriba y rejilla regular de tres columnas en el catálogo, donde el usuario ya está comparando y necesita simetría.', figure: { shot: shot('ayax-x_catalog', 'Catálogo de productos en rejilla de tres columnas', 'Catálogo: rejilla regular, fotografía de objeto por ramo y descripción corta') } },
    { title: 'La landing de taxi juega con otras reglas.', why: 'Es el negocio histórico y el de más intención directa: el taxista no quiere entender una categoría, quiere saber si le cubre y a qué precio.', changed: 'Única landing de conversión completa, con titular coloquial, cuatro beneficios en su lenguaje y comparativa de tres niveles. Construida con los mismos tokens, sin tocar las otras cinco fichas: un sistema sirve también para poder romperlo.', figure: { shot: shot('ayax-x_taxi_tiers', 'Comparativa de niveles Standard, Advanced y Ultimate sobre fondo navy', 'Comparativa de niveles: Standard, Advanced y Ultimate sobre las diez coberturas') } },
    { title: 'La comparativa se arregló para el móvil, donde se rompía.', why: 'Apilada en un teléfono obligaba a memorizar diez coberturas para comparar dos niveles, y la diferencia se leía solo por un icono.', changed: 'Selector de nivel fijo arriba, estado en texto («Incluido», «Opcional», «No incluido») y resaltado de lo que añade cada nivel frente al anterior. El color dejó de ser el único portador de la información.', figure: { shot: shot('ayax-x_mobile', 'Portada de Ayax en móvil de 390 px en tres tramos', 'A 390 px: el mosaico pasa a bandas, el titular cabe en el primer pliegue y el pie colapsa en acordeón') } },
    { title: 'El formulario pide poco y lo dice todo.', why: 'Sin tarificador, el formulario es la conversión; y se recogen datos personales en un sector regulado.', changed: 'Cuatro campos y consentimiento explícito, con el botón deshabilitado hasta marcar la privacidad: el requisito legal se comunica por el estado del control, no por un error a posteriori. La oficina real aparece en el mapa, que en una empresa que vende solvencia pesa más que un formulario bonito.', figure: { shot: shot('ayax-x_contact', 'Página de contacto con formulario, vías alternativas y mapa de la oficina', 'Contacto: formulario corto, vías alternativas y la oficina de Málaga en el mapa') } },
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
    outcome: 'unavailable',
    measure: 'Conversión por flujo y por ramo, y calidad del lead que llega a cada bandeja. La analítica del sitio no marcaba el envío de cada formulario como evento clave, así que citar porcentajes habría sido un artefacto: está en la primera tanda de la auditoría.',
  },
  learnings: [
    'Cuando la categoría es desconocida, la claridad gana a la creatividad: el titular es lo primero que enseña, no lo primero que impresiona.',
    'Omnipresencia sí, uniformidad no: cuatro botones «Contáctanos» idénticos en un recorrido son una decisión que el usuario tiene que tomar cuatro veces.',
  ],
  next: 'hermes',
};
