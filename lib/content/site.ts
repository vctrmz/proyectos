export const SITE = {
  name: 'Víctor Maza',
  role: 'Product Designer',
  email: 'vctrmz47@gmail.com',
  /* Sin ciudad en el posicionamiento: la estrategia es buscar fuera, y un
     nombre de provincia en la primera línea filtra antes de que nadie lea el
     trabajo. Donde la ley obliga a identificar al responsable —la página de
     privacidad— sí figura. */
  base: { es: 'En remoto', en: 'Remote' },
  linkedin: 'https://linkedin.com/in/victor-maza47',
  github: 'https://github.com/vctrmz',
  /* El repositorio de esta web: la prueba de que el diseño llega a código.
     Solo se enlaza en producción cuando es público (ver el plan del 29-09). */
  repo: 'https://github.com/vctrmz/proyectos',
  /* Un CV por idioma. Los dos se escriben en `scripts/cv/cv-<idioma>.html` y
     se imprimen con `npm run cv`. kb lo comprueba un test contra cada archivo:
     la etiqueta del peso no puede mentir. */
  cv: {
    es: { href: '/victor-maza-cv.pdf', file: 'Victor_Maza_CV.pdf', kb: 73 },
    en: { href: '/victor-maza-cv-en.pdf', file: 'Victor_Maza_CV_EN.pdf', kb: 71 },
  },
  /* mazdesignr, con r: behance.net/mazdesign es otro estudio. */
  behance: 'https://www.behance.net/mazdesignr',
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
