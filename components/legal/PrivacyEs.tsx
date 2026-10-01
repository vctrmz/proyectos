import ConsentState from '@/components/ConsentState';

export default function PrivacyEs() {
  return (
    <div className="legal">
      <main id="contenido">
        <p className="kicker"><span>Legal</span></p>
        <h1>Privacidad y cookies</h1>
        <p className="updated">Última actualización: 2 de octubre de 2026</p>
        <p className="lead">Esta web es mi portafolio. Recojo datos por dos motivos: entender cómo se navega para mejorarla, y poder responder si me escribes. Aquí tienes qué recojo, con qué herramientas, y cómo cambiar de opinión cuando quieras.</p>

        <section id="responsable">
          <h2>Quién es el <b>responsable</b></h2>
          <p><strong>Víctor Maza</strong>, Product Designer. Málaga, España.<br />Correo para cualquier cuestión sobre tus datos: <a href="mailto:vctrmz47@gmail.com">vctrmz47@gmail.com</a>.</p>
        </section>

        <section id="datos">
          <h2>Qué datos se recogen y <b>para qué</b></h2>
          <p>Nada de lo que sigue se activa hasta que aceptas el aviso de cookies, salvo dos cosas: lo estrictamente técnico del alojamiento y la medición de rendimiento, que es anónima y no usa cookies. Si lo rechazas, no se carga ni una sola petición a Google, Microsoft, Hotjar ni HubSpot.</p>
          <div className="tools">
            <div className="tool">
              <span className="who">Alojamiento · Vercel Inc.</span>
              <h3>Servir la web</h3>
              <p>El servidor registra la dirección IP, el navegador y la página solicitada en registros técnicos de seguridad y rendimiento. Es necesario para que la web funcione y se basa en mi interés legítimo en mantenerla operativa y protegida.</p>
            </div>
            <div className="tool">
              <span className="who">Rendimiento · Vercel Inc.</span>
              <h3>Vercel Speed Insights</h3>
              <p>Mide lo rápido que se carga y responde cada página en dispositivos reales: cuánto tarda en aparecer el contenido, cuánto se mueve la maquetación y cuánto tarda en reaccionar a un toque. No usa cookies, no guarda nada en tu navegador, no crea ningún identificador y los datos van a mi propio dominio, no a un tercero. Como no puede identificar a nadie, funciona sin consentimiento: se basa en mi interés legítimo en que la web no vaya lenta, y por eso también mide las visitas que rechazan la analítica. Los informes son agregados por página, nunca por persona.</p>
            </div>
            <div className="tool">
              <span className="who">Analítica · Google Ireland Ltd.</span>
              <h3>Google Analytics 4</h3>
              <p>Cuenta visitas, de dónde vienen, qué páginas se ven y desde qué dispositivo. La IP se trunca antes de almacenarse. Solo se activa con tu consentimiento.</p>
            </div>
            <div className="tool">
              <span className="who">Comportamiento · Microsoft Ireland Operations Ltd.</span>
              <h3>Microsoft Clarity</h3>
              <p>Genera mapas de calor y grabaciones anónimas de la navegación: dónde se hace clic, hasta dónde se baja, qué se ignora. Lo que se teclea en cualquier campo se enmascara antes de enviarse. Solo se activa con tu consentimiento.</p>
            </div>
            <div className="tool">
              <span className="who">Comportamiento · Hotjar Ltd. (Malta, UE)</span>
              <h3>Hotjar</h3>
              <p>Como Clarity: mapas de calor y grabaciones anónimas de la navegación para ver qué funciona y qué no. Enmascara por defecto lo que se teclea en los campos. Solo se activa con tu consentimiento.</p>
            </div>
            <div className="tool">
              <span className="who">Contacto · HubSpot Inc. (centro de datos en la UE)</span>
              <h3>HubSpot</h3>
              <p>Si me escribes o rellenas un formulario, guarda tus datos de contacto y el recorrido que hiciste por la web para que pueda responderte con contexto. Sin escribirme, solo ve visitas anónimas. Solo se activa con tu consentimiento.</p>
            </div>
            <div className="tool">
              <span className="who">Formulario · Resend Inc. y Google Ireland Ltd.</span>
              <h3>Si me escribes por el formulario</h3>
              <p>Recojo tu nombre, tu correo y tu mensaje, y sólo para responderte. El envío lo hace <strong>Resend</strong>, que actúa como encargado del tratamiento: el mensaje viaja por su servidor hasta mi bandeja de Gmail. Además guardo una copia —nombre, correo, mensaje, idioma de la página y fecha— en una <strong>hoja de cálculo privada de Google</strong>, en mi cuenta, para llevar a quién he respondido; nadie más tiene acceso. Esta web no tiene base de datos propia. La base legal es tu consentimiento al marcar la casilla, y después el interés legítimo en atender tu consulta.</p>
            </div>
            <div className="tool">
              <span className="who">Formulario · Vercel Inc.</span>
              <h3>Comprobar que escribe una persona</h3>
              <p>Al enviar el formulario, tu navegador resuelve una comprobación invisible de <strong>Vercel BotID</strong> que distingue a una persona de un programa que manda spam, a partir de señales técnicas del navegador. No te pide nada ni te enseña ningún reto, solo se hace al enviar y no la uso para medir nada. Se basa en mi interés legítimo en proteger el formulario del spam.</p>
            </div>
            <div className="tool">
              <span className="who">Correo electrónico</span>
              <h3>Si me escribes directamente</h3>
              <p>Uso tu nombre, tu correo y lo que me cuentes exclusivamente para responderte y, si procede, para la relación profesional que surja. La base es el interés legítimo en atender tu mensaje y, después, la ejecución de lo que acordemos.</p>
            </div>
          </div>
        </section>

        <section id="cookies">
          <h2>Qué <b>cookies</b> se usan</h2>
          <p>Todas son de terceros salvo la primera, que solo guarda tu decisión. Las duraciones son las que declara cada proveedor y pueden variar; enlazo sus políticas más abajo.</p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nombre</th><th>Proveedor</th><th>Para qué</th><th>Dura</th></tr></thead>
              <tbody>
                <tr><td><code>vm-consent</code></td><td>Esta web</td><td>Recordar si aceptaste o rechazaste, y cuándo. Es almacenamiento local, no una cookie; es técnico y no requiere consentimiento. Al caducar te vuelvo a preguntar.</td><td>12 meses</td></tr>
                <tr><td>Comprobación de BotID</td><td>Vercel</td><td>Al enviar el formulario, comprobar que lo envía una persona. No guarda nada en tu navegador: lee señales técnicas en ese momento. Es de seguridad para un servicio que tú pides y no requiere consentimiento.</td><td>No se guarda</td></tr>
                <tr><td><code>_ga</code>, <code>_ga_*</code></td><td>Google Analytics</td><td>Distinguir visitantes y sesiones.</td><td>2 años</td></tr>
                <tr><td><code>_clck</code></td><td>Microsoft Clarity</td><td>Identificador anónimo de visitante.</td><td>1 año</td></tr>
                <tr><td><code>_clsk</code></td><td>Microsoft Clarity</td><td>Unir las páginas de una misma sesión.</td><td>1 día</td></tr>
                <tr><td><code>CLID</code>, <code>MUID</code></td><td>Microsoft</td><td>Identificador del visitante en el dominio de Clarity.</td><td>1 año</td></tr>
                <tr><td><code>_hjSessionUser_*</code></td><td>Hotjar</td><td>Identificador anónimo de visitante.</td><td>1 año</td></tr>
                <tr><td><code>_hjSession_*</code></td><td>Hotjar</td><td>Unir las páginas de una misma sesión.</td><td>30 min</td></tr>
                <tr><td><code>hubspotutk</code>, <code>__hstc</code></td><td>HubSpot</td><td>Reconocer al visitante entre visitas.</td><td>6 meses</td></tr>
                <tr><td><code>__hssc</code>, <code>__hssrc</code></td><td>HubSpot</td><td>Contar la sesión actual.</td><td>30 min / sesión</td></tr>
              </tbody>
            </table>
          </div>

          <ConsentState />
          <p style={{ marginTop: 14, fontSize: 13 }}>También puedes borrar las cookies desde tu navegador. Si retiras el consentimiento, dejo de recoger datos desde ese momento; lo ya recogido de forma anónima no puede vincularse contigo para eliminarlo.</p>
        </section>

        <section id="terceros">
          <h2>Con quién se <b>comparten</b></h2>
          <p>Con nadie más que los proveedores citados, que actúan como encargados del tratamiento. Google y Microsoft pueden procesar datos en Estados Unidos: ambos están adheridos al <strong>Marco de Privacidad de Datos UE-EE. UU.</strong> y aplican cláusulas contractuales tipo. Hotjar es una empresa europea y aloja los datos en la UE. HubSpot está configurado para usar su centro de datos europeo. Vercel aplica cláusulas contractuales tipo. Resend, que envía los mensajes del formulario, está adherida al Marco de Privacidad de Datos UE-EE. UU. y su contrato de encargo incluye cláusulas contractuales tipo.</p>
          <ul>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Política de privacidad de Google ↗</a></li>
            <li><a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener">Declaración de privacidad de Microsoft ↗</a></li>
            <li><a href="https://www.hotjar.com/legal/policies/privacy/" target="_blank" rel="noopener">Política de privacidad de Hotjar ↗</a></li>
            <li><a href="https://legal.hubspot.com/privacy-policy" target="_blank" rel="noopener">Política de privacidad de HubSpot ↗</a></li>
            <li><a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener">Política de privacidad de Resend ↗</a></li>
            <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Política de privacidad de Vercel ↗</a></li>
          </ul>
        </section>

        <section id="conservacion">
          <h2>Cuánto tiempo se <b>guardan</b></h2>
          <ul>
            <li><strong>Google Analytics:</strong> los datos de eventos, 2 meses; los informes agregados no identifican a nadie.</li>
            <li><strong>Microsoft Clarity:</strong> las grabaciones, 30 días; los mapas de calor agregados, hasta 13 meses.</li>
            <li><strong>Hotjar:</strong> grabaciones y mapas de calor, hasta 365 días.</li>
            <li><strong>HubSpot:</strong> como máximo 12 meses desde que me escribes, salvo que haya un proceso de selección o una relación profesional en curso; entonces, mientras dure.</li>
            <li><strong>Formulario, correo y hoja de contactos:</strong> como máximo 12 meses desde que me escribes, salvo que haya un proceso de selección o una relación profesional en curso; entonces, mientras dure y, al terminar, solo el tiempo que obligue la ley. La hoja borra sola las filas que cumplen el plazo. Resend conserva el registro de envío según su propia política.</li>
            <li>En cualquier caso, puedes pedirme que lo borre antes, cuando quieras.</li>
          </ul>
        </section>

        <section id="derechos">
          <h2>Tus <b>derechos</b></h2>
          <p>Puedes pedirme acceso a tus datos, corregirlos, borrarlos, limitar u oponerte a su uso, y llevártelos a otro sitio. Escríbeme a <a href="mailto:vctrmz47@gmail.com">vctrmz47@gmail.com</a> y te respondo en el plazo legal de un mes. Si crees que no lo he hecho bien, puedes reclamar ante la <a href="https://www.aepd.es" target="_blank" rel="noopener">Agencia Española de Protección de Datos ↗</a>.</p>
          <p>Ten en cuenta que los datos de analítica son anónimos: no puedo saber cuáles son tuyos, y por tanto no puedo extraerlos ni borrarlos de forma individual. Sí puedo borrar todo lo que tenga tuyo en HubSpot, en el correo o en la hoja de contactos.</p>
        </section>

        <section id="cambios">
          <h2><b>Cambios</b> en esta política</h2>
          <p>Si añado o quito herramientas, actualizo esta página y la fecha de arriba. Si el cambio afecta a qué datos recojo, volveré a pedirte consentimiento.</p>
        </section>
      </main>

    </div>
  );
}
