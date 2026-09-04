/*
 * Banner de consentimiento y arranque condicional de Microsoft Clarity.
 *
 * Clarity graba sesiones y usa cookies, así que no se inicializa hasta que el
 * visitante acepta. La decisión se guarda en localStorage; si la rechaza no se
 * carga nada de clarity.ms.
 */
(function () {
  var KEY = 'vm-consent';
  var PROJECT = 'yd4g6685po';
  var PKG = 'https://cdn.jsdelivr.net/npm/@microsoft/clarity@1.0.2/index.js';

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function startClarity() {
    import(PKG).then(function (m) { m.default.init(PROJECT); }).catch(function () {});
  }

  // Permite reabrir el banner desde la consola o un enlace de "gestionar cookies".
  window.vmConsentReset = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  var decision = read();
  if (decision === 'granted') { startClarity(); return; }
  if (decision === 'denied') { return; }

  function build() {
    var wrap = document.createElement('div');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Consentimiento de analítica');
    wrap.style.cssText = [
      'position:fixed', 'left:16px', 'right:16px', 'bottom:16px', 'z-index:99999',
      'max-width:620px', 'margin:0 auto', 'display:flex', 'flex-wrap:wrap',
      'align-items:center', 'gap:14px', 'padding:16px 18px',
      'background:rgba(27,30,39,0.94)', '-webkit-backdrop-filter:blur(10px)',
      'backdrop-filter:blur(10px)', 'border:1px solid #343a4a', 'border-radius:16px',
      'box-shadow:0 12px 40px rgba(0,0,0,0.45)',
      'font-family:Montserrat,system-ui,sans-serif', 'opacity:0',
      'transform:translateY(12px)', 'transition:opacity .35s ease,transform .35s ease'
    ].join(';');

    var text = document.createElement('p');
    text.style.cssText = 'margin:0;flex:1 1 260px;font-size:13px;line-height:1.5;color:#b4b4b4';
    text.textContent = 'Uso Microsoft Clarity para ver cómo se navega esta web: mapas de calor y grabación de sesión. Solo se activa si lo aceptas.';

    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;flex:0 0 auto';

    function button(label, primary) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = [
        'font-family:inherit', 'font-size:13px', 'font-weight:600', 'cursor:pointer',
        'padding:10px 18px', 'border-radius:999px', 'transition:filter .2s ease,border-color .2s ease',
        primary
          ? 'border:1px solid #8bde5f;background:#8bde5f;color:#12151c'
          : 'border:1px solid #343a4a;background:transparent;color:#ececec'
      ].join(';');
      b.addEventListener('mouseenter', function () {
        b.style.filter = primary ? 'brightness(1.08)' : '';
        if (!primary) b.style.borderColor = '#8bde5f';
      });
      b.addEventListener('mouseleave', function () {
        b.style.filter = '';
        if (!primary) b.style.borderColor = '#343a4a';
      });
      return b;
    }

    var accept = button('Aceptar', true);
    var reject = button('Rechazar', false);

    function close() {
      wrap.style.opacity = '0';
      wrap.style.transform = 'translateY(12px)';
      setTimeout(function () { wrap.remove(); }, 350);
    }
    accept.addEventListener('click', function () { write('granted'); startClarity(); close(); });
    reject.addEventListener('click', function () { write('denied'); close(); });

    actions.appendChild(reject);
    actions.appendChild(accept);
    wrap.appendChild(text);
    wrap.appendChild(actions);
    document.body.appendChild(wrap);
    requestAnimationFrame(function () {
      wrap.style.opacity = '1';
      wrap.style.transform = 'translateY(0)';
    });
  }

  // La portada arranca con una animación de carga que marca sessionStorage
  // 'vm-loader' al terminar. Esperamos a que acabe para no solaparnos con ella,
  // con un tope por si esa pantalla no llega a mostrarse (p. ej. en perfil.html).
  //
  // El tope se mide con reloj de pared, no sumando los retardos pedidos: con las
  // animaciones en marcha el hilo principal va tan cargado que un setTimeout de
  // 250 ms tarda segundos en disparar, y contar los retardos previstos dejaba el
  // banner sin aparecer nunca.
  function schedule() {
    var t0 = Date.now();
    var MAX = 6000;
    (function poll() {
      var done = false;
      try { done = sessionStorage.getItem('vm-loader') === '1'; } catch (e) { done = true; }
      if (done || Date.now() - t0 >= MAX) { setTimeout(build, 400); return; }
      setTimeout(poll, 250);
    })();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();
