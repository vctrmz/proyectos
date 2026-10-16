/* Tinta legible sobre un color de marca. El contraste no se decide a ojo: se
   calcula la luminancia y gana la tinta —blanca o negra— con más contraste,
   así que cualquier marca que se añada mañana entra legible sin tocar el CSS. */
export function readableOn(hex: string): 'light' | 'dark' {
  const h = hex.replace('#', '');
  const to = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(to(0)) + 0.7152 * lin(to(2)) + 0.0722 * lin(to(4));
  return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.05) ? 'light' : 'dark';
}
