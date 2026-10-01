'use client';
import Link from 'next/link';
import { useActionState, useEffect, useId, useRef } from 'react';
import { enviarContacto } from '@/lib/contact/action';
import { ESTADO_INICIAL } from '@/lib/contact/estado';
import { ROUTES } from '@/lib/i18n/config';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import s from './ContactForm.module.css';

/* El formulario del modal de contacto. Tres campos: quién eres, por dónde te
   respondo y qué necesitas. Cada campo de más cuesta mensajes, y lo demás se
   pregunta respondiendo.

   Va sobre una Server Action, así que el envío funciona aunque el JavaScript
   no cargue; lo que añade el cliente son los estados —enviando, enviado, los
   errores junto a su campo— y la trampa de tiempo.

   Los errores se atan al campo con aria-describedby y el resultado se anuncia
   en una región viva: quien no ve el cambio de color tiene que enterarse
   igual de que el mensaje salió o de por qué no. */
export default function ContactForm() {
  const locale = useLocale();
  const ui = useUi();
  const t = ui.contact;
  const [estado, accion, enviando] = useActionState(enviarContacto, ESTADO_INICIAL);
  const id = useId();
  const campo = (n: string) => `${id}-${n}`;
  const err = (n: 'nombre' | 'email' | 'mensaje' | 'privacidad') => estado.errores?.[n];

  /* Tras un error, el foco va al primer campo que falla; tras un envío, al
     aviso. Si no, quien navega con teclado se queda donde estaba sin saber
     qué ha pasado. */
  const aviso = useRef<HTMLParagraphElement | null>(null);
  const form = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (estado.estado === 'ok') { aviso.current?.focus(); return; }
    if (estado.estado === 'error') {
      const primero = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (primero ?? aviso.current)?.focus();
    }
  }, [estado]);

  if (estado.estado === 'ok') {
    return (
      <div className={s.done}>
        <p className={s.doneTitle} tabIndex={-1} ref={aviso}>{t.okTitulo}</p>
        <p className={s.doneText}>{t.okTexto}</p>
      </div>
    );
  }

  return (
    <form ref={form} action={accion} className={s.form} noValidate>
      <input type="hidden" name="locale" value={locale} />
      {/* Trampa para robots: fuera de la tabulación y fuera de lectura. */}
      <div className={s.trap} aria-hidden="true">
        <label htmlFor={campo('empresa')}>Empresa</label>
        <input id={campo('empresa')} name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={s.row}>
        <p className={s.field}>
          <label htmlFor={campo('nombre')}>{t.nombre}</label>
          <input
            id={campo('nombre')} name="nombre" type="text" required maxLength={80} autoComplete="name"
            defaultValue={estado.valores?.nombre ?? ''}
            aria-invalid={err('nombre') ? 'true' : undefined}
            aria-describedby={err('nombre') ? campo('e-nombre') : undefined}
          />
          {err('nombre') && <span id={campo('e-nombre')} className={s.err}>{err('nombre')}</span>}
        </p>
        <p className={s.field}>
          <label htmlFor={campo('email')}>{t.email}</label>
          <input
            id={campo('email')} name="email" type="email" required maxLength={120} autoComplete="email" inputMode="email"
            defaultValue={estado.valores?.email ?? ''}
            aria-invalid={err('email') ? 'true' : undefined}
            aria-describedby={err('email') ? campo('e-email') : undefined}
          />
          {err('email') && <span id={campo('e-email')} className={s.err}>{err('email')}</span>}
        </p>
      </div>

      <p className={s.field}>
        <label htmlFor={campo('mensaje')}>{t.mensaje}</label>
        <textarea
          id={campo('mensaje')} name="mensaje" required rows={4} maxLength={2000}
          defaultValue={estado.valores?.mensaje ?? ''}
          aria-invalid={err('mensaje') ? 'true' : undefined}
          aria-describedby={err('mensaje') ? campo('e-mensaje') : undefined}
        />
        {err('mensaje') && <span id={campo('e-mensaje')} className={s.err}>{err('mensaje')}</span>}
      </p>

      <p className={s.consent}>
        <input
          id={campo('privacidad')} name="privacidad" type="checkbox" required
          aria-invalid={err('privacidad') ? 'true' : undefined}
          aria-describedby={err('privacidad') ? campo('e-privacidad') : undefined}
        />
        <label htmlFor={campo('privacidad')}>
          {t.privacidad} <Link href={ROUTES[locale].privacy}>{t.privacidadEnlace}</Link>.
        </label>
        {err('privacidad') && <span id={campo('e-privacidad')} className={s.err}>{err('privacidad')}</span>}
      </p>

      <div className={s.actions}>
        <button type="submit" className={s.send} disabled={enviando}>
          {enviando ? t.enviando : t.enviar}
        </button>
        <p className={s.live} aria-live="polite" tabIndex={-1} ref={aviso}>
          {estado.errores?.global ?? ''}
        </p>
      </div>
    </form>
  );
}
