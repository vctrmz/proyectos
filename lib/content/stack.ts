export interface StackContent { title: string; note: string; link: string; groups: { name: string; items: string[] }[] }

/* Con qué diseño y con qué lo llevo a código. Solo entra lo que se puede
   defender en una entrevista técnica: todo está en el repositorio de esta web. */
export const STACK: StackContent = {
  title: 'Stack',
  note: 'Esta web está hecha con este stack.',
  link: 'Ver el código en GitHub',
  groups: [
    { name: 'Diseño y sistemas', items: ['Figma (avanzado)', 'Design tokens', 'Arquitectura de componentes', 'Accesibilidad WCAG 2.2'] },
    { name: 'Código y entrega', items: ['HTML · CSS', 'React', 'Next.js', 'TypeScript', 'Git y pull requests', 'Vitest · axe', 'Vercel'] },
  ],
};
