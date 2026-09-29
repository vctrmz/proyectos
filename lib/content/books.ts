export interface Book { slug: string; title: string; author: string; cover: string | null }

/* Libros que recomiendo: la estantería «leídos» de Goodreads, ordenada de lo
   más del oficio a lo más personal. Títulos en su idioma original. `cover`
   null pinta una portada tipográfica (ver scripts/fetch-books.mjs). */
const c = (slug: string) => `/assets/books/${slug}.webp`;
export const BOOKS: Book[] = [
  { slug: 'design-of-everyday-things', title: 'The Design of Everyday Things', author: 'Don Norman', cover: c('design-of-everyday-things') },
  { slug: 'dont-make-me-think', title: 'Don’t Make Me Think, Revisited', author: 'Steve Krug', cover: c('dont-make-me-think') },
  { slug: 'laws-of-ux', title: 'Laws of UX', author: 'Jon Yablonski', cover: c('laws-of-ux') },
  { slug: '100-things', title: '100 Things Every Designer Needs to Know About People', author: 'Susan M. Weinschenk', cover: c('100-things') },
  { slug: 'ux-strategy', title: 'UX Strategy', author: 'Jaime Levy', cover: null },
  { slug: 'lean-agile-design-thinking', title: 'Lean vs Agile vs Design Thinking', author: 'Jeff Gothelf', cover: c('lean-agile-design-thinking') },
  { slug: 'sprint', title: 'Sprint', author: 'Jake Knapp', cover: c('sprint') },
  { slug: 'hooked', title: 'Hooked', author: 'Nir Eyal', cover: c('hooked') },
  { slug: 'investigacion-ux', title: 'Investigación UX', author: 'Jorge Barahona Ch.', cover: c('investigacion-ux') },
  { slug: 'atomic-habits', title: 'Atomic Habits', author: 'James Clear', cover: c('atomic-habits') },
  { slug: 'camino-del-artista', title: 'El camino del artista', author: 'Julia Cameron', cover: c('camino-del-artista') },
];
