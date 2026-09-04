/* Starfield Button — port a web component en JS plano.
   Reposo: una luz recorre el borde. Hover: la cara se llena de una retícula de
   píxeles que parpadean, más un halo interior.
   Atributos: label href accent fill text-color border-color rounded padding
              font-size light-size light-thickness light-count speed direction
              pixel-size pixel-density pixel-brightness glow-size glow-opacity */
(function () {
  const MAX_BAND = 30;
  const SECONDS_AT_SPEED_1 = 10;

  /* Semilla determinista: Math.random re-tiraría la ciudad en cada repintado. */
  const rnd = (i, salt) => {
    const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const parseColor = (input) => {
    if (!input) return { r: 255, g: 255, b: 255 };
    let c = String(input).trim();
    if (c[0] === '#') {
      let h = c.slice(1);
      if (h.length === 3) h = h.split('').map(ch => ch + ch).join('');
      if (h.length === 8) h = h.slice(0, 6);
      if (h.length !== 6) return { r: 255, g: 255, b: 255 };
      const n = parseInt(h, 16);
      if (Number.isNaN(n)) return { r: 255, g: 255, b: 255 };
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    const fn = c.match(/rgba?\(([^)]+)\)/i);
    if (fn) {
      const p = fn[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      if (p.length >= 3) return { r: p[0], g: p[1], b: p[2] };
    }
    return { r: 255, g: 255, b: 255 };
  };
  const rgba = (c, a) => `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${a})`;

  /* Redondeo como porcentaje del radio máximo: 100 es píldora real a cualquier
     tamaño. Un porcentaje CSS resuelve por eje y daría una elipse. */
  const radiusFromPercent = (w, h, pct) =>
    (Math.min(w, h) / 2) * (Math.max(0, Math.min(100, pct)) / 100);

  /* Punto a la fracción t del perímetro de un rect redondeado, medido por
     LONGITUD DE ARCO: velocidad constante y siempre sobre el borde. Interpolar
     posiciones de gradiente cortaría en diagonal por las esquinas. */
  const pointOnRoundRect = (t, w, h, r) => {
    const rr = Math.max(0, Math.min(r, w / 2, h / 2));
    const sx = Math.max(0, w - 2 * rr);
    const sy = Math.max(0, h - 2 * rr);
    const arc = (Math.PI / 2) * rr;
    const total = 2 * sx + 2 * sy + 4 * arc;
    if (total <= 0) return { x: w / 2, y: h / 2 };
    let d = (((t % 1) + 1) % 1) * total + sx / 2;
    d %= total;
    if (d < sx) return { x: rr + d, y: 0 };
    d -= sx;
    if (d < arc) { const a = d / rr; return { x: w - rr + rr * Math.sin(a), y: rr - rr * Math.cos(a) }; }
    d -= arc;
    if (d < sy) return { x: w, y: rr + d };
    d -= sy;
    if (d < arc) { const a = d / rr; return { x: w - rr + rr * Math.cos(a), y: h - rr + rr * Math.sin(a) }; }
    d -= arc;
    if (d < sx) return { x: w - rr - d, y: h };
    d -= sx;
    if (d < arc) { const a = d / rr; return { x: rr - rr * Math.sin(a), y: h - rr + rr * Math.cos(a) }; }
    d -= arc;
    if (d < sy) return { x: 0, y: h - rr - d };
    d -= sy;
    const a = d / rr;
    return { x: rr - rr * Math.cos(a), y: rr - rr * Math.sin(a) };
  };

  /* La banda: caja redondeada completa menos la caja de contenido, compuesta
     con exclude. La luz vive dentro, así que va SOBRE el trazo y en ningún
     otro sitio: no desborda fuera ni lava la cara. */
  const bandMask = (el) => {
    el.style.maskImage = 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)';
    el.style.maskClip = 'border-box, content-box';
    el.style.maskComposite = 'exclude';
    el.style.webkitMaskImage = 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)';
    el.style.webkitMaskClip = 'border-box, content-box';
    el.style.webkitMaskComposite = 'xor';
  };

  class StarfieldButton extends HTMLElement {
    static get observedAttributes() {
      return ['label', 'href', 'accent', 'fill', 'text-color', 'border-color', 'rounded',
        'padding', 'font-size', 'light-size', 'light-thickness', 'light-count', 'speed',
        'direction', 'pixel-size', 'pixel-density', 'pixel-brightness', 'glow-size', 'glow-opacity'];
    }

    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.display = 'inline-grid';
      this.style.placeItems = 'stretch';
      this.style.position = 'relative';
      this._build();
      this._read();
      this._apply();
      this._loop();
    }

    attributeChangedCallback() {
      if (!this._built) return;
      this._read();
      this._apply();
    }

    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
    }

    _num(name, dflt) {
      const alt = name.replace(/-/g, '');
      const raw = this.getAttribute(name);
      const v = parseFloat(raw !== null ? raw : this.getAttribute(alt));
      return isFinite(v) ? v : dflt;
    }
    _str(name, dflt) {
      const alt = name.replace(/-/g, '');
      const v = this.getAttribute(name);
      return v !== null ? v : (this.getAttribute(alt) !== null ? this.getAttribute(alt) : dflt);
    }

    _read() {
      const accent = this._str('accent', '#f97a3d');
      this._cfg = {
        label: this._str('label', 'Escríbeme ↗'),
        href: this._str('href', ''),
        accent,
        fill: this._str('fill', 'rgba(20,20,20,0.6)'),
        textColor: this._str('text-color', '#f5f5f5'),
        borderColor: this._str('border-color', '#2a2a2a'),
        rounded: this._num('rounded', 100),
        padding: this._str('padding', '14px 26px'),
        fontSize: this._num('font-size', 14),
        bandW: Math.min(MAX_BAND, Math.max(0, this._num('border-width', 1))),
        lightPx: Math.max(4, this._num('light-size', 76)),
        lightThick: Math.max(1, Math.min(MAX_BAND, this._num('light-thickness', 2))),
        lightCount: Math.max(1, Math.min(12, Math.round(this._num('light-count', 1)))),
        turnsPerSec: Math.max(0, 2 * (this._num('speed', 50) / 50)) / SECONDS_AT_SPEED_1,
        dir: this._str('direction', 'ccw') === 'cw' ? 1 : -1,
        pixelSize: Math.max(4, this._num('pixel-size', 4)),
        pixelDensity: this._num('pixel-density', 50),
        pixelBright: this._num('pixel-brightness', 100),
        glowSize: Math.max(1, this._num('glow-size', 16)),
        glowAlpha: Math.max(0, Math.min(100, this._num('glow-opacity', 100))) / 100
      };
    }

    _build() {
      const tag = this.getAttribute('href') ? 'a' : 'button';
      const btn = document.createElement(tag);
      if (tag === 'a') {
        btn.href = this.getAttribute('href');
        if (this.hasAttribute('new-tab')) { btn.target = '_blank'; btn.rel = 'noopener noreferrer'; }
      } else btn.type = 'button';
      Object.assign(btn.style, {
        boxSizing: 'border-box', position: 'relative', border: 'none',
        background: 'transparent', cursor: 'pointer', userSelect: 'none',
        textDecoration: 'none', overflow: 'visible', font: 'inherit', padding: '0'
      });

      /* Borde: el trazo, recortado exactamente a la banda. */
      const track = document.createElement('div');
      Object.assign(track.style, { position: 'absolute', inset: '0', boxSizing: 'border-box', zIndex: '0', pointerEvents: 'none' });
      bandMask(track);

      /* Anillo de luz: propio, centrado en la línea media del borde, para que
         Grosor y Ancho de borde no sean la misma decisión. */
      const ring = document.createElement('div');
      Object.assign(ring.style, { position: 'absolute', boxSizing: 'border-box', zIndex: '0', pointerEvents: 'none' });
      bandMask(ring);

      const face = document.createElement('span');
      Object.assign(face.style, {
        position: 'relative', zIndex: '1', boxSizing: 'border-box',
        width: '100%', height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', whiteSpace: 'nowrap', overflow: 'hidden'
      });

      const canvas = document.createElement('canvas');
      Object.assign(canvas.style, { position: 'absolute', inset: '0', zIndex: '0', width: '100%', height: '100%', pointerEvents: 'none' });

      /* Halo interior: capa desenfocada, o sea compuesta, así que lleva su
         propia máscara en vez de fiarse del overflow redondeado de la cara. */
      const glow = document.createElement('span');
      Object.assign(glow.style, {
        position: 'absolute', inset: '0', zIndex: '1', opacity: '0', pointerEvents: 'none',
        maskImage: 'linear-gradient(#000 0 0)', maskClip: 'border-box',
        webkitMaskImage: 'linear-gradient(#000 0 0)', webkitMaskClip: 'border-box'
      });

      const text = document.createElement('span');
      Object.assign(text.style, { position: 'relative', zIndex: '2' });

      face.append(canvas, glow, text);
      btn.append(track, ring, face);
      this.append(btn);
      this._el = { btn, track, ring, face, canvas, glow, text, lights: [] };

      this._reveal = 0;
      this._target = 0;
      this._geom = { w: 0, h: 0, radius: 0 };
      this._size = { w: 1, h: 1, dpr: 1 };
      this._city = { cols: 0, rows: 0, dens: -1, cells: [] };

      btn.addEventListener('pointerenter', () => { this._target = 1; });
      btn.addEventListener('pointerleave', () => { this._target = 0; });

      this._ro = new ResizeObserver(() => { this._measure(); this._sizeCanvas(); });
      this._ro.observe(btn);
    }

    _apply() {
      const c = this._cfg, e = this._el;
      e.btn.style.padding = c.bandW + 'px';
      e.track.style.padding = c.bandW + 'px';
      e.track.style.background = c.borderColor;
      const inset = c.bandW / 2 - c.lightThick / 2;
      this._ringInset = inset;
      Object.assign(e.ring.style, { top: inset + 'px', right: inset + 'px', bottom: inset + 'px', left: inset + 'px', padding: c.lightThick + 'px' });
      e.face.style.background = c.fill;
      e.face.style.padding = c.padding;
      e.text.style.color = c.textColor;
      e.text.style.fontSize = c.fontSize + 'px';
      e.text.textContent = c.label;
      const rim = Math.max(1, Math.round(c.glowSize * 0.18));
      e.glow.style.border = rim + 'px solid ' + c.accent;
      e.glow.style.filter = 'blur(' + Math.max(1, Math.round(c.glowSize * 0.5)) + 'px)';

      while (e.lights.length > c.lightCount) e.ring.removeChild(e.lights.pop());
      const rgb = parseColor(c.accent);
      while (e.lights.length < c.lightCount) {
        const d = document.createElement('div');
        d.style.position = 'absolute';
        d.style.top = '0';
        d.style.left = '0';
        d.style.pointerEvents = 'none';
        e.ring.appendChild(d);
        e.lights.push(d);
      }
      e.lights.forEach(d => {
        d.style.width = c.lightPx + 'px';
        d.style.height = c.lightPx + 'px';
        d.style.marginTop = (-c.lightPx / 2) + 'px';
        d.style.marginLeft = (-c.lightPx / 2) + 'px';
        /* Un disco del que la máscara conserva solo la porción sobre la banda:
           Tamaño se lee como LARGO de la luz a lo largo del trazo. */
        d.style.background = `radial-gradient(circle, ${c.accent} 0%, ${c.accent} 30%, ${rgba(rgb, 0)} 72%)`;
      });
      this._city.dens = -1;
      this._measure();
      this._sizeCanvas();
    }

    _measure() {
      const c = this._cfg, e = this._el;
      const w = e.btn.offsetWidth, h = e.btn.offsetHeight;
      if (!w || !h) return;
      const radius = radiusFromPercent(w, h, c.rounded);
      this._geom = { w, h, radius };
      e.btn.style.borderRadius = radius + 'px';
      e.track.style.borderRadius = radius + 'px';
      e.ring.style.borderRadius = Math.max(0, radius - this._ringInset) + 'px';
      const innerRadius = Math.max(0, radius - c.bandW) + 'px';
      e.face.style.borderRadius = innerRadius;
      e.glow.style.borderRadius = innerRadius;
    }

    _sizeCanvas() {
      const f = this._el.face, cv = this._el.canvas;
      const w = f.clientWidth, h = f.clientHeight;
      if (w <= 0 || h <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this._size = { w, h, dpr };
      cv.width = Math.max(1, Math.floor(w * dpr));
      cv.height = Math.max(1, Math.floor(h * dpr));
    }

    _buildCity(w, h, cell) {
      const c = Math.max(4, Math.round(cell));
      const cols = Math.max(1, Math.floor(w / c));
      const rows = Math.max(1, Math.floor(h / c));
      const dens = Math.max(0, Math.min(1, this._cfg.pixelDensity / 100));
      const st = this._city;
      if (cols === st.cols && rows === st.rows && dens === st.dens && st.cells.length) return;
      const offX = (w - cols * c) / 2, offY = (h - rows * c) / 2;
      const cells = [];
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const i = r * cols + col;
          const lit = rnd(i, 1) < dens;
          cells.push({
            cx: offX + col * c + c / 2,
            cy: offY + r * c + c / 2,
            base: lit ? 0.5 + rnd(i, 2) * 0.5 : 0.05 + rnd(i, 3) * 0.18,
            speed: 0.6 + rnd(i, 4) * 2.4,
            phase: rnd(i, 5) * Math.PI * 2
          });
        }
      }
      this._city = { cols, rows, dens, cells };
    }

    _draw(ctx, t) {
      const { w, h, dpr } = this._size;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const rv = this._reveal;
      if (rv < 0.001) return;
      const c = this._cfg;
      const mul = Math.max(0, c.pixelBright) / 100;
      this._buildCity(w, h, c.pixelSize);
      const cell = Math.max(4, Math.round(c.pixelSize));
      const dot = Math.max(1, Math.round(cell * 0.62));
      const off = dot / 2;
      const cx = w / 2, cy = h / 2;
      const maxD = Math.hypot(cx, cy) || 1;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = c.accent;
      const cells = this._city.cells;
      for (let k = 0; k < cells.length; k++) {
        const p = cells[k];
        const tw = 0.55 + 0.45 * Math.sin(t * p.speed + p.phase);
        const d = Math.hypot(p.cx - cx, p.cy - cy) / maxD;
        let a = p.base * tw * (0.55 + 0.45 * (1 - d)) * rv * mul;
        if (a <= 0.002) continue;
        if (a > 1) a = 1;
        ctx.globalAlpha = a;
        ctx.fillRect(p.cx - off, p.cy - off, dot, dot);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    /* Solo transform: N luces cuestan lo mismo que una y nada repinta. */
    _placeLights(t) {
      const { w, h, radius } = this._geom;
      if (!w || !h) return;
      const c = this._cfg;
      const half = c.bandW / 2;
      const pw = Math.max(0, w - c.bandW), ph = Math.max(0, h - c.bandW);
      const pr = Math.max(0, radius - half);
      const base = t * c.turnsPerSec * c.dir;
      for (let i = 0; i < this._el.lights.length; i++) {
        const el = this._el.lights[i];
        let f = base + i / c.lightCount;
        f = ((f % 1) + 1) % 1;
        const p = pointOnRoundRect(f, pw, ph, pr);
        el.style.transform = `translate3d(${p.x + half - this._ringInset}px, ${p.y + half - this._ringInset}px, 0)`;
      }
    }

    _loop() {
      const ctx = this._el.canvas.getContext('2d');
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tick = () => {
        this._raf = requestAnimationFrame(tick);
        const t = performance.now() / 1000;
        this._reveal += (this._target - this._reveal) * (reduce ? 1 : 0.12);
        this._el.glow.style.opacity = String(this._reveal * this._cfg.glowAlpha);
        this._placeLights(reduce ? 0 : t);
        if (ctx) this._draw(ctx, t);
      };
      this._raf = requestAnimationFrame(tick);
    }
  }

  if (!customElements.get('starfield-button')) {
    customElements.define('starfield-button', StarfieldButton);
  }
})();
