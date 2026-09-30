import type { Locale } from '@/lib/i18n/config';

/* Banderas dibujadas en SVG y no con emoji: en Windows los emoji de bandera no
   tienen glifo y se ven como «ES» y «GB» en letras. Van siempre con su texto
   al lado, porque una bandera sola no es una etiqueta de idioma accesible —ni
   para un lector de pantalla ni para quien no asocia el trapo con la lengua—,
   así que aquí van marcadas como decorativas y el nombre lo pone quien la usa.

   Una sola copia para el cambio de idioma de la cabecera y para el selector
   del CV: dos dibujos distintos de la misma bandera en la misma página se
   notan. */
export default function Flag({ locale, className }: { locale: Locale; className?: string }) {
  if (locale === 'es') return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#C60B1E" />
      <rect y="4" width="24" height="8" fill="#FFC400" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" strokeWidth="3.4" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.8" />
      <path d="M12 0 V16 M0 8 H24" stroke="#fff" strokeWidth="5.4" />
      <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}
