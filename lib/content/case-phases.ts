/* Las fases en que se lee un caso —Discover, Define, Develop, Deliver y
   cierre— y a cuál pertenece cada sección. Es el orden del relato: el proceso
   (benchmark e ideas, del boceto al producto, entrega) cae en su fase junto a
   las decisiones que explican el porqué. Los casos ya no llevan film de
   planos animados: solo los productos tienen vídeo o demo propia. */
export const PHASE_KEYS = ['open', 'discover', 'define', 'develop', 'deliver', 'close'] as const;
export const PHASE_ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V'];
/* Los títulos de fase van en inglés en los dos idiomas, como en el storyboard. */
export const PHASE_WORDS = ['Opening', 'Discover', 'Define', 'Develop', 'Deliver', 'Takeaways'];

/* A qué fase pertenece cada sección del caso, en el orden en que se leen. */
export const SECTION_PHASE: Record<string, number> = {
  'c-problema': 1, 'c-demo': 1, 'c-proceso': 1, 'c-audiencias': 1,
  'c-reto': 2, 'c-complejidad': 2, 'c-hallazgos': 2,
  'c-evolucion': 3, 'c-decisiones': 3, 'c-flujos': 3, 'c-sistema': 3,
  'c-diseno': 4, 'c-entrega': 4, 'c-impl': 4, 'c-resultado': 4,
  'c-apr': 5,
};
export const SECTION_ORDER = Object.keys(SECTION_PHASE);
