import { shot, type CaseStudy } from './types';

export const montsaint: CaseStudy = {
  slug: 'montsaint', title: 'Una marca con dos negocios', company: 'Montsaint', years: '2023–2025',
  tagline: 'Gafas de sol de bio-acetato que se venden al cliente final y, a la vez, se distribuyen en una red de más de 700 ópticas: dos webs, dos ritmos de decisión y una sola colección debajo.',
  tags: ['Caso de estudio', 'En producción', 'E-commerce', 'Marca y arte'], brand: '#1F6F6B',
  hero: shot('ms-desktop', 'Home de la tienda Montsaint en escritorio', 'La tienda: novedades por temporada, catálogo en mosaico y WhatsApp siempre visible'),
  context: 'Montsaint vende gafas de sol, bolsos y accesorios a cliente final y distribuye su colección a través de ópticas. Diseñé las dos caras del negocio —la tienda y la web de captación de partners— y la guía para tratar la fotografía de producto.',
  role: 'Product Designer: tienda, landing de partners y dirección de arte de la fotografía, con brandsheet y UI kit en lugar de un design system completo.',
  delivery: 'Tienda en escritorio y móvil, landing Montsaint Partners con su formulario, ficha de colección y guía de retoque para campaña, redes y displays.',
  problem: [
    'El mismo producto se compra en una sesión y se distribuye en semanas: el cliente final decide por deseo y la óptica decide por margen y por lo que puede explicar en el mostrador.',
    'Y el argumento que diferencia la marca —botellas recicladas y bio-acetato— vive en la ficha técnica, donde nadie lo lee.',
  ],
  complexity: { diagram: 'two-sided', caption: 'Una colección y una fotografía debajo, dos negocios encima: la tienda para el cliente final y la red de ópticas para el canal profesional.' },
  decisions: [
    { title: 'El material sube a la portada y se cuenta con un icono, no con un párrafo.', why: '«Material eco-friendly» es la razón de compra que la competencia no tiene: escondida en la ficha, no existe.', changed: 'Un bloque propio en la home con tres ideas cortas —botellas recicladas, menos residuo en origen, menos químicos— y el mensaje «el futuro está en nuestras manos». La óptica reutiliza esas tres frases en tienda.', figure: { shot: shot('ms-m_eco', 'Bloque «Material eco-friendly: el futuro está en nuestras manos» de la tienda', 'El material como argumento de portada, en tres ideas que el partner puede repetir') } },
    { title: 'El color se reserva; la tipografía habla en mayúsculas espaciadas.', why: 'Con fotografía tan protagonista, una paleta suelta convierte la tienda en un mercadillo.', changed: 'Aguamarina para la temporada, amarillo mantequilla para la edición limitada y azul cobalto para el canal profesional. Cada color señala en qué parte del negocio estás.', figure: { shot: shot('ms-m_carmen', 'Tríptico de la edición limitada con Carmen Lomana llevando gafas de sol', 'Edición limitada: acceso propio en la navegación, en amarillo, y tríptico editorial en la home') } },
    { title: 'Partners no es la tienda con otro texto.', why: 'La óptica no compra una gafa: compra catálogo exclusivo, margen y apoyo en tienda.', changed: 'Landing propia con la prueba social como primer argumento —más de 700 ópticas—, los tres beneficios del canal y un formulario que pide solo lo que el distribuidor de zona necesita para llamar.', tradeoff: 'Dos webs que hay que mantener con la misma temporada: si el catálogo cambia y solo se actualiza una, la marca se contradice.', figure: { shot: shot('ms-partners', 'Landing Montsaint Partners para ópticas', 'Partners: prueba social, beneficios del canal y un formulario corto') } },
    { title: 'La colección se muestra igual siempre: el color de la lente es lo único que cambia.', why: 'Ocho modelos en tres familias son comparables solo si la foto no introduce variables.', changed: 'Cada montura sobre blanco, de frente y a la misma escala, con las especificaciones en el mismo orden: protección UV, material y tipo de lente.', figure: { shot: shot('ms-p_grid', 'Rejilla de ocho modelos de gafas de sol Montsaint sobre fondo blanco', 'Ocho modelos, tres familias: misma escala, mismo encuadre, misma ficha') } },
    { title: 'La fotografía se dirige con reglas, no con gusto.', why: 'Las fotos las producen terceros y se usan en campaña, redes y displays con QR: sin reglas, cada pieza recorta la montura donde quiere.', changed: 'Cuatro reglas ilustradas: retícula de proporciones con los ojos y la montura en el tercio superior, encuadre normal sin recortar la gafa, recorte cerrado para campaña y versión abierta para redes y displays.', wouldFix: 'Fichas de producto con la especificación completa —UV, material y lente— también en la tienda, y no solo en el material del canal profesional.', figure: { shot: shot('ms-retouch', 'Guía de retoque: regla de proporciones, ubicar la foto y enfoque de gafas con y sin zoom', 'La guía de arte: cuatro reglas para que la gafa esté siempre en foco') } },
  ],
  system: {
    body: [
      'No hacía falta un design system: hacía falta una brandsheet y un UI kit. El producto es catálogo y campaña, y la coherencia se sostiene con tipografía, tres colores con función y una regla de fotografía.',
      'Las garantías —envío gratis, devolución, pago seguro y atención por WhatsApp— viajan juntas como una sola pieza, porque en compra por impulso responden a las cuatro dudas que frenan el pago.',
    ],
    code: { title: 'Tokens de Montsaint: tres colores con función', lang: 'json', code: "{\n  \"color\": {\n    \"aguamarina\": \"#1F6F6B\",\n    \"mantequilla\": \"#F2D06B\",\n    \"cobalto\":    \"#1B3FA0\",\n    \"tinta\":      \"#1A1A1A\",\n    \"papel\":      \"#FFFFFF\"\n  },\n  \"uso\": {\n    \"aguamarina\":  \"temporada y tienda\",\n    \"mantequilla\": \"edición limitada\",\n    \"cobalto\":     \"canal profesional\"\n  },\n  \"font\": {\n    \"display\": { \"transform\": \"uppercase\", \"tracking\": 0.18 },\n    \"size\":    { \"body\": 15, \"precio\": 18, \"titulo\": 34 }\n  },\n  \"foto\": { \"fondo\": \"blanco\", \"encuadre\": \"frontal\", \"escala\": \"constante\" }\n}" },
    uiKit: [
      { kind: 'product', title: 'La pieza de catálogo', body: 'Foto a la misma escala, nombre de la familia y una sola llamada: en un catálogo de deseo, el precio no compite con la imagen.', wide: true, labels: ['Ocean', 'Radiant', 'Horizon'], label: 'Ver más' },
      { kind: 'trust', title: 'Las cuatro dudas antes de pagar', body: 'Envío, devolución, seguridad del pago y atención directa viajan juntas como una sola pieza, no repartidas por el pie.', wide: true, labels: ['Envío gratis desde 30 €', '14 días de devolución', 'Pago 100 % seguro', 'Compra por WhatsApp'] },
      { kind: 'tokens', title: 'Tres colores con función', body: 'Aguamarina para la temporada, amarillo para la edición limitada y cobalto para el canal profesional: el color dice en qué parte del negocio estás.', wide: true, labels: ['aguamarina', 'cobalto', 'mantequilla', 'campaña', 'papel', 'tinta'] },
      { kind: 'actions', title: 'Una acción por contexto', body: 'En tienda, «Comprar»; en partners, «Quiero ser distribuidor». La misma cápsula, distinto verbo y distinto color.', wide: true, label: 'Comprar' },
    ],
  },
  challenge: {
    title: 'El reto',
    items: [
      { title: 'Dos ritmos de decisión', body: 'El cliente final compra por deseo en una sesión; la óptica decide por margen en semanas.' },
      { title: 'El argumento está escondido', body: 'Bio-acetato y botellas recicladas viven en la ficha técnica, donde nadie los lee.' },
      { title: 'Fotografía de terceros', body: 'Las piezas las producen fotógrafos externos y se usan en campaña, redes y displays.' },
      { title: 'Colección comparable', body: 'Ocho modelos en tres familias solo se comparan si la foto no introduce variables.' },
      { title: 'Sin design system', body: 'Un catálogo de marca no necesita gobernanza: necesita brandsheet, UI kit y reglas de arte.' },
    ],
  },
  flows: {
    title: 'Flujos',
    caption: 'Los dos negocios comparten catálogo y fotografía, y se separan en cuanto hay que argumentar.',
    list: [
      { title: 'Tienda', side: 'cliente final', steps: [
        { n: '01', t: 'Temporada', d: 'Hero en carrusel con las novedades y el botón de WhatsApp siempre visible.' },
        { n: '02', t: 'Catálogo', d: 'Bolsos, accesorios, sunglasses y outlet como piezas de revista, cada una con su «Ver más».' },
        { n: '03', t: 'Material', d: 'El bloque eco explica de qué está hecha la montura antes de la ficha.' },
        { n: '04', t: 'Garantías', d: 'Envío, devolución, pago seguro y atención directa, juntos antes de pagar.' },
      ] },
      { title: 'Partners', side: 'red de ópticas', steps: [
        { n: '01', t: 'Prueba social', d: 'Más de 700 ópticas: el primer argumento no es el producto, es la red.' },
        { n: '02', t: 'Qué gana', d: 'Catálogo exclusivo, incremento de facturación y apoyo en marketing.' },
        { n: '03', t: 'Qué recibe', d: 'Displays y materiales que destacan la gafa en el mostrador.' },
        { n: '04', t: 'Contacto', d: 'Formulario con lo justo para que el distribuidor de zona pueda llamar.' },
      ] },
    ],
  },
  design: [
    shot('ms-mobile', 'Home de la tienda Montsaint en móvil', 'En móvil, el hero en carrusel y el botón de WhatsApp fijo'),
    shot('ms-m_hero', 'Banner de novedades con modelo con top naranja y gafas oscuras', 'Novedades por temporada: fondo aguamarina y fotografía de ciudad'),
    shot('ms-p_box', 'Gafas Montsaint con estuche, funda y paño de marca', 'La entrega también es marca: estuche, funda y paño'),
    shot('ms-p_top', 'Modelo con blazer azul y gafas de carey frente a rascacielos', 'Fotografía de campaña con la regla de proporciones aplicada'),
  ],
  implementation: [
    'La tienda y la landing de partners comparten fotografía y colección, así que una temporada nueva se publica una vez y sirve a los dos canales.',
    'La guía de arte se entregó como pieza visual con ejemplos correctos e incorrectos, para que un fotógrafo externo pudiera aplicarla sin una llamada.',
  ],
  result: {
    output: [
      { value: '2', label: 'negocios sobre una marca', meaning: 'Tienda al cliente final y red de ópticas, con el mismo catálogo y la misma fotografía debajo.' },
      { value: '8 · 3', label: 'modelos y familias', meaning: 'Ocean, Radiant y los modelos sueltos, presentados con el mismo encuadre y la misma escala para que sean comparables.' },
      { value: '4', label: 'reglas de fotografía', meaning: 'Proporciones, encuadre, recorte cerrado para campaña y versión abierta para redes: la gafa siempre en foco.' },
    ],
    outcome: 'unavailable',
    measure: 'Conversión de la tienda por temporada y altas de ópticas desde la landing de partners. Los datos de la tienda los tenía el cliente y no se compartieron con diseño.',
  },
  learnings: [
    'Cuando dos audiencias comparten producto pero no ritmo de decisión, lo que se comparte es el catálogo y la fotografía; el argumento se separa.',
    'En un catálogo de deseo, la dirección de arte es parte del sistema: sin reglas de foto, ninguna retícula salva la página.',
    'El color rinde más cuando tiene función: tres tonos con trabajo asignado ordenan más que una paleta amplia.',
  ],
  next: 'mercantil',
};
