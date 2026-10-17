import { ayax } from './ayax';
import { hermes } from './hermes';
import { flesip } from './flesip';
import { montsaint } from './montsaint';
import { mercantil } from './mercantil';
import { designSystem } from './design-system';
import { pidemony } from './pidemony';
export type { CaseStudy, Decision, Metric, Shot, DiagramId, DemoId, CodeDemo, UiKitKind, UiKitPiece, Challenge, Audience, Flow, Finding, Severity, Storyboard, StoryAct, StoryShot, StoryFrame } from './types';

/* El orden es el del catálogo: los cinco proyectos completos primero y los
   módulos de HERMES después. CASE_SLUGS tiene que coincidir con el orden de
   PROJECTS con caso, y el test lo comprueba. */
export const CASES = [ayax, hermes, flesip, montsaint, mercantil, designSystem, pidemony];
export const CASE_SLUGS = CASES.map((c) => c.slug);
export const getCase = (slug: string) => CASES.find((c) => c.slug === slug);
