import { shot, type CaseStudy } from './types';

export const designSystem: CaseStudy = {
  slug: 'design-system', title: 'Design system: 267 → 24 tokens', company: 'Atrinium', years: '2024',
  tagline: 'El nivel de sistema que cada producto se puede permitir: tokens con rol, componentes con contrato y reglas de decisión, adoptados por los cuatro front.',
  tags: ['Design system', 'En producción', 'Multi-producto', 'Design tokens (JSON)', 'Tokens multi-marca'], brand: '#15181f',
  hero: shot('07-seleccionar-moneda', 'Selector de moneda del design system', 'Un componente, cuatro front, cinco productos'),
  context: 'Al entrar, cada módulo de HERMES se había construido con criterios distintos, y el holding tenía cinco productos con cinco lenguajes.',
  role: 'Propuse el sistema, lo construí desde cero y lo defendí ante los cuatro desarrolladores front.',
  delivery: 'Tokens semánticos, componentes con contrato, jerarquía tipográfica y reglas de uso documentadas; brandsheet y UI kit para los productos ligeros.',
  problem: [
    'Sin una base compartida, reutilizar componentes entre productos no ahorra nada.',
    'La respuesta obvia era imponer un sistema único; los productos ligeros no necesitan esa gobernanza.',
  ],
  complexity: { diagram: 'system-cycle', caption: 'El sistema alimenta el módulo y el módulo devuelve componentes al sistema.' },
  decisions: [
    { title: 'Auditar el monorepo antes de dibujar un token.', why: 'Un sistema que no parte de lo que hay en código nace ya desalineado.', changed: '267 valores de color en uso, extraídos con IA, reducidos a 24 tokens con un rol asignado cada uno.' },
    { title: 'Evolucionar, no tirar.', why: 'Rehacer el sistema anterior habría roto cuatro front a la vez.', changed: 'Los tokens se exportaron para evolucionar el design system existente; los cuatro front los adoptaron.', figure: { shot: shot('07-seleccionar-moneda', 'Selector de moneda', 'Selector de moneda: el mismo componente en los cuatro front') } },
    { title: 'Reglas de decisión, no solo librería.', why: 'Una librería dice qué existe; un sistema dice cuándo usar cada patrón y por qué.', changed: 'Documentación de cuándo aplicar cada patrón y cuándo no, con accesibilidad forzada por el linter.', figure: { diagram: 'system-cycle' } },
  ],
  system: {
    body: ['Tokens semánticos con marca e idioma como variables: la paleta de cada cliente se resuelve al iniciar sesión sin duplicar componentes.'],
    code: { title: "De 267 valores a 24 tokens con rol (extracto)", lang: 'json', code: "{\n  \"color\": {\n    \"bg\":         \"#ffffff\",\n    \"surface\":    \"#f6f7fb\",\n    \"line\":       \"#e3e6ef\",\n    \"ink\":        \"#121317\",\n    \"ink-muted\":  \"#6a6a71\",\n    \"action\":     \"#2f5bea\",\n    \"action-ink\": \"#ffffff\",\n    \"success\":    \"#1f9d55\",\n    \"warning\":    \"#d97706\",\n    \"danger\":     \"#c0392b\",\n    \"focus\":      \"#4a44f2\",\n    \"brand\":      \"var(--tenant-brand)\"\n  },\n  \"font\": {\n    \"family\": \"Inter\",\n    \"size\":   { \"xs\": 12, \"sm\": 14, \"md\": 16, \"lg\": 20, \"xl\": 28, \"xxl\": 40 },\n    \"line\":   { \"tight\": 1.2, \"body\": 1.5 }\n  },\n  \"radius\": { \"sm\": 6, \"md\": 10, \"lg\": 16, \"pill\": 999 },\n  \"shadow\": { \"card\": \"0 2px 8px rgba(18,19,23,.06)\" }\n}" },
    uiKit: [
      { kind: 'tokens', title: 'Tokens con rol, no con nombre de color', body: 'Cada token dice para qué sirve: acción, éxito, aviso, peligro, superficie. Así el front elige sin preguntar y el sistema puede cambiar de paleta sin tocar componentes.', wide: true },
      { kind: 'brands', title: 'El mismo componente en cuatro marcas', body: 'La marca y el idioma son variables: la paleta de cada cliente se resuelve al iniciar sesión, sin duplicar el componente.', wide: true },
      { kind: 'scale', title: 'Escala de esquinas', body: 'Cuatro radios con nombre en lugar de valores sueltos: sm, md, lg y pill. Lo que no está en la escala no se usa.', wide: true },
      { kind: 'states', title: 'Estados semánticos', body: 'Los estados salen de los tokens, no de decisiones por pantalla: el mismo verde significa lo mismo en los cuatro front.', wide: true },
    ],
  },
  design: [
    shot('07-seleccionar-moneda', 'Selector de moneda', 'Selector de moneda'),
    shot('09-metodo-pago', 'Método de pago', 'Método de pago compuesto con componentes del sistema'),
    shot('18-agregar-participantes', 'Agregar participantes', 'Agregar participantes: el mismo patrón de selección en toda la plataforma'),
  ],
  implementation: ['Adoptado por los cuatro desarrolladores front. Es lo que hace que cinco negocios distintos no se sientan como cinco empresas distintas.'],
  result: {
    output: [
      { value: '267 → 24', label: 'tokens de color', meaning: 'Cada token con un rol asignado; ninguno decorativo.' },
      { value: '4', label: 'front que lo adoptaron', meaning: 'La adopción es la métrica de un design system; sin ella es una librería más.' },
      { value: '5', label: 'productos, un lenguaje', meaning: 'Sistema completo donde hace falta; brandsheet y UI kit donde no.' },
    ],
    /* Outcome derivado: cada cifra es aritmética sobre un dato que el caso ya
       documenta, y su explicación dice de dónde sale. Lo que no se midió sigue
       declarado abajo, en `measure`. */
    outcome: [
      { value: '−91 %', label: 'valores de color en el código', meaning: 'De 267 valores en uso a 24 tokens con rol. La cifra sale del recuento de la auditoría, que es el dato que sí existe.' },
      { value: '4 de 4', label: 'front que lo adoptaron', meaning: 'Adopción completa del equipo: un sistema que no adopta el front no ahorra nada, y esto se puede comprobar en el repositorio.' },
      { value: '5', label: 'productos con un solo lenguaje', meaning: 'Los cinco productos del holding comparten tokens y criterios, con el nivel de gobernanza que cada uno se puede permitir.' },
    ],
    measure: 'Componentes reutilizados por módulo nuevo y tiempo de diseño por iniciativa antes y después del sistema.',
  },
  learnings: [
    'El punto de partida de un sistema es el código que ya existe, no la pizarra.',
    'La gobernanza se dimensiona por producto: imponerla donde no hace falta la mata.',
  ],
  next: 'hermes',
};
