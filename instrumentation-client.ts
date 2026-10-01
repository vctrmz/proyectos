import { initBotId } from 'botid/client/core';

/* Vercel BotID: el formulario de contacto pasa una comprobación invisible de
   que quien envía es una persona. El formulario es una Server Action, y una
   Server Action se envía por POST a la página donde está el usuario; como el
   modal de contacto vive en todas las páginas, se protegen los POST de las dos
   lenguas. `*` cubre cualquier resto de ruta, también ninguno (`/es` a secas).

   Esto solo engancha fetch y XHR: el script del reto no se descarga hasta el
   primer envío protegido, así que no pesa en la carga de la página. */
initBotId({
  protect: [
    { path: '/es*', method: 'POST' },
    { path: '/en*', method: 'POST' },
  ],
});
