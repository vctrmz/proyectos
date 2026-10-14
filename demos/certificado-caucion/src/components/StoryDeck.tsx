import { useCallback, useEffect, useState, type ReactNode } from 'react';

/* Presentación del caso en la misma URL que el prototipo: se cuenta el
   proceso y se salta a la demo sin cambiar de pestaña. ← → o espacio para
   avanzar. El guion para quien presenta está en PRESENTACION.md. */

interface Slide {
  id: string;
  phase: string;
  render: (openDemo: () => void) => ReactNode;
}

const Tick = ({ children }: { children: ReactNode }) => (
  <li>
    <i className="ri-check-line" aria-hidden="true" /> <span>{children}</span>
  </li>
);

const SLIDES: Slide[] = [
  {
    id: 'cover',
    phase: 'HERMES · Caución · APRD-513',
    render: () => (
      <div className="slide slide--cover">
        <h1>
          Certificados de caución editables
          <br />
          <span>sin tocar lo que firma Legal</span>
        </h1>
        <p className="lead">
          Del ticket al paso CERTIFICADO: research desk, benchmark, reuniones con front, PO y back, y un editor elegido por cómo encaja en el diseño.
        </p>
        <dl className="meta">
          <div><dt>Plataforma</dt><dd>HERMES, SaaS asegurador multi-tenant</dd></div>
          <div><dt>Producto</dt><dd>Seguro de caución</dd></div>
          <div><dt>Mi rol</dt><dd>Product Designer: research, diseño e implementación revisada en React</dd></div>
          <div><dt>Stack</dt><dd>React · TypeScript · TipTap (ProseMirror)</dd></div>
        </dl>
      </div>
    ),
  },
  {
    id: 'brief',
    phase: '01 · Definir',
    render: () => (
      <div className="slide">
        <h2>El encargo</h2>
        <blockquote className="quote">
          «Crear un nuevo paso llamado CERTIFICADO dentro del flujo de creación de certificados, orientado a la selección,
          visualización y edición de distintos modelos, con soporte multilingüe.»
          <cite>Ticket APRD-513</cite>
        </blockquote>
        <div className="grid grid--4">
          <article className="card"><strong>ES / EN</strong><p>Selector de idioma del certificado.</p></article>
          <article className="card"><strong>4 plantillas</strong><p>Abogacía del Estado, Privado, Almacenamiento y Público con fecha (tasas aeroportuarias).</p></article>
          <article className="card"><strong>Fijo</strong><p>Cabecera, logotipo y pie no se editan.</p></article>
          <article className="card"><strong>Editable</strong><p>El cuerpo, con formato básico e inserción de variables.</p></article>
        </div>
        <p className="tension">
          <span>Flexibilidad para quien escribe</span>
          <i className="ri-arrow-left-right-line" aria-hidden="true" />
          <span>Control sobre lo que obliga a la aseguradora</span>
        </p>
      </div>
    ),
  },
  {
    id: 'process',
    phase: '02 · Investigar con el equipo',
    render: () => (
      <div className="slide">
        <h2>Cuando no sé por dónde empezar, pido ayuda</h2>
        <p className="lead">Nunca había diseñado un sistema de creación de documentos en HERMES. El camino fue de fuera hacia dentro: primero qué hacen otros, después el equipo.</p>
        <ol className="timeline">
          <li><strong>Research desk</strong><p>Benchmark de otros productos y herramientas de design thinking para ordenar lo encontrado.</p></li>
          <li><strong>Front lead</strong><p>Le explico la idea que sale de la investigación.</p></li>
          <li><strong>PO</strong><p>Contraste con negocio: qué necesita el paso y para quién.</p></li>
          <li><strong>2–3 días después, juntos</strong><p>El front lead trae un par de aplicaciones. Coincidimos en dos.</p></li>
          <li><strong>Backend</strong><p>No sabíamos cómo encajaba con la base de datos: un par de horas de investigación y reunión con back. Las dos funcionaban.</p></li>
          <li><strong>Decisión de diseño</strong><p>Me tocó elegir cuál se adaptaba mejor al diseño: TipTap.</p></li>
        </ol>
      </div>
    ),
  },
  {
    id: 'anatomy',
    phase: '03 · Idear',
    render: () => (
      <div className="slide slide--split">
        <div>
          <h2>Anatomía del certificado</h2>
          <p className="lead">
            Antes de dibujar pantallas, partimos los cuatro modelos en regiones. Todos comparten cuatro fijas; solo cambia el cuerpo.
          </p>
          <ul className="ticks">
            <Tick>Lo fijo no está dentro del editor: no hay permiso que saltarse.</Tick>
            <Tick>El cuerpo es la única región que llega al editor y al <code>document_model</code>.</Tick>
            <Tick>Las variables viven también en lo fijo (nº de certificado, fecha), pero ahí solo se resuelven.</Tick>
          </ul>
        </div>
        <div className="mini-a4" aria-label="Diagrama de regiones del A4">
          <span data-fixed>Cabecera · nº de certificado</span>
          <span data-fixed>Apoderamiento de la aseguradora</span>
          <span data-edit>Cuerpo editable · variables</span>
          <span data-fixed>Firma · lugar y fecha</span>
          <span data-fixed data-band>Pie y logotipo del tenant</span>
        </div>
      </div>
    ),
  },
  {
    id: 'tool',
    phase: '04 · Elegir el editor',
    render: () => (
      <div className="slide slide--split">
        <div>
          <h2>Dos finalistas, las dos viables</h2>
          <p className="lead">
            Backend confirmó que cualquiera de las dos encajaba con el modelo de datos. Así que la pregunta dejó de ser técnica:
            ¿cuál se adapta mejor al diseño?
          </p>
          <p className="punch">El equipo puso el filtro técnico. La última decisión fue de diseño.</p>
        </div>
        <ul className="criteria" aria-label="Por qué TipTap">
          <li><strong>Headless</strong><span>Sin UI impuesta: toolbar, menús y chips salen del design system de HERMES.</span></li>
          <li><strong>Nodos propios</strong><span>Una variable es un componente atómico (<code>Node.create</code>), no texto entre llaves.</span></li>
          <li><strong>Extensiones a la carta</strong><span>Solo lo que la plantilla permite: negrita, listas, alineación. Sin color ni tipografía libres.</span></li>
          <li><strong>JSON estructurado</strong><span>El cuerpo sale como JSON, que es lo que guarda el <code>document_model</code>.</span></li>
        </ul>
      </div>
    ),
  },
  {
    id: 'decisions',
    phase: '05 · Prototipar',
    render: () => (
      <div className="slide">
        <h2>Decisiones de diseño</h2>
        <div className="grid grid--3">
          <article className="card"><i className="ri-braces-line" aria-hidden="true" /><strong>Variables atómicas</strong><p><code>{'{{ tomador.nombre }}'}</code> se mueve y se borra entera; no se puede romper escribiendo dentro.</p></article>
          <article className="card"><i className="ri-command-line" aria-hidden="true" /><strong>Dos gestos</strong><p><kbd>/</kbd> para bloques y <kbd>@</kbd> para variables. El panel lateral cubre a quien no los conoce.</p></article>
          <article className="card"><i className="ri-eye-line" aria-hidden="true" /><strong>Dos lecturas</strong><p>Etiquetas (qué dato es) o datos de la póliza (qué saldrá impreso), sobre el mismo documento.</p></article>
          <article className="card"><i className="ri-translate-2" aria-hidden="true" /><strong>Borrador por idioma</strong><p>Cada plantilla × idioma guarda el suyo: pasar a EN no pisa lo editado en ES.</p></article>
          <article className="card"><i className="ri-error-warning-line" aria-hidden="true" /><strong>Huecos visibles</strong><p>Una variable sin dato se marca en la vista previa y bloquea la emisión.</p></article>
          <article className="card"><i className="ri-font-size" aria-hidden="true" /><strong>Toolbar corta</strong><p>Sin color ni tipografía libres: el estilo lo fija la plantilla, igual que el pie.</p></article>
        </div>
      </div>
    ),
  },
  {
    id: 'handoff',
    phase: '06 · Handoff',
    render: () => (
      <div className="slide slide--split">
        <div>
          <h2>El contrato con backend</h2>
          <p className="lead">El prototipo produce el mismo <code>document_model</code> que guarda backend. Se ve en vivo desde el paso.</p>
          <ul className="ticks">
            <Tick>Solo <code>body</code> trae contenido; las regiones fijas son referencias a la plantilla.</Tick>
            <Tick><code>variables.missing</code> es la regla de negocio: si no está vacía, no se emite.</Tick>
            <Tick><code>modified</code> dice si el cuerpo se separa de la plantilla aprobada.</Tick>
          </ul>
        </div>
        <pre className="code-card"><code>{`{
  "document_model": {
    "tenant": "surety-demo",
    "product": "caucion",
    "step": "CERTIFICADO",
    "template": "publico-tasas",
    "locale": "es",
    "modified": false,
    "regions": [
      { "id": "header", "editable": false },
      { "id": "body", "editable": true,
        "content": { "type": "doc", … } },
      { "id": "footer", "editable": false }
    ],
    "variables": {
      "used": ["certificado.numero", …],
      "missing": []
    }
  }
}`}</code></pre>
      </div>
    ),
  },
  {
    id: 'validate',
    phase: '07 · Validar',
    render: () => (
      <div className="slide slide--split">
        <div>
          <h2>Criterios de aceptación, como tests</h2>
          <ul className="ticks">
            <Tick>El paso CERTIFICADO aparece en el flujo de emisión.</Tick>
            <Tick>Se puede elegir idioma y plantilla.</Tick>
            <Tick>Cabecera, logotipo y pie no son editables.</Tick>
            <Tick>Se edita el texto y se insertan variables.</Tick>
            <Tick>Funciona para el tenant y el producto Caución.</Tick>
          </ul>
          <p className="muted">Cada criterio del ticket tiene su test en <code>test/acceptance.test.tsx</code>.</p>
        </div>
        <div className="card card--measure">
          <strong>Qué mediríamos tras el despliegue</strong>
          <ul>
            <li>Certificados emitidos sin rehacer fuera del sistema.</li>
            <li>Tiempo de emisión por certificado.</li>
            <li>% de cuerpos modificados respecto a la plantilla.</li>
            <li>Incidencias que devuelve Legal.</li>
          </ul>
          <p className="muted">Sin medir todavía: no se presenta ninguna cifra que no exista.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'demo',
    phase: 'Demo',
    render: (openDemo) => (
      <div className="slide slide--cover">
        <h2 className="huge">Vamos al prototipo</h2>
        <ol className="route">
          <li>Elegir plantilla e idioma</li>
          <li>Editar el cuerpo · <kbd>/</kbd> y <kbd>@</kbd></li>
          <li>Ver datos de la póliza</li>
          <li>Vista previa con un hueco</li>
          <li>Completar y emitir</li>
        </ol>
        <button type="button" className="btn btn--primary btn--lg" onClick={openDemo}>
          Abrir prototipo <i className="ri-arrow-right-line" aria-hidden="true" />
        </button>
      </div>
    ),
  },
];

export function StoryDeck({ onOpenDemo }: { onOpenDemo: () => void }) {
  const [i, setI] = useState(0);
  const go = useCallback((d: number) => setI((n) => Math.min(SLIDES.length - 1, Math.max(0, n + d))), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, select, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') (e.preventDefault(), go(1));
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') (e.preventDefault(), go(-1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const slide = SLIDES[i];
  return (
    <div className="deck">
      <header className="deck__bar">
        <span className="deck__phase">{slide.phase}</span>
        <button type="button" className="link-btn link-btn--light" onClick={onOpenDemo}>
          Ir al prototipo <i className="ri-arrow-right-up-line" aria-hidden="true" />
        </button>
      </header>
      <main className="deck__stage" aria-live="polite" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${SLIDES.length}`} key={slide.id}>
        {slide.render(onOpenDemo)}
      </main>
      <footer className="deck__nav">
        <button type="button" className="icon-btn icon-btn--light" aria-label="Anterior" onClick={() => go(-1)} disabled={i === 0}>
          <i className="ri-arrow-left-line" aria-hidden="true" />
        </button>
        <ol className="dots" aria-label="Diapositivas">
          {SLIDES.map((s, n) => (
            <li key={s.id}>
              <button type="button" aria-label={`Ir a ${s.phase}`} aria-current={n === i || undefined} onClick={() => setI(n)} />
            </li>
          ))}
        </ol>
        <span className="deck__count">{i + 1} / {SLIDES.length}</span>
        <button type="button" className="icon-btn icon-btn--light" aria-label="Siguiente" onClick={() => go(1)} disabled={i === SLIDES.length - 1}>
          <i className="ri-arrow-right-line" aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
}
