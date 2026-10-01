/* Registro de contactos del portafolio — Google Apps Script.

   No forma parte de la web: vive dentro de la hoja de cálculo «Contactos del
   portafolio», en la cuenta de Google de Víctor. Aquí se guarda una copia para
   que esté versionada junto al código que la llama (lib/contact/hoja.ts).

   Cada mensaje del formulario añade una fila: fecha, nombre, correo, mensaje e
   idioma. Las dos últimas columnas son mías y la web nunca las toca: el
   «Estado» (Pendiente, Respondido, En curso o Descartado), que cambio a mano,
   y «Mis notas».

   Plazo de conservación, el de la política de privacidad: 12 meses desde que
   me escriben. Cada noche `limpiar` borra las filas más antiguas, salvo las
   que tengan el estado «En curso» —un proceso de selección o una relación
   profesional abierta—, que se quedan mientras dure. Los correos de Gmail con
   el mismo plazo los borro yo.

   Puesta en marcha, una sola vez:
   1. En la hoja: Extensiones → Apps Script, pegar este archivo entero y guardar.
   2. Elegir la función `configurar` y pulsar Ejecutar. Pide permiso a tu cuenta;
      Google avisa de que la app no está verificada porque es tuya: Configuración
      avanzada → Ir a … (no seguro). Prepara las columnas, programa la
      limpieza de cada noche y escribe en el registro de ejecución la clave
      que hay que poner en Vercel.
   3. Implementar → Nueva implementación → Aplicación web. Ejecutar como: yo.
      Quién tiene acceso: cualquier usuario. La URL que da es la otra mitad que
      va a Vercel.

   «Cualquier usuario» solo significa que la URL responde sin iniciar sesión:
   sin la clave, que vive en Vercel y nunca llega al navegador, no escribe nada.

   Volver a ejecutar `configurar` es seguro: no borra filas, no cambia la clave
   ni duplica la limpieza, y vuelve a mostrar la clave en el registro. */

const HOJA = 'Contactos';
const CABECERA = ['Fecha', 'Nombre', 'Correo', 'Mensaje', 'Idioma', 'Estado', 'Mis notas'];
const ANCHOS = [130, 160, 220, 420, 60, 120, 320];
const ESTADOS = ['Pendiente', 'Respondido', 'En curso', 'Descartado'];
const EN_CURSO = 'En curso';
const COL_ESTADO = 6;
const PLAZO_MESES = 12;

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
    color('En curso', '#e8e7fd', '#3a35c9'),
    color('Descartado', '#eef0f6', '#6a6a71'),
  ]);

  // La limpieza corre sola cada noche; se programa una vez.
  const yaProgramada = ScriptApp.getProjectTriggers().some((t) => t.getHandlerFunction() === 'limpiar');
  if (!yaProgramada) ScriptApp.newTrigger('limpiar').timeBased().everyDays(1).atHour(4).create();

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

/* Borra las filas de hace más de 12 meses, salvo las «En curso». Va de abajo
   arriba para que borrar una fila no mueva las que quedan por mirar. */
function limpiar() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
  const ultima = hoja.getLastRow();
  if (ultima < 2) return;
  const limite = new Date();
  limite.setMonth(limite.getMonth() - PLAZO_MESES);
  const filas = hoja.getRange(2, 1, ultima - 1, COL_ESTADO).getValues();
  let borradas = 0;
  for (let i = filas.length - 1; i >= 0; i--) {
    const fecha = filas[i][0];
    const estado = filas[i][COL_ESTADO - 1];
    if (estado !== EN_CURSO && fecha instanceof Date && fecha < limite) {
      hoja.deleteRow(i + 2);
      borradas++;
    }
  }
  console.log('Filas borradas por plazo: ' + borradas);
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
