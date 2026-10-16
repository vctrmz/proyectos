import { shot } from '../cases/types';
import { PROCESS, WIRES, type CaseProcess } from '../cases/process';
import type { Locale } from '@/lib/i18n/config';

/* The process in English for the translated cases. Same screens and the same
   box-by-box wireframes as the Spanish version; only the words change. */
const PROCESS_EN: Record<string, CaseProcess> = {
  hermes: {
    brief: 'Every company arrived with its own business logic, currency, language and regulator, and expected the product to behave like theirs.',
    bench: 'We reviewed how ERPs and CRMs in the sector handle per-client configuration, permissions and tracking dashboards.',
    ideas: 'The idea that won: design rules instead of cases, with brand and language as variables rather than versions of the product.',
    evolve: { text: 'The dashboard: sales network metrics and whatever needs action, on the first screen.', shot: shot('hx-dashboard', 'HERMES CRM dashboard', 'HERMES dashboard'), wire: WIRES.hermes },
    handoff: { text: 'Tokens and components handed over with usage criteria: engineering stopped asking how a pattern behaves because it was defined before it reached them.' },
  },
};

export const processIn = (locale: Locale, slug: string): CaseProcess | undefined =>
  (locale === 'en' ? PROCESS_EN[slug] : PROCESS[slug]);
