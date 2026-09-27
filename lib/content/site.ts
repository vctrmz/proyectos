export const SITE = {
  name: 'Víctor Maza',
  role: 'Product Designer',
  email: 'vctrmz47@gmail.com',
  city: 'Málaga',
  available: 'Disponible desde septiembre de 2026',
  linkedin: 'https://linkedin.com/in/victor-maza47',
  behance: 'https://behance.net/mazdesign',
  instagram: 'https://instagram.com/mazdesign',
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
