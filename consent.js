/*
 * Banner de consentimiento y arranque condicional de la analitica.
 *
 * Tres servicios, los tres detras del mismo consentimiento:
 *   - Google Analytics 4: metricas de audiencia.
 *   - Microsoft Clarity: mapas de calor y grabacion de sesion.
 *   - HubSpot: seguimiento de visitas y formularios recogidos (portal EU).
 *
 * Los tres usan cookies, asi que no se cargan hasta que el visitante acepta. La
 * decision se guarda en localStorage; si la rechaza no se pide ni un solo
 * recurso a googletagmanager.com, clarity.ms ni hs-scripts.com.
 */
(function () {
  var KEY = 'vm-consent';
  var PROJECT = 'yd4g6685po';
  var PKG = 'https://cdn.jsdelivr.net/npm/@microsoft/clarity@1.0.2/index.js';
  // Portal 148496979, cuenta europea: el loader vive en js-eu1, no en js.
  var HS_PORTAL = '148496979';
  var HS_SRC = 'https://js-eu1.hs-scripts.com/' + HS_PORTAL + '.js';
  var HS_ID = 'hs-script-loader';
  var GA_ID = 'G-HZYDMMSVG5';
  var GA_SRC = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  var GA_TAG = 'ga-gtag-loader';

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  /* Clarity no arranca en local. Sin esta guarda, cada sesion de desarrollo
     entra en el proyecto como trafico real: en los ultimos 30 dias localhost
     sumaba 12 paginas vistas frente a 17 del dominio publico, asi que los
     mapas de calor estaban midiendo mis propias pruebas. */
  function isLocalHost() {
    var h = location.hostname;
    return h === '' ||
      h === 'localhost' ||
      h === '127.0.0.1' ||
      h === '::1' ||
      h === '[::1]' ||
      /\.local$/.test(h) ||
      /^127\./.test(h) ||
      /^10\./.test(h) ||
      /^192\.168\./.test(h) ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(h);
  }

  function startClarity() {
    if (isLocalHost()) { return; }
    import(PKG).then(function (m) { m.default.init(PROJECT); }).catch(function () {});
  }

  function startHubSpot() {
    if (document.getElementById(HS_ID)) { return; }
    var sc = document.createElement('script');
    sc.id = HS_ID;
    sc.type = 'text/javascript';
    sc.async = true;
    sc.defer = true;
    sc.src = HS_SRC;
    document.head.appendChild(sc);
  }

  function startGA() {
    if (document.getElementById(GA_TAG)) { return; }

    // La cola se crea antes de cargar gtag.js: lo que se encole ahora se
    // procesa en cuanto llegue. Y tiene que empujar el objeto `arguments` tal
    // cual, que es lo que gtag.js espera leer.
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);

    var sc = document.createElement('script');
    sc.id = GA_TAG;
    sc.async = true;
    sc.src = GA_SRC;
    document.head.appendChild(sc);
  }

  function startAnalytics() {
    startGA();
    startClarity();
    startHubSpot();
  }

  // Permite reabrir el banner desde la consola o un enlace de "gestionar cookies".
  window.vmConsentReset = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.reload();
  };

  var decision = read();
  if (decision === 'granted') { startAnalytics(); return; }
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
    text.textContent = 'Uso Google Analytics, Microsoft Clarity y HubSpot para ver cómo se navega esta web y para atender lo que me escribes. Usan cookies y solo se activan si lo aceptas.';

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
    accept.addEventListener('click', function () { write('granted'); startAnalytics(); close(); });
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

  // La portada abre con una pantalla de carga: un velo fijo [data-veil] que se
  // desvanece al terminar y, en ese momento, marca sessionStorage 'vm-loader'.
  // Esperamos a que acabe para no taparla.
  //
  // No sirve contar tiempo: si la pestaña esta en segundo plano el navegador
  // estrangula requestAnimationFrame, la intro se queda parada y cualquier tope
  // por reloj saltaria encima de ella. Por eso miramos el velo, y el tope de
  // tope de 60 s es solo una red de seguridad. Preferimos que en un caso raro
  // el banner tarde a que llegue a taparla: si el velo nunca se fuera, no habria
  // banner, no habria consentimiento y Clarity sencillamente no arrancaria.
  function introTerminada() {
    try { if (sessionStorage.getItem('vm-loader') === '1') return true; } catch (e) {}
    var velo = document.querySelector('[data-veil]');
    if (!velo) return false;
    var c = getComputedStyle(velo);
    return c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < 0.02;
  }

  function veloVisible() {
    var velo = document.querySelector('[data-veil]');
    if (!velo) return false;
    var c = getComputedStyle(velo);
    return c.display !== 'none' && c.visibility !== 'hidden' && parseFloat(c.opacity) > 0.02;
  }

  function schedule() {
    var t0 = Date.now();
    var MAX = 60000;
    var SIN_VELO = 2000; // margen para que la pantalla de carga llegue a montarse
    var visto = false;
    (function poll() {
      var transcurrido = Date.now() - t0;
      if (veloVisible()) { visto = true; }
      var listo = visto ? introTerminada() : (introTerminada() && transcurrido >= SIN_VELO);
      if (listo || transcurrido >= MAX) { setTimeout(build, 400); return; }
      setTimeout(poll, 200);
    })();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();
