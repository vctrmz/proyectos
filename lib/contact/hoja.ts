import type { Locale } from '@/lib/i18n/config';

/* Copia de cada mensaje en mi hoja de Google «Contactos del portafolio», para
   llevar a quién he respondido. La hoja tiene un Apps Script que recibe el
   POST y añade la fila (scripts/contactos-hoja.gs); el estado y las notas los
   pongo yo a mano allí.

   Es un registro extra, nunca un punto de fallo: el correo sale igual aunque la
   hoja no responda, y por eso aquí no se lanza nada, solo se deja rastro en el
   registro del servidor. Sin las dos variables —en local, en los tests— no hay
   hoja y no se intenta.

   La clave va en el cuerpo y no en la URL, para que no acabe en ningún registro
   de peticiones. */

export type FilaContacto = { nombre: string; email: string; mensaje: string; idioma: Locale };

export async function guardarEnHoja(fila: FilaContacto): Promise<void> {
  const url = process.env.CONTACTOS_HOJA_URL;
  const clave = process.env.CONTACTOS_HOJA_CLAVE;
  if (!url || !clave) return;

  try {
    // Apps Script responde con una redirección a la salida del script: hay que seguirla.
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave, ...fila }),
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
    const cuerpo = (await r.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!r.ok || !cuerpo?.ok) console.error('[contacto] la hoja no guardó la fila:', r.status, cuerpo?.error ?? 'sin respuesta JSON');
  } catch (e) {
    console.error('[contacto] la hoja no respondió:', e instanceof Error ? e.message : e);
  }
}
