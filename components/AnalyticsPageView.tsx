'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { readConsent } from '@/lib/consent';

/* Con navegación sin recarga gtag no ve el cambio de página: se envía a mano
   a partir de la segunda ruta (la primera la manda `config`). Comparamos con
   la ruta anterior en vez de un flag booleano: en StrictMode React invoca el
   efecto de montaje dos veces, y con un flag la segunda pasada ya lo ve en
   `false` y dispara un page_view fantasma para la ruta inicial. Comparando
   contra `prev` ambas pasadas ven `prev === pathname` y no envían nada; solo
   un cambio de ruta real hace que difieran. */
export default function AnalyticsPageView() {
  const pathname = usePathname();
  const prev = useRef(pathname);
  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    if (readConsent() !== 'granted') return;
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (gtag) gtag('event', 'page_view', { page_path: pathname, page_location: location.href, page_title: document.title });
  }, [pathname]);
  return null;
}
