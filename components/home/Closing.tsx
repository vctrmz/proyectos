'use client';
import { useState } from 'react';
import Inset from '@/components/ui/Inset';
import Button from '@/components/ui/Button';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Starfield from './Starfield';
import { SITE } from '@/lib/content/site';
import s from './Closing.module.css';

export default function Closing() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(SITE.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.location.href = `mailto:${SITE.email}`; }
  };
  return (
    <section id="contacto" className={`container ${s.wrap}`} aria-labelledby="closing-title">
      <Inset className={s.inset}>
        <Starfield />
        <div className={s.content}>
          <TwoToneHeading as="h2" id="closing-title" size="xl" lines={['¿Tienes un producto complejo?', 'Reglas densas, varios clientes, un equipo que necesita diseño construible.']} />
          <div className={s.grid}>
            <div><p className={s.k}>Problema</p><p className={s.v}>Complejidad B2B</p></div>
            <div><p className={s.k}>Método</p><p className={s.v}>UX + sistema + UI + implementación</p></div>
            <div><p className={s.k}>Evidencia</p><p className={s.v}>Nueve años · SaaS asegurador en producción</p></div>
            <div><p className={s.k}>Acción</p><p className={s.v}>Un correo</p></div>
          </div>
          <div className={s.ctas}>
            <Button onClick={copy} aria-label="Copiar correo">{SITE.email}</Button>
            <Button href={SITE.linkedin} external variant="outline">LinkedIn</Button>
            <span className={s.copied} role="status">{copied ? 'Correo copiado' : ''}</span>
          </div>
        </div>
      </Inset>
    </section>
  );
}
