/* Efectos de transición compartidos por la línea v3.
   Cuatro piezas, cada una activada por un atributo en el marcado:
     data-roll   la etiqueta se cambia por su gemela al pasar el cursor
     data-lines  el titular sube línea a línea desde detrás de su propia máscara
     data-words  el titular entra palabra a palabra al llegar a pantalla
     data-zoom   la imagen se acerca despacio mientras el cursor está encima
   Y una automática: cada sección con data-screen-label escalona la entrada de
   sus bloques de primer nivel. data-no-reveal la excluye.
   window.NeatFX.init(gsap, light) — light corta todo lo que cuesta caro. */
(function () {
  const FX = {};

  /* Dos copias apiladas dentro de una caja de una línea de alto: al pasar el
     cursor el par se desplaza medio bloque, así la que entra ocupa el hueco
     exacto de la que sale y el ancho del botón nunca cambia. */
  function roll(el, g) {
    const txt = (el.textContent || '').trim();
    if (!txt || el.querySelector('[data-roll-inner]')) return;
    el.textContent = '';
    const clip = document.createElement('span');
    clip.style.cssText = 'display: inline-block; overflow: hidden; vertical-align: bottom;';
    const inner = document.createElement('span');
    inner.setAttribute('data-roll-inner', '');
    inner.style.cssText = 'display: block; will-change: transform;';
    const a = document.createElement('span');
    const b = document.createElement('span');
    a.style.display = 'block';
    b.style.display = 'block';
    a.textContent = txt;
    b.textContent = txt;
    inner.append(a, b);
    clip.append(inner);
    el.append(clip);
    /* La altura se mide, no se calcula: el line-height heredado puede venir de
       cualquier sitio y una caja de alto fijo cortaría las tildes. */
    const fit = () => { clip.style.height = a.offsetHeight + 'px'; };
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    const to = (y) => g.to(inner, { yPercent: y, duration: 0.42, ease: 'power3.out', overwrite: true });
    el.addEventListener('pointerenter', () => to(-50));
    el.addEventListener('pointerleave', () => to(0));
    el.addEventListener('focus', () => to(-50));
    el.addEventListener('blur', () => to(0));
  }

  /* Máscara por línea. El padding y el margen negativo compensan los trazos
     descendentes: sin ellos, overflow hidden decapita las jotas y las ges.
     El corte acepta atributos en la etiqueta porque el runtime los añade. */
  function lines(el, g, light) {
    const parts = el.innerHTML.split(/<br\b[^>]*>/i);
    el.innerHTML = parts.map(function (p) {
      return '<span style="display: block; overflow: hidden; padding-bottom: 0.08em; margin-bottom: -0.08em;">' +
        '<span data-line-inner style="display: block; will-change: transform;">' + p + '</span></span>';
    }).join('');
    const inner = el.querySelectorAll('[data-line-inner]');
    if (light) { g.set(inner, { yPercent: 0 }); return; }
    g.from(inner, { yPercent: 112, duration: 1.1, stagger: 0.085, ease: 'power4.out', delay: 0.12 });
  }

  /* Parte solo los nodos de texto: los hijos con estilo propio (la palabra en
     Bebas, un <strong>) viajan enteros en lugar de perder su marcado. */
  function splitWords(el) {
    const out = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (!w.trim()) { out.push(document.createTextNode(w)); return; }
          const s = document.createElement('span');
          s.style.display = 'inline-block';
          s.textContent = w;
          out.push(s);
        });
      } else {
        if (n.style) n.style.display = 'inline-block';
        out.push(n);
      }
    });
    el.innerHTML = '';
    out.forEach(function (n) { el.append(n); });
    return out.filter(function (n) { return n.nodeType === 1; });
  }

  /* Dispara al entrar en pantalla con un observador propio, no con un trigger
     de scroll: un `from` con trigger escribe el estado oculto en el momento de
     crearse, así que si el trigger no llega a vivir el contenido se queda
     invisible para siempre. Aquí nada se oculta hasta que ya se puede revelar,
     y el peor caso es quedarse sin animación. */
  function onEnter(el, fn, margin) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        fn();
      });
    }, { rootMargin: margin || '0px 0px -12% 0px' });
    io.observe(el);
  }

  function words(el, g) {
    const ws = splitWords(el);
    if (!ws.length) return;
    onEnter(el, function () {
      g.fromTo(ws,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.035, ease: 'power3.out', immediateRender: false });
    });
  }

  function zoom(el, g) {
    const img = el.querySelector('img') || el;
    el.addEventListener('pointerenter', function () {
      g.to(img, { scale: 1.06, duration: 0.7, ease: 'power3.out', overwrite: true });
    });
    el.addEventListener('pointerleave', function () {
      g.to(img, { scale: 1, duration: 0.7, ease: 'power3.out', overwrite: true });
    });
  }

  /* Entrada por sección: los bloques de primer nivel del contenedor interior
     (fila de rótulo, titular, rejilla) suben escalonados una sola vez. */
  function sections(g) {
    document.querySelectorAll('[data-screen-label]').forEach(function (sec) {
      if (sec.hasAttribute('data-no-reveal')) return;
      const holder = sec.firstElementChild;
      if (!holder) return;
      const kids = Array.prototype.slice.call(holder.children).filter(function (k) {
        return !k.hasAttribute('data-no-reveal');
      });
      if (!kids.length) return;
      onEnter(sec, function () {
        g.fromTo(kids,
          { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out', immediateRender: false });
      }, '0px 0px -18% 0px');
    });
  }

  FX.init = function (g, light) {
    if (!g) return;
    document.querySelectorAll('[data-roll]').forEach(function (el) { roll(el, g); });
    document.querySelectorAll('[data-lines]').forEach(function (el) { lines(el, g, light); });
    if (light) return;
    document.querySelectorAll('[data-words]').forEach(function (el) { words(el, g); });
    document.querySelectorAll('[data-zoom]').forEach(function (el) { zoom(el, g); });
    sections(g);
  };

  window.NeatFX = FX;
})();
