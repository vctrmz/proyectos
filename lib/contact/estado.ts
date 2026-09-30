/* Tipos y estado inicial del formulario, fuera del fichero de la acción.

   No es una manía de orden: un fichero con `'use server'` sólo puede exportar
   funciones asíncronas —todo lo demás sería una referencia que el cliente no
   puede resolver—, así que exportar aquí el objeto inicial es la única forma
   de que lo compartan la acción y el formulario. El build compila igual y el
   fallo sale en la primera petición, no antes. */

export type CampoContacto = 'nombre' | 'email' | 'mensaje' | 'privacidad' | 'global';

export type EstadoContacto = {
  estado: 'inicial' | 'ok' | 'error';
  errores?: Partial<Record<CampoContacto, string>>;
  /* Lo escrito vuelve al formulario si algo falla: nadie debería teclear dos
     veces el mismo párrafo por un correo mal puesto. */
  valores?: { nombre: string; email: string; mensaje: string };
};

export const ESTADO_INICIAL: EstadoContacto = { estado: 'inicial' };
