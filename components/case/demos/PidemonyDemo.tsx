'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { Roboto } from 'next/font/google';
import s from './PidemonyDemo.module.css';

/* La demo de Pidemony: el flujo de quien pide, en la app mony, y la página
   que abre quien paga, dibujados con el UI kit del caso —Roboto, la paleta y
   las escalas de la guía—. No es código del banco: está hecha para este
   portfolio, todo vive en el estado del componente y no sale nada de aquí.

   Del kit se cambian dos cosas, y el caso lo cuenta: el gris de texto pasa de
   #7D7D7D a #6B6B6B para llegar a AA, y el stepper lleva su texto porque el
   verde solo no se ve lo bastante.

   La tarjeta de la página de pago no se puede editar a propósito: en una demo
   nadie debería escribir una tarjeta de verdad. */

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], display: 'swap' });

type Pantalla = 'inicio' | 'datos' | 'confirmar' | 'terminos' | 'enlace' | 'historial';
type Web = 'pagar' | 'pagado' | 'vencido';
type Solicitud = { nombre: string; monto: number; mensaje: string; pagada: boolean };

const MIN = 5;
const MAX = 2000;
/* Lo que se ve en la web si alguien la abre antes de pedir nada: el ejemplo
   de la propia guía. */
const EJEMPLO: Solicitud = { nombre: 'Helena', monto: 200, mensaje: 'Gasolina de la quincena', pagada: false };
const PASO: Record<Pantalla, number> = { inicio: 1, datos: 1, confirmar: 2, terminos: 3, enlace: 4, historial: 4 };

const dinero = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const leerMonto = (v: string) => Number(v.replace(/[^\d.,]/g, '').replace(',', '.'));

export default function PidemonyDemo() {
  const id = useId();
  const [vista, setVista] = useState<'app' | 'web'>('app');
  const [pantalla, setPantalla] = useState<Pantalla>('inicio');
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tocado, setTocado] = useState(false);
  const [terminos, setTerminos] = useState<'si' | 'no' | null>(null);
  const [verTerminos, setVerTerminos] = useState(false);
  const [web, setWeb] = useState<Web>('pagar');
  const [historial, setHistorial] = useState<Solicitud[]>([]);

  /* El foco va al título de cada pantalla nueva, para que quien navega con
     teclado o lector sepa dónde está. Solo tras una acción, nunca al cargar. */
  const titulo = useRef<HTMLHeadingElement | null>(null);
  const actuado = useRef(false);
  useEffect(() => { if (actuado.current) titulo.current?.focus(); }, [pantalla, vista, web]);
  const ir = (p: Pantalla) => { actuado.current = true; setPantalla(p); };

  const cantidad = leerMonto(monto);
  const nombreOk = nombre.trim().length >= 2;
  const montoOk = cantidad > MIN && cantidad < MAX;
  const datosOk = nombreOk && montoOk;
  const actual = historial[0] ?? EJEMPLO;

  const crear = () => {
    setHistorial((h) => [{ nombre: nombre.trim(), monto: cantidad, mensaje: mensaje.trim(), pagada: false }, ...h]);
    ir('enlace');
  };
  const abrirWeb = () => { actuado.current = true; setWeb('pagar'); setVista('web'); };
  const pagar = () => {
    actuado.current = true;
    setHistorial((h) => (h.length ? [{ ...h[0], pagada: true }, ...h.slice(1)] : h));
    setWeb('pagado');
  };
  const reiniciar = () => {
    actuado.current = true;
    setVista('app'); setPantalla('inicio'); setNombre(''); setMonto(''); setMensaje('');
    setTocado(false); setTerminos(null); setVerTerminos(false); setWeb('pagar'); setHistorial([]);
  };
  const nueva = () => { setNombre(''); setMonto(''); setMensaje(''); setTocado(false); setTerminos(null); setVerTerminos(false); ir('datos'); };

  const paso = PASO[pantalla];
  const stepper = (
    <div className={s.stepper}>
      <div className={s.bars} aria-hidden="true">{[1, 2, 3, 4].map((n) => <i key={n} className={n <= paso ? s.barOn : undefined} />)}</div>
      <p className={s.stepText}>Paso {paso} de 4</p>
    </div>
  );

  return (
    <div className={s.demo}>
      <div className={s.controls} role="group" aria-label="Controles de la demo">
        <div className={s.switch}>
          <button type="button" aria-pressed={vista === 'app'} className={vista === 'app' ? s.on : undefined} onClick={() => { actuado.current = true; setVista('app'); }}>
            <b>En la app</b><span>quien pide</span>
          </button>
          <button type="button" aria-pressed={vista === 'web'} className={vista === 'web' ? s.on : undefined} onClick={abrirWeb}>
            <b>En la web</b><span>quien paga</span>
          </button>
        </div>
        <div className={s.tools}>
          {vista === 'web' && web !== 'vencido' && <button type="button" className={s.tool} onClick={() => { actuado.current = true; setWeb('vencido'); }}>Ver el enlace vencido</button>}
          <button type="button" className={s.tool} onClick={reiniciar}>Empezar de nuevo</button>
        </div>
        <p className={s.note}>No se envía ni se cobra nada: todo pasa en tu navegador.</p>
      </div>

      <div className={`${s.phone} ${roboto.className}`}>
        <div className={s.statusBar} aria-hidden="true"><span>{vista === 'app' ? '9:41' : '12:04'}</span><span className={s.icons}><i /><i /><i /></span></div>

        {vista === 'app' ? (
          <section className={s.screen} aria-label="App mony: quien pide">
            <header className={s.appBar}>
              {pantalla !== 'inicio' && pantalla !== 'enlace'
                ? <button type="button" className={s.back} aria-label="Atrás" onClick={() => ir(pantalla === 'datos' ? 'inicio' : pantalla === 'confirmar' ? 'datos' : pantalla === 'terminos' ? 'confirmar' : 'enlace')}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
                  </button>
                : <span className={s.back} aria-hidden="true" />}
              <Image src="/assets/pidemony/mony-negativo.webp" alt="mony" width={66} height={20} className={s.logo} />
              <span className={s.salir} aria-hidden="true">Salir</span>
            </header>

            <div className={s.body} data-lenis-prevent>
              {pantalla === 'inicio' && (
                <>
                  <h3 ref={titulo} tabIndex={-1} className={s.title}>Solicita tu Mony!</h3>
                  {stepper}
                  <div className={s.spacer} />
                  <button type="button" className={s.outline} onClick={() => ir('historial')}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
                    Histórico de solicitudes
                  </button>
                  <button type="button" className={s.primary} onClick={() => ir('datos')}>Pide tu Mony</button>
                </>
              )}

              {pantalla === 'datos' && (
                <form className={s.form} onSubmit={(e) => { e.preventDefault(); if (datosOk) ir('confirmar'); else setTocado(true); }} noValidate>
                  <h3 ref={titulo} tabIndex={-1} className={s.title}>Solicita tu Mony!</h3>
                  {stepper}
                  <p className={s.field}>
                    <label htmlFor={`${id}-n`}>¿A quién le deseas pedir?</label>
                    <span className={s.help} id={`${id}-nh`}>Bríndanos el nombre de la persona a la que le vas a hacer la solicitud</span>
                    <input id={`${id}-n`} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" autoComplete="off" maxLength={40}
                      aria-describedby={`${id}-nh`} aria-invalid={tocado && !nombreOk ? 'true' : undefined} />
                  </p>
                  <p className={s.field}>
                    <label htmlFor={`${id}-m`}>¿Cuánto le vas a pedir?</label>
                    <span className={`${s.help} ${tocado && !montoOk ? s.helpErr : ''}`} id={`${id}-mh`}>El monto ingresado debe ser mayor a <b>{dinero(MIN).replace('.00', '')}</b> y menor a <b>{dinero(MAX).replace('.00', '')}</b></span>
                    <span className={s.money}>
                      <span aria-hidden="true">$</span>
                      <input id={`${id}-m`} value={monto} onChange={(e) => setMonto(e.target.value)} onBlur={() => monto && setTocado(true)} placeholder="00.00" inputMode="decimal" autoComplete="off" maxLength={9}
                        aria-describedby={`${id}-mh`} aria-invalid={tocado && !montoOk ? 'true' : undefined} />
                    </span>
                  </p>
                  <p className={s.field}>
                    <label htmlFor={`${id}-x`}>¡Déjale un mensaje! <span className={s.opt}>(Opcional)</span></label>
                    <input id={`${id}-x`} value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Asunto" autoComplete="off" maxLength={50} />
                  </p>
                  <div className={s.spacer} />
                  {/* «Siguiente» se ve desactivado hasta que los datos valen,
                      pero sigue siendo pulsable: así quien lo intenta antes de
                      tiempo recibe el porqué en lugar de un botón muerto. */}
                  <button type="submit" className={`${s.primary} ${datosOk ? '' : s.off}`} aria-disabled={!datosOk}>Siguiente</button>
                  <p className={s.live} aria-live="polite">{tocado && !datosOk ? (nombreOk ? 'Revisa el monto: tiene que estar entre $5 y $2,000.' : 'Escribe a quién le pides.') : ''}</p>
                </form>
              )}

              {pantalla === 'confirmar' && (
                <>
                  <h3 ref={titulo} tabIndex={-1} className={s.title}>Confirmar tu solicitud</h3>
                  {stepper}
                  <ol className={s.timeline}>
                    <li>
                      <i aria-hidden="true">$</i>
                      <p className={s.big}>Solicitud de: {dinero(cantidad)}</p>
                      <p><b>Destinatario:</b> {nombre.trim()}</p>
                      <p className={s.muted}>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </li>
                    <li>
                      <i aria-hidden="true">✉</i>
                      <p><b>Mensaje:</b></p>
                      <p className={s.muted}>{mensaje.trim() || 'Sin mensaje'}</p>
                    </li>
                  </ol>
                  <div className={s.spacer} />
                  <button type="button" className={s.primary} onClick={() => ir('terminos')}>Siguiente</button>
                </>
              )}

              {pantalla === 'terminos' && (
                <>
                  <h3 ref={titulo} tabIndex={-1} className={s.title}>Es necesario que leas la siguiente información</h3>
                  {stepper}
                  <button type="button" className={s.card} aria-expanded={verTerminos} onClick={() => setVerTerminos((v) => !v)}>
                    Ver Términos y Condiciones
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
                  </button>
                  {verTerminos && <p className={s.terms}>Texto de ejemplo de esta demo. En la app, aquí van los términos del banco.</p>}
                  <p className={s.ask}>Por favor, acepta los términos y condiciones</p>
                  <div className={s.choice}>
                    <button type="button" aria-pressed={terminos === 'no'} aria-label="No acepto" className={terminos === 'no' ? s.no : undefined} onClick={() => setTerminos('no')}>✕</button>
                    <button type="button" aria-pressed={terminos === 'si'} aria-label="Acepto" className={terminos === 'si' ? s.yes : undefined} onClick={() => setTerminos('si')}>✓</button>
                  </div>
                  <p className={s.muted}>He leído y acepto los términos y condiciones</p>
                  <div className={s.spacer} />
                  <button type="button" className={`${s.primary} ${terminos === 'si' ? '' : s.off}`} aria-disabled={terminos !== 'si'} onClick={() => terminos === 'si' && crear()}>Siguiente</button>
                  <p className={s.live} aria-live="polite">{terminos === 'no' ? 'Sin aceptar los términos no se puede enviar la solicitud.' : ''}</p>
                </>
              )}

              {pantalla === 'enlace' && (
                <>
                  <h3 ref={titulo} tabIndex={-1} className={s.title}>¡Solicitud creada!</h3>
                  {stepper}
                  <p className={s.lead}>Comparte el enlace con {actual.nombre}. Así le llega por WhatsApp:</p>
                  <div className={s.chat}>
                    <p>{actual.nombre}, te he solicitado un “Pide Mony” por <b>{dinero(actual.monto)}</b>.{actual.mensaje && <> Concepto de: <b>{actual.mensaje}</b>.</>}</p>
                    <p className={s.link}>pidemony.app/p/demo</p>
                  </div>
                  <div className={s.spacer} />
                  <button type="button" className={s.outline} onClick={() => ir('historial')}>Histórico de solicitudes</button>
                  <button type="button" className={s.primary} onClick={abrirWeb}>Abrir el enlace como {actual.nombre}</button>
                </>
              )}

              {pantalla === 'historial' && (
                <>
                  <h3 ref={titulo} tabIndex={-1} className={s.title}>Histórico de solicitudes</h3>
                  {historial.length ? (
                    <ul className={s.history}>
                      {historial.map((h, i) => (
                        <li key={i}><span><b>{h.nombre}</b>{h.mensaje && <em>{h.mensaje}</em>}</span><span>{dinero(h.monto)}<em className={h.pagada ? s.paid : s.pending}>{h.pagada ? 'Pagada' : 'Pendiente'}</em></span></li>
                      ))}
                    </ul>
                  ) : <p className={s.muted}>Todavía no has pedido nada en esta demo.</p>}
                  <div className={s.spacer} />
                  <button type="button" className={s.primary} onClick={nueva}>Pide tu Mony</button>
                </>
              )}
            </div>
          </section>
        ) : (
          <section className={`${s.screen} ${s.web}`} aria-label="Página de pago: quien paga">
            <div className={s.url} aria-hidden="true">pidemony.app/p/demo</div>
            <div className={s.body} data-lenis-prevent>
              <div className={s.bank} aria-hidden="true"><i>Mercantil</i> <span>Banco</span></div>
              <div className={s.sheet}>
                <h3 ref={web === 'pagar' ? titulo : undefined} tabIndex={-1} className={s.webTitle}>¡Hola, {actual.nombre}!</h3>
                <p>Te he solicitado un “Pide Mony” por <b>{dinero(actual.monto)}</b>.{actual.mensaje && <> Concepto de: <b>{actual.mensaje}</b>.</>}</p>
                <p className={s.muted}>Válido hasta: Oct 15, 2021 <b>12:00 AM</b></p>
              </div>
              <div className={s.sheet}>
                <p className={s.secure}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5l8-3z" /></svg>
                  La información de tu tarjeta Visa o Mastercard está protegida por el más alto cifrado de seguridad.
                </p>
                <dl className={s.cardData}>
                  <div className={s.wide}><dt>Número de tarjeta</dt><dd>•••• •••• •••• 4242 <span className={s.mc} aria-hidden="true"><i /><i /></span></dd></div>
                  <div className={s.wide}><dt>Nombre en la tarjeta</dt><dd>{actual.nombre}</dd></div>
                  <div><dt>MM / YY</dt><dd>12 / 28</dd></div>
                  <div><dt>CVV/CVC</dt><dd>•••</dd></div>
                </dl>
                <p className={s.sample}>Tarjeta de ejemplo: no se puede editar ni se cobra.</p>
                <button type="button" className={s.pay} onClick={pagar}>Pagar {dinero(actual.monto)}</button>
              </div>
            </div>

            {web !== 'pagar' && (
              <div className={s.overlay}>
                <div className={s.modal} role="dialog" aria-labelledby={`${id}-mt`}>
                  <h3 id={`${id}-mt`} ref={titulo} tabIndex={-1} className={s.modalTitle}>{web === 'pagado' ? '¡Pago realizado!' : '¡Lo sentimos!'}</h3>
                  {web === 'pagado'
                    ? <p>Pagaste <b>{dinero(actual.monto)}</b>. Quien te lo pidió lo verá en su histórico de solicitudes.</p>
                    : <>
                        <p>El link que quieres utilizar ya se encuentra vencido</p>
                        <p className={s.muted}>Te recomendamos que te pongas en contacto con quien te lo suministró para poder seguir con la transacción</p>
                      </>}
                  <button type="button" className={s.pay} onClick={() => { actuado.current = true; if (web === 'pagado') { setVista('app'); setPantalla('historial'); } setWeb('pagar'); }}>Volver</button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
