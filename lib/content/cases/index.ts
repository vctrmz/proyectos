import { hermes } from './hermes';
import { suscripcion } from './suscripcion';
import { editorPropuesta } from './editor-propuesta';
import { vista360 } from './vista-360';
import { designSystem } from './design-system';
export type { CaseStudy, Decision, Metric, Shot, DiagramId, CodeDemo } from './types';

export const CASES = [hermes, suscripcion, editorPropuesta, vista360, designSystem];
export const CASE_SLUGS = CASES.map((c) => c.slug);
export const getCase = (slug: string) => CASES.find((c) => c.slug === slug);
