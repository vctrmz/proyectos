'use client';
import { useEffect, useState } from 'react';
import s from './casenav.module.css';

/* El índice del caso, como en las páginas del portafolio anterior: dice de
   cuántas partes consta la lectura y por dónde vas. Es un rail pegajoso a la
   izquierda del contenido en pantallas anchas y desaparece por debajo de
   1180 px, donde el sitio ya no tiene hueco para él.

   La sección activa se decide con IntersectionObserver —no con scroll—, y los
   enlaces son anclas reales: sin JS, el índice sigue navegando. */
export default function CaseNav({ items, label, heading }: { items: { id: string; label: string }[]; label: string; heading: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    /* Se observa la sección entera, no su titular: con el titular, al saltar a
       un ancla el <h2> queda por encima de la banda de detección y el índice se
       quedaba clavado en la primera parte. */
    const targets = items
      .map((i) => document.getElementById(i.id)?.closest('section') as HTMLElement | null)
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const id = visible[0]?.target.querySelector('[id^="c-"]')?.id;
      if (id) setActive(id);
    }, { rootMargin: '-25% 0px -60% 0px' });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className={s.nav} aria-label={label}>
      <p className={s.head}>{heading}</p>
      <ol className={s.list}>
        {items.map((i, n) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={s.link} aria-current={active === i.id ? 'true' : undefined}>
              <span className={s.n} aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
              <span>{i.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
