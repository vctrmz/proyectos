'use server';

import { Resend } from 'resend';
import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import type { CampoContacto, EstadoContacto } from './estado';

/* Enviar el mensaje del formulario a mi bandeja. No hay base de datos ni se
   guarda nada: el correo sale y lo que queda del mensaje es el correo mismo.
   Con `reply-to` puesto al visitante, responder es darle a «Responder» en
   Gmail, así que la conversación sigue donde ya trabajo.

   Es una Server Action y no una ruta de API a propósito: `<form action={…}>`
   envía aunque el JavaScript no haya cargado, que es justo el caso de quien
   entra con una conexión mala o con el navegador restringido. Sin JS se
   pierden los estados bonitos, no el mensaje. */

const MAX = { nombre: 80, email: 120, mensaje: 2000 };
const MIN = { nombre: 2, mensaje: 10 };
const REMITENTE = 'Portafolio <onboarding@resend.dev>';

const texto = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '');
/* Ni saltos ni retornos en el asunto: una cabecera de correo es de una línea. */
const unaLinea = (v: string) => v.replace(/[\r\n]+/g, ' ').slice(0, 120);
const pareceEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function enviarContacto(_prev: EstadoContacto, form: FormData): Promise<EstadoContacto> {
  const locale: Locale = LOCALES.includes(form.get('locale') as Locale) ? (form.get('locale') as Locale) : DEFAULT_LOCALE;
  const t = getUi(locale).contact;

  const nombre = texto(form.get('nombre'));
  const email = texto(form.get('email'));
  const mensaje = texto(form.get('mensaje'));
  const privacidad = form.get('privacidad') === 'on';
  const valores = { nombre, email, mensaje };

  /* Trampa para robots: el campo está oculto y sin tabulación, así que sólo lo
     rellena un programa. Se responde «enviado» sin enviar nada —decirle que se
     le ha pillado sólo le enseña a evitarlo la próxima vez.

     Aquí había también una trampa de tiempo —rechazar lo enviado en menos de
     tres segundos— y la quité: con autocompletado del navegador una persona
     baja de tres segundos sin esfuerzo, y el precio de equivocarse es tirar un
     mensaje real haciéndole creer que salió. Los robots que vale la pena parar
     envían directos a la acción, sin pasar por la página, así que la marca de
     tiempo no los veía de todas formas. Perder un contacto cuesta más que
     recibir algo de spam. */
  if (texto(form.get('empresa'))) return { estado: 'ok' };

  const errores: Partial<Record<CampoContacto, string>> = {};
  if (nombre.length < MIN.nombre || nombre.length > MAX.nombre) errores.nombre = t.errNombre;
  if (!pareceEmail(email) || email.length > MAX.email) errores.email = t.errEmail;
  if (mensaje.length < MIN.mensaje || mensaje.length > MAX.mensaje) errores.mensaje = t.errMensaje;
  if (!privacidad) errores.privacidad = t.errPrivacidad;
  if (Object.keys(errores).length) return { estado: 'error', errores, valores };

  const clave = process.env.RESEND_API_KEY;
  /* Sin clave no se finge un envío: se dice que falló y se ofrece el correo
     directo, que es lo único que de verdad le sirve a quien está escribiendo. */
  if (!clave) return { estado: 'error', errores: { global: t.errServicio }, valores };

  try {
    const { error } = await new Resend(clave).emails.send({
      from: REMITENTE,
      to: SITE.email,
      replyTo: email,
      subject: unaLinea(`Portafolio · ${nombre}`),
      text: `${nombre} <${email}>\nIdioma de la página: ${locale}\n\n${mensaje}\n`,
    });
    if (error) return { estado: 'error', errores: { global: t.errServicio }, valores };
    return { estado: 'ok' };
  } catch {
    return { estado: 'error', errores: { global: t.errServicio }, valores };
  }
}
