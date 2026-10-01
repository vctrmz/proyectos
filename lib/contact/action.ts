'use server';

import { Resend } from 'resend';
import { checkBotId } from 'botid/server';
import { after } from 'next/server';
import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import type { CampoContacto, EstadoContacto } from './estado';
import { guardarEnHoja } from './hoja';

/* Enviar el mensaje del formulario a mi bandeja y dejar una copia en mi hoja
   de Google de contactos, donde marco a quién he respondido. No hay base de
   datos propia. Con `reply-to` puesto al visitante, responder es darle a
   «Responder» en Gmail, así que la conversación sigue donde ya trabajo.

   Es una Server Action: el formulario vive en el modal de contacto, que se
   abre con JavaScript, y React la envía por fetch. Eso es lo que permite a
   Vercel BotID adjuntar su comprobación al envío; un envío HTML clásico, sin
   JavaScript, llegaría sin ella y se trataría como un robot. */

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

  /* Vercel BotID: el reto invisible que el navegador resolvió al enviar. Para
     los robots que se saltan la página y envían directos a la acción, que son
     los que la trampa de arriba no ve. Si se equivoca con una persona, el
     mensaje no se pierde en silencio: se le dice que no salió y se le manda a
     las otras dos vías del modal, copiar el correo o LinkedIn, que no pasan por
     aquí. Su texto se conserva para que pueda copiarlo. En local siempre deja
     pasar. */
  const { isBot } = await checkBotId();
  if (isBot) {
    console.warn('[contacto] BotID marcó el envío como robot');
    return { estado: 'error', errores: { global: t.errBot }, valores };
  }

  const errores: Partial<Record<CampoContacto, string>> = {};
  if (nombre.length < MIN.nombre || nombre.length > MAX.nombre) errores.nombre = t.errNombre;
  if (!pareceEmail(email) || email.length > MAX.email) errores.email = t.errEmail;
  if (mensaje.length < MIN.mensaje || mensaje.length > MAX.mensaje) errores.mensaje = t.errMensaje;
  if (!privacidad) errores.privacidad = t.errPrivacidad;
  if (Object.keys(errores).length) return { estado: 'error', errores, valores };

  /* La fila de la hoja se escribe cuando el visitante ya tiene su respuesta:
     Google tarda un par de segundos y el formulario no tiene por qué esperarle.
     Va aunque el correo falle, así el mensaje queda guardado en algún sitio. */
  after(() => guardarEnHoja({ nombre, email, mensaje, idioma: locale }));

  const clave = process.env.RESEND_API_KEY;
  /* Sin clave no se finge un envío: se dice que falló y se ofrece el correo
     directo, que es lo único que de verdad le sirve a quien está escribiendo.

     Al visitante se le da siempre el mismo mensaje —no es asunto suyo por qué
     falló—, pero el registro del servidor distingue los casos. Sin esto, «no
     he podido enviarlo» puede ser una clave que falta, una clave inválida o
     Resend rechazando, y desde fuera los tres se ven idénticos. */
  if (!clave) {
    console.error('[contacto] falta RESEND_API_KEY en el entorno: la variable no llegó al despliegue');
    return { estado: 'error', errores: { global: t.errServicio }, valores };
  }

  try {
    const { error } = await new Resend(clave).emails.send({
      from: REMITENTE,
      to: SITE.email,
      replyTo: email,
      subject: unaLinea(`Portafolio · ${nombre}`),
      text: `${nombre} <${email}>\nIdioma de la página: ${locale}\n\n${mensaje}\n`,
    });
    if (error) {
      console.error('[contacto] Resend rechazó el envío:', error.name, '·', error.message);
      return { estado: 'error', errores: { global: t.errServicio }, valores };
    }
    return { estado: 'ok' };
  } catch (e) {
    console.error('[contacto] el envío reventó:', e instanceof Error ? e.message : e);
    return { estado: 'error', errores: { global: t.errServicio }, valores };
  }
}
