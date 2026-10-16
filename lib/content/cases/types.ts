export type DemoId = 'pidemony' | 'flesip';
export type DiagramId = 'clients-to-system' | 'areas-map' | 'before-after' | 'state-machine' | 'template-slots' | 'grid-12-4-1' | 'system-cycle' | 'timeline' | 'value-chain' | 'pending-invoice' | 'two-sided' | 'handoff-chain' | 'pide-y-paga';
export interface Metric { value: string; label: string; meaning: string }
export interface Shot { src: string; alt: string; caption: string }
/* tradeoff y wouldFix son las dos honestidades del caso: lo que se pagó por la
   decisión y lo que hoy haría distinto. Se pintan como llamadas aparte. */
export interface Decision { title: string; why: string; changed: string; tradeoff?: string; wouldFix?: string; figure?: { shot: Shot } | { diagram: DiagramId } }
/* El reto, en tarjetas: cada tensión del proyecto con su nombre. */
export interface Challenge { title: string; body: string }
/* Una audiencia: quién es, qué se pregunta, por dónde entra y a qué sale.
   `role` distingue a una persona de un segmento: si viene, la tarjeta la trata
   como proto-persona y le pone su monograma. */
export interface Audience { name: string; role?: string; question: string; entry: string; exit: string }
/* Un flujo numerado, con los pasos en orden y de quién es cada tramo. */
export interface Flow { title: string; side?: string; steps: { n: string; t: string; d: string }[] }
/* Un hallazgo de auditoría, con su severidad declarada. */
export type Severity = 'crítica' | 'alta' | 'media' | 'baja';
export interface Finding { n: string; title: string; body: string; rule: string; severity: Severity; where: string }
/* `source` dice de dónde sale el extracto: 'illustrative' cuando reconstruye
   la idea sin enseñar código de un cliente, 'repo' cuando es código real y
   público, con `href` al archivo. Por defecto, ilustrativo. */
/* Los mismos valores nombrados por apariencia y por intención: la propiedad
   del componente, el valor suelto con la pregunta que deja abierta, y el token
   con rol que la responde. Lo pinta TokenCompare. */
export interface TokenRow { use: string; before: string; question: string; after: string; swatch?: string }
export interface TokenCompare { title: string; lead: string; note?: string; rows: TokenRow[] }
export interface CodeDemo { title: string; lang: 'json' | 'ts' | 'css'; code: string; source?: 'illustrative' | 'repo'; href?: string }
/* Piezas del kit: cada caso declara solo las que tiene de verdad, y la maqueta
   se dibuja con los tokens de ese caso. */
export type UiKitKind = 'actions' | 'states' | 'table' | 'form' | 'phases' | 'tokens' | 'slots' | 'thread' | 'identity' | 'brands' | 'scale' | 'agenda' | 'product' | 'trust' | 'tiers';
/* label y labels llevan el vocabulario real de cada producto a la maqueta:
   sin ellos, todas las piezas hablarían el idioma de HERMES. `swatches` hace
   lo mismo con el color: la paleta de verdad del producto, en el orden de
   `labels`. */
export interface UiKitPiece { kind: UiKitKind; title: string; body: string; wide?: boolean; label?: string; labels?: string[]; swatches?: string[] }
/* Storyboard del caso: el detalle contado como una película por planos. Cada
   plano es un paso con su fotograma (dibujo, pieza viva del caso, captura real
   o diagrama), lo que pasa en él y, si lo hay, la decisión que lo mueve. La
   decisión es un índice en `decisions`: el texto vive en un solo sitio y los
   tests de contenido lo siguen vigilando. Sin storyboard, el caso se lee como
   el documento de siempre. */
export type StoryDrawId = 'five-languages' | 'copies' | 'one-size' | 'four-fronts' | 'one-language';
export type StoryLiveId = 'token-collapse' | 'token-compare' | 'uikit' | 'code';
export type StoryFrame = { draw: StoryDrawId; alt: string } | { live: StoryLiveId } | { shot: Shot } | { diagram: DiagramId };
export interface StoryShot { title: string; frame: StoryFrame; action: string; decision?: number; bridge?: string }
export interface StoryAct { title: string; summary: string; shots: StoryShot[] }
export interface Storyboard { acts: StoryAct[] }

export interface CaseStudy {
  slug: string; title: string; company: string; years: string; tagline: string; tags: string[]; brand: string;
  hero: Shot; context: string; role: string; delivery: string;
  problem: [string, string]; complexity: { diagram: DiagramId; caption: string };
  decisions: Decision[]; system: { body: string[]; /* El colapso animado 267 → 24 de la auditoría (TokenCollapse). */ collapse?: boolean; tokens?: TokenCompare; code?: CodeDemo; uiKit?: UiKitPiece[] };
  /* Bloques opcionales: cada caso enseña solo los que tiene. */
  challenge?: { title: string; items: Challenge[] };
  audiences?: { title: string; items: Audience[] };
  flows?: { title: string; caption?: string; list: Flow[] };
  findings?: { title: string; caption?: string; items: Finding[] };
  /* Una demo interactiva del producto, construida con su propio kit, para
     probarlo en vez de leerlo. Solo la trae el caso que la tiene. */
  demo?: { id: DemoId; intro: string };
  /* Una demo externa ya publicada (otra web): se enlaza desde la cabecera
     del caso con un botón, en lugar de incrustarla. */
  demoUrl?: string;
  /* Las decisiones en rejilla bento en lugar de en lista: tarjetas grandes y
     pequeñas que se alternan, para casos con decisiones cortas y pocas
     imágenes, donde la lista dejaría media pantalla vacía. */
  decisionsLayout?: 'bento';
  design: Shot[]; implementation: string[];
  result: { output: Metric[]; outcome: Metric[] | 'unavailable'; measure: string };
  learnings: string[]; next: string;
  storyboard?: Storyboard;
}
export const shot = (name: string, alt: string, caption: string): Shot => ({ src: `/assets/shots/${name}.webp`, alt, caption });
