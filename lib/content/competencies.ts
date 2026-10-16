/* Trece competencias, las que tienen un caso detrás. Eran veintidós, copiadas
   del portfolio anterior (su página /perfil); la auditoría del 21-09 y la
   revisión de reclutador del 30-09 pidieron dejar solo lo que se puede
   defender con un caso abierto. El 16-10 se alinean con el CV: dashboards,
   impacto medido con encuestas e IA aplicada al diseño, con esta web como caso. */
export type Competency = { id: string; title: string; body: string };
export type CompetencyGroup = { n: string; name: string; items: Competency[] };

export const COMPETENCIES: CompetencyGroup[] = [
  {
    n: '01',
    name: 'Estrategia y diseño de producto',
    items: [
      { id: '1.1', title: 'Experiencias complejas en B2B SaaS', body: 'Entornos con reglas de negocio, múltiples roles, flujos críticos y alta densidad de información.' },
      { id: '1.2', title: 'Arquitectura de información y flujos', body: 'Simplificar procesos complejos para mejorar comprensión, eficiencia y finalización de tareas.' },
      { id: '1.3', title: 'Diseño accesible e inclusivo', body: 'Aplicación práctica de WCAG 2.1 y 2.2 en componentes, contenido, contraste, foco, navegación por teclado y estados de error.' },
      { id: '1.4', title: 'Dashboards y visualización de datos', body: 'Una vista para quien opera la plataforma y otra para cada cliente, con las métricas que sirven para decidir y no solo para mirar.' },
    ],
  },
  {
    n: '02',
    name: 'Liderazgo e influencia',
    items: [
      { id: '2.1', title: 'Comunicación estratégica', body: 'Presentar propuestas, racionales de diseño y hallazgos para alinear a Product, Engineering, Product Owners y stakeholders.' },
      { id: '2.2', title: 'Autonomía y adaptación', body: 'Ownership de iniciativas desde la exploración hasta la implementación, en contextos dinámicos y de alta ambigüedad.' },
      { id: '2.3', title: 'Impacto medido', body: 'Encuestas cualitativas y cuantitativas y datos de uso para medir cada iniciativa y contrastar dos o tres alternativas con el cliente.' },
    ],
  },
  {
    n: '03',
    name: 'Design systems y calidad',
    items: [
      { id: '3.1', title: 'Pensamiento sistémico', body: 'Creación, evolución y mantenimiento de design systems para plataformas digitales complejas.' },
      { id: '3.2', title: 'Gobernanza del sistema', body: 'Principios, foundations, tokens, componentes, patrones, documentación, contribución y adopción entre equipos.' },
    ],
  },
  {
    n: '04',
    name: 'Colaboración técnica y entrega',
    items: [
      { id: '4.1', title: 'Colaboración estrecha con desarrollo', body: 'Especificaciones claras, handoff estructurado, revisión de implementación y dudas resueltas juntos para preservar la intención de diseño.' },
      { id: '4.2', title: 'Front-end aplicado al diseño', body: 'Componentes, responsive, design tokens y límites de implementación en entornos React, TypeScript y Chakra UI.' },
    ],
  },
  {
    n: '05',
    name: 'IA aplicada al diseño',
    items: [
      { id: '5.1', title: 'IA en el proceso de diseño', body: 'Prototipado interactivo, exploración de alternativas, síntesis de research y documentación de flujos, sabiendo dónde ayudan los LLMs y dónde fallan.' },
      { id: '5.2', title: 'Implementación dirigida con IA', body: 'Foundations en Figma y front en React dirigidos con Claude. Esta web es el caso: Next.js, tests y código público.' },
    ],
  },
];
