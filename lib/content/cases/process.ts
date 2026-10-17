import { shot, type Shot } from './types';

/* Proceso de cada caso, del brief al handoff.

   Los pasos ocurrieron —reuniones de benchmark, ideas en post-its, bocetos,
   wireframes—, pero su material original está disperso. Donde no hay
   material, el paso se cuenta con un dibujo que lo reconstruye y que la web
   etiqueta como «Reconstrucción»; donde lo hay (la pantalla final, el flujo
   de Pidemony), va el original. Los textos salen de lo que cada caso ya
   documenta: problema, decisiones e implementación. No hay competidores con
   nombre ni resultados que no estén en el caso.

   El boceto y el wireframe no son una plantilla: se dibujan desde la pantalla
   real del caso, caja a caja (WIRES), así que al pasar de boceto a producto es
   la misma pantalla la que evoluciona. */

/* Una caja del wireframe: tipo, x, y, ancho y alto en % de la pantalla, y
   cuántas repeticiones lleva cuando el tipo las admite. */
export type WireKind = 'frame' | 'fill' | 'img' | 'title' | 'lines' | 'btn' | 'cta' | 'input' | 'table' | 'cards' | 'list' | 'dot' | 'chips' | 'nav';
export type WireBox = [WireKind, number, number, number, number, number?];
export interface CaseProcess {
  brief: string;
  bench: string;
  ideas: string;
  evolve: { text: string; shot: Shot; wire: WireBox[] };
  /* Con `shot`, el handoff es material original; sin él, se dibuja el flujo. */
  handoff: { text: string; shot?: Shot };
}

export const WIRES: Record<string, WireBox[]> = {
  ayax: [
    ['img', 0, 9, 100, 91], ['title', 2, 3.5, 6, 3], ['nav', 11, 4.5, 18, 2, 3], ['cta', 83, 2.5, 11, 5], ['dot', 96, 3, 2, 4],
    ['title', 2, 28, 50, 4.5], ['title', 2, 34.5, 22, 4.5], ['lines', 2, 42, 40, 5, 2], ['cta', 2, 50, 11, 5], ['lines', 2, 57, 22, 2, 1], ['btn', 77, 47, 20, 5],
  ],
  hermes: [
    ['fill', 0, 0, 15, 100], ['lines', 2, 14, 10, 26, 5], ['nav', 18, 2, 40, 2, 5], ['dot', 94, 2, 3, 4],
    ['title', 18, 8.5, 14, 3], ['cta', 87, 9, 11, 4], ['cards', 18, 16, 80, 11, 4], ['cards', 18, 30, 80, 11, 6],
    ['input', 18, 45, 45, 4], ['chips', 64, 45, 34, 4, 5], ['table', 18, 52, 80, 44, 8],
  ],
  flesip: [
    ['title', 36, 5, 28, 2], ['dot', 89, 4.5, 6, 3], ['lines', 5, 10, 30, 1.5, 1], ['title', 5, 13, 45, 4.5], ['dot', 87, 13.5, 8, 4],
    ['frame', 5, 21, 90, 5], ['input', 5, 30, 90, 5], ['list', 5, 38, 90, 50, 4],
  ],
  montsaint: [
    ['title', 3, 5, 15, 3], ['chips', 21, 4, 20, 4, 1], ['nav', 43, 5, 25, 2, 3], ['input', 69, 3.5, 12, 6], ['dot', 84, 4, 3, 5], ['dot', 89, 4, 3, 5], ['fill', 93, 3.5, 5, 7],
    ['title', 3, 17, 52, 4.5], ['title', 3, 24, 42, 4.5], ['title', 3, 31, 40, 4.5], ['lines', 62, 17, 33, 8, 3], ['cta', 62, 29, 16, 6], ['btn', 80, 29, 16, 6],
    ['fill', 0, 40, 100, 4], ['img', 0, 44, 100, 56], ['title', 5, 80, 36, 6], ['lines', 5, 90, 20, 2, 1], ['dot', 91, 83, 4, 6],
  ],
  mercantil: [
    ['title', 3, 9, 18, 4], ['title', 3, 15, 13, 4], ['title', 3, 21, 10, 5], ['img', 0, 40, 22, 52],
    ['frame', 28, 13, 14, 62], ['lines', 30, 19, 10, 6, 3], ['cards', 29.5, 30, 11, 14, 2], ['dot', 33, 50, 4, 7],
    ['frame', 46, 13, 14, 62], ['fill', 46, 13, 14, 12], ['cards', 47.5, 30, 11, 30, 3],
    ['frame', 64, 13, 14, 62], ['lines', 66, 19, 10, 4, 2], ['chips', 65.5, 32, 11, 6, 3], ['btn', 66, 66, 10, 4],
    ['frame', 82, 13, 14, 62], ['img', 83.5, 18, 11, 44],
    ['btn', 31, 5, 10, 6], ['btn', 64, 4, 14, 7], ['btn', 48, 77, 10, 6], ['btn', 84, 77, 9, 6], ['fill', 0, 92, 100, 8],
  ],
  'design-system': [
    ['nav', 2, 2, 35, 1.5, 6], ['dot', 95, 1.5, 2.5, 3], ['frame', 0, 5, 14, 95], ['lines', 1.5, 9, 11, 8, 3], ['cta', 1, 20, 12, 3], ['lines', 1.5, 26, 11, 60, 12],
    ['title', 17, 9, 18, 3], ['btn', 73, 9, 11, 3.5], ['cta', 86, 9, 11, 3.5], ['chips', 17, 15, 27, 3, 3],
    ['title', 17, 21, 7, 2], ['cards', 17, 24, 78, 7, 4], ['title', 17, 34, 7, 2], ['input', 17, 37, 40, 4], ['input', 62, 37, 16, 4], ['input', 80, 37, 16, 4],
    ['table', 17, 44, 79, 25, 5], ['frame', 17, 93, 80, 4], ['btn', 73, 93.5, 7, 3], ['btn', 81, 93.5, 7, 3], ['cta', 89, 93.5, 7, 3],
  ],
  pidemony: [
    ['fill', 0, 0, 100, 4], ['input', 2, 6, 96, 5], ['fill', 0, 12, 100, 11], ['title', 5, 16, 25, 3],
    ['frame', 4, 25, 92, 21], ['title', 8, 29, 52, 3], ['lines', 8, 34, 80, 6, 2], ['lines', 8, 42, 50, 2, 1],
    ['frame', 4, 48, 92, 50], ['dot', 7, 51.5, 6, 3.5], ['lines', 17, 52, 70, 4, 2], ['lines', 7, 61, 25, 1.5, 1], ['input', 7, 64, 86, 5],
    ['lines', 7, 71, 30, 1.5, 1], ['input', 7, 74, 86, 5], ['input', 7, 81, 40, 5], ['input', 53, 81, 40, 5], ['cta', 7, 88, 86, 5],
  ],
};

export const PROCESS: Record<string, CaseProcess> = {
  ayax: {
    brief: '«Agencia de suscripción» no significaba nada para quien busca un seguro, y no había precio que enseñar: la web tenía que explicar la categoría y convertir solo con formularios.',
    bench: 'Revisamos webs de agencias de suscripción, corredores y aseguradoras para ver cómo explican qué hacen y dónde colocan sus credenciales.',
    ideas: 'De la reunión salió la regla del titular: decir qué es la empresa, no lo que siente el cliente, y subir la credencial de Lloyd’s al primer pliegue.',
    evolve: { text: 'La portada: la categoría y la credencial de Lloyd’s en el mismo pliegue.', shot: shot('ayax-x_hero', 'Portada de Ayax Suscripción de Riesgos', 'Portada de Ayax'), wire: WIRES.ayax },
    handoff: { text: 'Cada vertical nuevo, la segunda lengua y la campaña se entregaron sobre las mismas plantillas y componentes: veintiún meses de evolución sobre un solo sistema.' },
  },
  hermes: {
    brief: 'Cada compañía llegaba con su lógica de negocio, su moneda, su idioma y su regulador, y esperaba que el producto se comportara como el suyo.',
    bench: 'Revisamos cómo resuelven los ERP y CRM del sector la configuración por cliente, los permisos y los paneles de seguimiento.',
    ideas: 'La idea que ganó: diseñar reglas en lugar de casos, con la marca y el idioma como variables y no como versiones del producto.',
    evolve: { text: 'El panel: indicadores de la red comercial y lo que requiere acción, en la primera pantalla.', shot: shot('hx-dashboard', 'Panel del CRM de HERMES', 'Panel de HERMES'), wire: WIRES.hermes },
    handoff: { text: 'Tokens y componentes entregados con criterios de uso: desarrollo dejó de preguntar cómo se comporta un patrón porque estaba definido antes de llegar a ellos.' },
  },
  flesip: {
    brief: 'Cuatro bloques de ajustes con cuatro lógicas distintas, y un usuario que no es contable: cada decisión que obliga la ley tenía que explicarse dentro del producto.',
    bench: 'Revisamos apps de facturación y de banca móvil para ver cómo agrupan los ajustes y cómo distinguen una factura pendiente de una cobrada.',
    ideas: 'La factura rápida nació en una pizarra: un estado intermedio, pendiente de cliente, que deja emitir primero y completar después.',
    evolve: { text: 'Ingresos: las pendientes aún no llevan nombre de cliente; las completadas, sí.', shot: shot('flesip-fx_ingresos', 'Pantalla de ingresos de Flesip en el móvil', 'Ingresos de Flesip'), wire: WIRES.flesip },
    handoff: { text: 'El flujo se entregó como documento de handoff con las dos caras, quien factura y quien recibe, y las anotaciones para desarrollo sobre el mismo lienzo.' },
  },
  montsaint: {
    brief: 'El mismo producto se compra en una sesión y se distribuye en semanas, y el argumento de la marca, los materiales reciclados, vivía en la ficha técnica, donde nadie lo leía.',
    bench: 'Revisamos tiendas de gafas y marcas de moda sostenible para ver dónde cuentan el material y cómo separan la venta directa de la distribución.',
    ideas: 'Dos decisiones salieron juntas: el material sube a la portada con un icono, y Partners no es la tienda con otro texto.',
    evolve: { text: 'La tienda: novedades por temporada, catálogo en mosaico y WhatsApp siempre visible.', shot: shot('ms-desktop-top', 'Portada de la tienda de Montsaint', 'Tienda de Montsaint'), wire: WIRES.montsaint },
    handoff: { text: 'Tienda y landing de partners comparten fotografía y colección, y la guía de arte se entregó como pieza visual con ejemplos.' },
  },
  mercantil: {
    brief: 'Nueve soluciones de cobro presentadas una detrás de otra: la dueña de un comercio no sabe qué es un SDK y el desarrollador no necesita leer sobre el link de pago.',
    bench: 'Revisamos cómo presentan otros bancos y pasarelas sus soluciones de cobro: por catálogo o por la situación del comercio.',
    ideas: 'Ordenar quién necesita qué antes de diseñar nada, y un selector que parte de la situación del comercio, no del catálogo del banco.',
    evolve: { text: 'Mony: lo visible es un QR en caja; debajo hay cuatro fases que tienen que funcionar juntas.', shot: shot('mb-pay_20', 'Cómo pagan los clientes con Mony, en cuatro pantallas', 'Mony en cuatro pantallas'), wire: WIRES.mercantil },
    handoff: { text: 'Cada flujo pasó una revisión de UX y negocio, y pruebas de usabilidad en Maze, antes de llegar a desarrollo.' },
  },
  'design-system': {
    brief: 'Cada módulo de HERMES se había construido con criterios distintos, y el holding tenía cinco productos con cinco lenguajes.',
    bench: 'Revisamos design systems públicos para ver cómo nombran los tokens por rol y cómo documentan cuándo usar cada componente.',
    ideas: 'Auditar el monorepo antes de dibujar un token, y hacer evolucionar el sistema existente en lugar de tirarlo.',
    evolve: { text: 'Una pantalla compuesta solo con componentes del sistema.', shot: shot('09-metodo-pago', 'Pantalla de documentos compuesta con el design system', 'Pantalla con componentes del sistema'), wire: WIRES['design-system'] },
    handoff: { text: 'Tokens exportados como JSON y reglas de uso documentadas, con la accesibilidad forzada por el linter. Los cuatro front los adoptaron.' },
  },
  pidemony: {
    brief: 'Pedir dinero tiene dos personas y dos pantallas: quien pide está en la app y quien paga llega por un enlace, desde el navegador y con su tarjeta.',
    bench: 'Revisamos apps de pago entre personas y pasarelas por enlace para ver qué ve primero quien paga y cómo avisan de un enlace caducado.',
    ideas: 'Quien paga ve primero quién le pide y cuánto; el enlace caduca, y cuando caduca lo dice claro.',
    evolve: { text: 'La pantalla de quien recibe el enlace: quién pide, cuánto, para qué y hasta cuándo.', shot: shot('pm-pagar', 'Pantalla de pago de Pidemony para quien recibe el enlace', 'Pago por enlace'), wire: WIRES.pidemony },
    handoff: { text: 'El flujo del receptor tal como se entregó: del enlace por WhatsApp al pago hecho, con las pantallas de error posibles.', shot: shot('pm-flujo-receptor', 'Flujo del receptor del enlace de Pidemony: del mensaje al pago, con los estados de error', 'Flujo del receptor del enlace') },
  },
};
