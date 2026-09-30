'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { motionAllowed, isCoarsePointer } from '@/lib/motion/prefs';
import { SITE } from '@/lib/content/site';
import CopyEmail from '@/components/ui/CopyEmail';
import type { Locale } from '@/lib/i18n/config';
import s from './idcard.module.css';

/* Tarjeta de acreditación colgando de un cordón: se arrastra a los lados y
   vuelve al centro con inercia, como un péndulo. El giro ocurre sobre el
   anclaje del cordón, así que cuerda y tarjeta se mueven juntas.

   El contenido es texto real —nombre, rol, ciudad— no una imagen con letras:
   se lee, se copia y lo indexa un buscador. El arrastre es un extra; sin JS o
   con reduced-motion la tarjeta se queda quieta y legible. */
const MAX = 26;   // grados de giro máximo
const RATIO = 0.14; // píxeles de arrastre por grado

export default function IdCard({ locale = 'es' }: { locale?: Locale }) {
  const angle = useMotionValue(0);
  const rotate = useTransform(angle, (a) => `${a}deg`);
  const host = useRef<HTMLDivElement>(null);
  const from = useRef<number | null>(null);

  const t = locale === 'en'
    ? { role: 'Product Designer', place: 'Remote', field: 'B2B SaaS', since: 'Since 2017', hint: 'Drag the card' }
    : { role: 'Product Designer', place: 'En remoto', field: 'B2B SaaS', since: 'Desde 2017', hint: 'Arrastra la tarjeta' };

  const grab = (e: React.PointerEvent) => {
    if (!motionAllowed()) return;
    from.current = e.clientX - angle.get() / RATIO;
    host.current?.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (from.current === null) return;
    const deg = (e.clientX - from.current) * RATIO;
    angle.set(Math.max(-MAX, Math.min(MAX, deg)));
  };
  const drop = (e: React.PointerEvent) => {
    if (from.current === null) return;
    from.current = null;
    host.current?.releasePointerCapture(e.pointerId);
    /* Muelle blando y poco amortiguado: oscila un par de veces antes de
       quedarse quieta, que es lo que hace que parezca que pesa. */
    animate(angle, 0, { type: 'spring', stiffness: 55, damping: 5.5, mass: 1.1 });
  };

  const sway = motionAllowed() && !isCoarsePointer();

  return (
    <div className={s.wrap}>
      <motion.div
        ref={host}
        className={`${s.pivot} ${sway ? s.sway : ''}`}
        style={{ rotate }}
        onPointerDown={grab}
        onPointerMove={move}
        onPointerUp={drop}
        onPointerCancel={drop}
      >
        <svg className={s.cord} viewBox="0 0 120 130" aria-hidden="true" focusable="false">
          <path d="M60 2 L22 104" className={s.rope} />
          <path d="M60 2 L98 104" className={s.rope} />
          <rect x="52" y="0" width="16" height="7" rx="3" className={s.anchor} />
        </svg>
        <div className={s.clip} aria-hidden="true"><span /></div>
        <div className={s.card}>
          <div className={s.top}>
            <span className={s.org}>Víctor Maza</span>
            <span className={s.id}>VM·2026</span>
          </div>
          <div className={s.photo}>
            <Image src="/assets/victor.jpg" alt="Víctor Maza" width={320} height={320} sizes="220px" />
          </div>
          <p className={s.name}>Víctor Maza</p>
          <p className={s.role}>{t.role}</p>
          <dl className={s.data}>
            <div><dt>{locale === 'en' ? 'Based in' : 'Base'}</dt><dd>{t.place}</dd></div>
            <div><dt>{locale === 'en' ? 'Field' : 'Sector'}</dt><dd>{t.field}</dd></div>
            <div><dt>{locale === 'en' ? 'Practising' : 'En activo'}</dt><dd>{t.since}</dd></div>
          </dl>
          <div className={s.bars} aria-hidden="true">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ width: (i * 7) % 3 === 0 ? 3 : 1 }} />)}</div>
          <span className={s.mailRow}>
            <a className={s.mail} href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <CopyEmail />
          </span>
        </div>
      </motion.div>
      {sway && <p className={s.hint} aria-hidden="true">{t.hint}</p>}
    </div>
  );
}
