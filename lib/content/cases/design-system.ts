import { shot, type CaseStudy } from './types';

export const designSystem: CaseStudy = {
  slug: 'design-system', title: 'Design system: 267 → 24 tokens', company: 'Atrinium', years: '2024',
  tagline: 'El nivel de sistema que cada producto se puede permitir: tokens con rol, componentes con contrato y reglas de decisión, adoptados por los cuatro front.',
  tags: ['Design system', 'En producción', 'Multi-producto'], brand: '#15181f',
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
    code: { title: 'Un token semántico resuelto por tenant', lang: 'ts', code: `// el componente solo conoce el rol
const Boton = () => <button className="btn" />;   // .btn { background: var(--color-action) }

// el tenant decide el valor al iniciar sesión
const temas = {
  compania_a: { '--color-action': '#1f2a5a' },
  compania_b: { '--color-action': '#0f3d3e' },
};
for (const [k, v] of Object.entries(temas[tenant])) document.documentElement.style.setProperty(k, v);` },
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
    outcome: 'unavailable',
    measure: 'Componentes reutilizados por módulo nuevo y tiempo de diseño por iniciativa antes y después del sistema.',
  },
  learnings: [
    'El punto de partida de un sistema es el código que ya existe, no la pizarra.',
    'La gobernanza se dimensiona por producto: imponerla donde no hace falta la mata.',
  ],
  next: 'hermes',
};
