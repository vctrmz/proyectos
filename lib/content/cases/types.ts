export type DiagramId = 'clients-to-system' | 'areas-map' | 'before-after' | 'state-machine' | 'template-slots' | 'grid-12-4-1' | 'system-cycle' | 'timeline';
export interface Metric { value: string; label: string; meaning: string }
export interface Shot { src: string; alt: string; caption: string }
export interface Decision { title: string; why: string; changed: string; figure?: { shot: Shot } | { diagram: DiagramId } }
export interface CodeDemo { title: string; lang: 'json' | 'ts'; code: string }
export interface CaseStudy {
  slug: string; title: string; company: string; years: string; tagline: string; tags: string[]; brand: string;
  hero: Shot; context: string; role: string; delivery: string;
  problem: [string, string]; complexity: { diagram: DiagramId; caption: string };
  decisions: Decision[]; system: { body: string[]; code?: CodeDemo };
  design: Shot[]; implementation: string[];
  result: { output: Metric[]; outcome: Metric[] | 'unavailable'; measure: string };
  learnings: [string, string]; next: string;
}
export const shot = (name: string, alt: string, caption: string): Shot => ({ src: `/assets/shots/${name}.webp`, alt, caption });
