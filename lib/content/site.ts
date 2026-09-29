export const SITE = {
  name: 'Víctor Maza',
  role: 'Product Designer',
  email: 'vctrmz47@gmail.com',
  city: 'Málaga',
  linkedin: 'https://linkedin.com/in/victor-maza47',
  github: 'https://github.com/vctrmz',
  /* El repositorio de esta web: la prueba de que el diseño llega a código.
     Solo se enlaza en producción cuando es público (ver el plan del 29-09). */
  repo: 'https://github.com/vctrmz/proyectos',
  behance: 'https://behance.net/mazdesign',
  figma: 'https://www.figma.com/design/lEPRv8iPrIDwUBKnbWKMdu/Portfolio?node-id=8-136130&t=srL7KcBmRZtEGLME-1',
  /* El dominio del CV es el canonico. El otro alias del proyecto de Vercel
     sigue sirviendo la web, pero apunta aqui en canonical y en el sitemap:
     un solo enlace indexable para dos puertas. */
  url: 'https://victormaza.vercel.app',
} as const;

export const NAV = [
  { href: '/#trabajo', label: 'Trabajo' },
  { href: '/sobre-mi', label: 'Sobre mí' },
] as const;
