import type { CaseStudy } from './cases';
import { shotSize } from './shots';

/* El film del caso: el mismo guion que la página, montado como un storyboard
   de cinco fases —Discover, Define, Develop, Deliver y cierre— con las
   pantallas reales del proyecto. No hay un film escrito a mano por caso: se
   deriva del contenido, así que cada caso nuevo trae el suyo y las cifras del
   film son siempre las del caso. */

export type FilmKind = 'open' | 'title' | 'scatter' | 'split' | 'focus' | 'tilt' | 'tour' | 'tokens' | 'count' | 'end';
/* r es alto / ancho: el motor decide con él si la pantalla es de móvil, de
   escritorio o una página larga que hay que recorrer. */
export interface FilmImg { src: string; r: number }
export interface FilmShot {
  i: number; start: number; dur: number; phase: number; kind: FilmKind;
  section?: string; word?: string; caption?: string; imgs: FilmImg[];
  count?: { value: string; label: string; more: string[] };
  rows?: { before: string; after: string; swatch?: string }[];
  end?: { logo?: string; title: string; line: string };
}
export interface Film { shots: FilmShot[]; total: number; brand: string }

export const PHASE_KEYS = ['open', 'discover', 'define', 'develop', 'deliver', 'close'] as const;
export const PHASE_ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V'];
/* Los títulos de fase van en inglés en los dos idiomas, como en el storyboard. */
export const PHASE_WORDS = ['Opening', 'Discover', 'Define', 'Develop', 'Deliver', 'Takeaways'];

/* A qué fase pertenece cada sección del caso, en el orden en que se leen. */
export const SECTION_PHASE: Record<string, number> = {
  'c-problema': 1, 'c-demo': 1, 'c-audiencias': 1,
  'c-reto': 2, 'c-complejidad': 2, 'c-hallazgos': 2,
  'c-decisiones': 3, 'c-flujos': 3, 'c-sistema': 3,
  'c-diseno': 4, 'c-impl': 4, 'c-resultado': 4,
  'c-apr': 5,
};
export const SECTION_ORDER = Object.keys(SECTION_PHASE);

/* Casos con pocas capturas propias: se completan con pantallas del mismo
   producto que ya están en la web, para que el plano de apertura no repita. */
const EXTRA: Record<string, string[]> = {
  'design-system': ['hx-dashboard', '08-planes-servicios', '04-preparar-producto', '11-resumen-comercial', '05-contratos'],
  'vista-360': ['16-datos-contacto', '06-agenda-participantes'],
};

const img = (src: string): FilmImg => { const z = shotSize(src); return { src, r: z.height / z.width }; };
const pick = <T,>(list: T[], n: number) => Array.from({ length: Math.min(n, Math.max(list.length, 1)) }, (_, k) => list[k % list.length]);

export function buildFilm(c: CaseStudy, sections: string[], logo?: string): Film {
  const figs = c.decisions.flatMap((d) => (d.figure && 'shot' in d.figure ? [d.figure.shot.src] : []));
  const srcs = [...new Set([c.hero.src, ...figs, ...c.design.map((d) => d.src), ...(EXTRA[c.slug] ?? []).map((n) => `/assets/shots/${n}.webp`)])];
  const pool = srcs.map(img);
  const at = (k: number) => pool[k % pool.length];
  const list: Omit<FilmShot, 'i' | 'start'>[] = [];
  const add = (s: Omit<FilmShot, 'i' | 'start'>) => list.push(s);

  add({ phase: 0, kind: 'open', dur: 3.75, imgs: [at(0)], caption: `${c.company} · ${c.years}` });
  let phase = 0;
  for (const id of SECTION_ORDER.filter((x) => sections.includes(x))) {
    const ph = SECTION_PHASE[id];
    if (ph !== phase && ph < 5) { add({ phase: ph, kind: 'title', dur: 2.5, word: PHASE_WORDS[ph], imgs: [] }); }
    phase = ph;
    const base = { phase: ph, section: id };
    switch (id) {
      case 'c-problema': add({ ...base, kind: 'scatter', dur: 5, imgs: pick(pool, 8) }); break;
      case 'c-demo': add({ ...base, kind: 'focus', dur: 5, imgs: [at(0)] }); break;
      case 'c-audiencias': add({ ...base, kind: 'split', dur: 5, imgs: [at(1), at(2)], caption: c.audiences?.items.map((a) => a.name).slice(0, 2).join(' · ') }); break;
      case 'c-reto': add({ ...base, kind: 'split', dur: 5, imgs: [at(2), at(3)], caption: c.challenge?.items.map((a) => a.title).slice(0, 2).join(' · ') }); break;
      case 'c-complejidad': add({ ...base, kind: 'tilt', dur: 5, imgs: [at(3)], caption: c.complexity.caption }); break;
      case 'c-hallazgos': add({ ...base, kind: 'focus', dur: 5, imgs: [at(4)], caption: `${c.findings!.items.length} · ${c.findings!.title}` }); break;
      case 'c-decisiones': add({ ...base, kind: 'tour', dur: 7.5, imgs: (figs.length > 1 ? figs.map(img) : pick(pool.slice(1).concat(pool[0]), 4)).slice(0, 5), caption: c.decisions[0].title }); break;
      case 'c-flujos': add({ ...base, kind: 'tilt', dur: 5, imgs: [at(5)], caption: c.flows!.list[0]?.title }); break;
      case 'c-sistema': {
        const t = c.system.tokens;
        const sw = c.system.uiKit?.find((p) => p.swatches)?.swatches;
        if (t) add({ ...base, kind: 'tokens', dur: 5, imgs: [], rows: t.rows.map((r) => ({ before: r.before, after: r.after, swatch: r.swatch })) });
        else if (sw) add({ ...base, kind: 'tokens', dur: 5, imgs: [], rows: sw.slice(0, 6).map((h, k) => ({ before: h, after: c.system.uiKit!.find((p) => p.swatches)!.labels?.[k] ?? h, swatch: h })) });
        else add({ ...base, kind: 'tilt', dur: 5, imgs: [at(6)], caption: c.system.uiKit?.[0]?.title });
        break;
      }
      case 'c-diseno': add({ ...base, kind: 'tour', dur: 7.5, imgs: c.design.slice(0, 6).map((d) => img(d.src)) }); break;
      case 'c-impl': add({ ...base, kind: 'tilt', dur: 5, imgs: [at(pool.length - 1)] }); break;
      case 'c-resultado': {
        const [m, ...rest] = c.result.output;
        add({ ...base, kind: 'count', dur: 5, imgs: [], count: { value: m.value, label: m.label, more: rest.slice(0, 3).map((x) => `${x.value} ${x.label}`) } });
        break;
      }
      case 'c-apr': add({ ...base, kind: 'end', dur: 3.75, imgs: [], end: { logo, title: c.title, line: c.learnings[0] } }); break;
    }
  }
  let t = 0;
  const shots = list.map((s, i) => { const o = { ...s, i, start: t }; t += s.dur; return o; });
  return { shots, total: t, brand: c.brand };
}

/* Código de tiempo a 24 fps, como en el storyboard: mm:ss:ff. */
export function tc(sec: number) {
  const f = Math.round(sec * 24);
  return [Math.floor(f / 1440), Math.floor(f / 24) % 60, f % 24].map((n) => String(n).padStart(2, '0')).join(':');
}
