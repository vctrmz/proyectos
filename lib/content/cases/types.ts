export type DiagramId = 'clients-to-system' | 'areas-map' | 'before-after' | 'state-machine' | 'template-slots' | 'grid-12-4-1' | 'system-cycle' | 'timeline' | 'value-chain' | 'pending-invoice' | 'two-sided' | 'handoff-chain' | 'spec-to-prod';
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
export interface CodeDemo { title: string; lang: 'json' | 'ts' | 'css'; code: string; source?: 'illustrative' | 'repo'; href?: string }
/* Piezas del kit: cada caso declara solo las que tiene de verdad, y la maqueta
   se dibuja con los tokens de ese caso. */
export type UiKitKind = 'actions' | 'states' | 'table' | 'form' | 'phases' | 'tokens' | 'slots' | 'thread' | 'identity' | 'brands' | 'scale' | 'agenda' | 'product' | 'trust' | 'tiers';
/* label y labels llevan el vocabulario real de cada producto a la maqueta:
   sin ellos, todas las piezas hablarían el idioma de HERMES. */
export interface UiKitPiece { kind: UiKitKind; title: string; body: string; wide?: boolean; label?: string; labels?: string[] }
export interface CaseStudy {
  slug: string; title: string; company: string; years: string; tagline: string; tags: string[]; brand: string;
  hero: Shot; context: string; role: string; delivery: string;
  problem: [string, string]; complexity: { diagram: DiagramId; caption: string };
  decisions: Decision[]; system: { body: string[]; code?: CodeDemo; uiKit?: UiKitPiece[] };
  /* Bloques opcionales: cada caso enseña solo los que tiene. */
  challenge?: { title: string; items: Challenge[] };
  audiences?: { title: string; items: Audience[] };
  flows?: { title: string; caption?: string; list: Flow[] };
  findings?: { title: string; caption?: string; items: Finding[] };
  design: Shot[]; implementation: string[];
  result: { output: Metric[]; outcome: Metric[] | 'unavailable'; measure: string };
  learnings: string[]; next: string;
}
export const shot = (name: string, alt: string, caption: string): Shot => ({ src: `/assets/shots/${name}.webp`, alt, caption });
