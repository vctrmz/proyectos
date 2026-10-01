/* Registro de contactos del portafolio — Google Apps Script.

   No forma parte de la web: vive dentro de la hoja de cálculo «Contactos del
   portafolio», en la cuenta de Google de Víctor. Aquí se guarda una copia para
   que esté versionada junto al código que la llama (lib/contact/hoja.ts).

   Cada mensaje del formulario añade una fila: fecha, nombre, correo, mensaje e
   idioma. Las dos últimas columnas son mías y la web nunca las toca: el
   «Estado» (Pendiente, Respondido o Descartado), que cambio a mano, y «Mis
   notas».

   Puesta en marcha, una sola vez:
   1. En la hoja: Extensiones → Apps Script, pegar este archivo entero y guardar.
   2. Elegir la función `configurar` y pulsar Ejecutar. Pide permiso a tu cuenta;
      Google avisa de que la app no está verificada porque es tuya: Configuración
      avanzada → Ir a … (no seguro). Prepara las columnas y escribe en el
      registro de ejecución la clave que hay que poner en Vercel.
   3. Implementar → Nueva implementación → Aplicación web. Ejecutar como: yo.
      Quién tiene acceso: cualquier usuario. La URL que da es la otra mitad que
      va a Vercel.

   «Cualquier usuario» solo significa que la URL responde sin iniciar sesión:
   sin la clave, que vive en Vercel y nunca llega al navegador, no escribe nada.

   Volver a ejecutar `configurar` es seguro: no borra filas ni cambia la clave,
   y vuelve a mostrarla en el registro. */

const HOJA = 'Contactos';
const CABECERA = ['Fecha', 'Nombre', 'Correo', 'Mensaje', 'Idioma', 'Estado', 'Mis notas'];
const ANCHOS = [130, 160, 220, 420, 60, 120, 320];
const ESTADOS = ['Pendiente', 'Respondido', 'Descartado'];
const COL_ESTADO = 6;

function configurar() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  libro.setSpreadsheetTimeZone('Europe/Madrid');

  // La primera pestaña se aprovecha si está vacía; si no, se crea una nueva.
  let hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.getSheets()[0];
    if (hoja.getLastRow() > 0) hoja = libro.insertSheet(HOJA);
    else hoja.setName(HOJA);
  }

  hoja.getRange(1, 1, 1, CABECERA.length)
    .setValues([CABECERA])
    .setFontWeight('bold')
    .setBackground('#121317')
    .setFontColor('#ffffff');
  hoja.setFrozenRows(1);
  ANCHOS.forEach((ancho, i) => hoja.setColumnWidth(i + 1, ancho));
  hoja.getRange('A2:A').setNumberFormat('dd/MM/yyyy HH:mm');
  hoja.getRange('D2:D').setWrap(true);
  hoja.getRange('G2:G').setWrap(true);
  hoja.getRange(2, COL_ESTADO, hoja.getMaxRows() - 1, 1).setDataValidation(reglaEstado());

  // El color acompaña al texto del estado, no lo sustituye.
  const estados = hoja.getRange(2, COL_ESTADO, hoja.getMaxRows() - 1, 1);
  const color = (texto, fondo, tinta) => SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(texto).setBackground(fondo).setFontColor(tinta).setRanges([estados]).build();
  hoja.setConditionalFormatRules([
    color('Pendiente', '#fff4ce', '#7a5a00'),
    color('Respondido', '#e3f6d8', '#1f7a38'),
    color('Descartado', '#eef0f6', '#6a6a71'),
  ]);

  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('CLAVE')) props.setProperty('CLAVE', Utilities.getUuid() + Utilities.getUuid());
  console.log('Clave para Vercel (CONTACTOS_HOJA_CLAVE): ' + props.getProperty('CLAVE'));
}

/* La web llama aquí por POST con { clave, nombre, email, mensaje, idioma }. */
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const clave = PropertiesService.getScriptProperties().getProperty('CLAVE');
    if (!clave || datos.clave !== clave) return respuesta({ ok: false, error: 'clave' });

    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
    // Dos mensajes a la vez no se pisan la fila.
    const cerrojo = LockService.getScriptLock();
    cerrojo.waitLock(10000);
    try {
      hoja.appendRow([
        new Date(),
        texto(datos.nombre, 80),
        texto(datos.email, 120),
        texto(datos.mensaje, 2000),
        texto(datos.idioma, 5),
        'Pendiente',
        '',
      ]);
      hoja.getRange(hoja.getLastRow(), COL_ESTADO).setDataValidation(reglaEstado());
    } finally {
      cerrojo.releaseLock();
    }
    return respuesta({ ok: true });
  } catch (err) {
    return respuesta({ ok: false, error: String(err) });
  }
}

function reglaEstado() {
  return SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(false).build();
}

/* Lo que escribe un visitante nunca se toma por fórmula: una celda que empieza
   por =, +, -, @ o un tabulador se ejecutaría en la hoja. El apóstrofo delante
   la deja como texto. */
function texto(valor, max) {
  const s = String(valor == null ? '' : valor).slice(0, max);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function respuesta(cuerpo) {
  return ContentService.createTextOutput(JSON.stringify(cuerpo)).setMimeType(ContentService.MimeType.JSON);
}
