'use client';
import { useEffect, useRef, useState } from 'react';
import ReceiptPrinter, { type PrinterStage } from './ReceiptPrinter';
import s from './FlesipDemo.module.css';

/* La demo de la factura rápida de Flesip, para el taxi: el conductor pone el
   importe y emite; la impresora saca el ticket con la factura pendiente y su
   QR; el pasajero lo abre y completa sus datos; y en Ingresos la factura pasa
   a procesada con su nombre. Es el estado intermedio del caso, contado de
   punta a punta. Hecha para este portfolio: todo vive en el estado del
   componente y no sale nada de aquí. */
type Vista = 'importe' | 'emitida' | 'cliente' | 'ingresos';
type Factura = { n: string; total: number; concepto: string; fecha: string; cliente?: { nombre: string; nif: string } };

const IVA = 0.1; // el transporte de viajeros tributa al 10 %
const CONCEPTOS = ['Servicio de taxi', 'Traslado al aeropuerto'];
const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
const fecha = () => new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const STAGE_LABELS: Record<PrinterStage, string> = { idle: 'Impresora lista', processing: 'Emitiendo la factura', printing: 'Imprimiendo el ticket', complete: 'Ticket impreso' };

/* QR decorativo y estable: patrón pseudoaleatorio con los tres ojos. */
function Qr({ seed }: { seed: number }) {
  const N = 21, cells: React.ReactNode[] = [];
  let x = seed * 9301 + 49297;
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  const eye = (cx: number, cy: number) => [<rect key={`o${cx}${cy}`} x={cx} y={cy} width={7} height={7} fill="currentColor" />, <rect key={`w${cx}${cy}`} x={cx + 1} y={cy + 1} width={5} height={5} fill="#fff" />, <rect key={`i${cx}${cy}`} x={cx + 2} y={cy + 2} width={3} height={3} fill="currentColor" />];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const inEye = (r < 8 && c < 8) || (r < 8 && c > N - 9) || (r > N - 9 && c < 8);
    if (!inEye && rnd() > 0.52) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="currentColor" />);
  }
  return <svg viewBox={`0 0 ${N} ${N}`} className={s.qr} shapeRendering="crispEdges" aria-hidden="true">{cells}{eye(0, 0)}{eye(N - 7, 0)}{eye(0, N - 7)}</svg>;
}

export default function FlesipDemo() {
  const [vista, setVista] = useState<Vista>('importe');
  const [cents, setCents] = useState('2450');
  const [concepto, setConcepto] = useState(CONCEPTOS[0]);
  const [factura, setFactura] = useState<Factura | null>(null);
  const [stage, setStage] = useState<PrinterStage>('idle');
  const [nombre, setNombre] = useState('');
  const [nif, setNif] = useState('');
  const [numero, setNumero] = useState(142);
  const timers = useRef<number[]>([]);
  const titulo = useRef<HTMLHeadingElement | null>(null);
  const actuado = useRef(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (actuado.current) titulo.current?.focus(); }, [vista]);
  const ir = (v: Vista) => { actuado.current = true; setVista(v); };

  const total = Number(cents || '0') / 100;
  const base = total / (1 + IVA);
  const tecla = (k: string) => setCents((c) => (k === '⌫' ? c.slice(0, -1) : (c + k).replace(/^0+/, '').slice(0, 6)));

  const emitir = () => {
    const f: Factura = { n: `F-2025-${String(numero).padStart(4, '0')}`, total, concepto, fecha: fecha() };
    setFactura(f); setNumero((x) => x + 1); ir('emitida');
    timers.current.forEach(clearTimeout);
    setStage('processing');
    timers.current = [window.setTimeout(() => setStage('printing'), 1000), window.setTimeout(() => setStage('complete'), 1000 + 2300)];
  };
  const completar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!factura || nombre.trim().length < 2 || nif.trim().length < 9) return;
    setFactura({ ...factura, cliente: { nombre: nombre.trim(), nif: nif.trim().toUpperCase() } });
    ir('ingresos');
  };
  const nueva = () => { timers.current.forEach(clearTimeout); setStage('idle'); setFactura(null); setNombre(''); setNif(''); setCents('2450'); ir('importe'); };

  const paso = vista === 'importe' ? 1 : vista === 'cliente' ? 2 : vista === 'ingresos' ? 3 : 1;
  const datosOk = nombre.trim().length >= 2 && nif.trim().length >= 9;

  return (
    <div className={s.demo}>
      <ol className={s.steps}>
        {[['1', 'El conductor emite', 'Importe y listo: sin NIF ni dirección.'], ['2', 'El pasajero completa', 'Escanea el QR y rellena sus datos.'], ['3', 'Se procesa sola', 'En Ingresos ya lleva su nombre.']].map(([n, t, d], i) => (
          <li key={n} className={i + 1 === paso ? s.stepOn : i + 1 < paso ? s.stepDone : ''}><b>{n}</b><span><strong>{t}</strong>{d}</span></li>
        ))}
      </ol>

      <div className={s.stage}>
        <ReceiptPrinter stage={stage} labels={STAGE_LABELS} brand="Flesip · ticket">
          {factura ? (
            <div className={s.ticket}>
              <p className={s.tBrand}>FLESIP</p>
              <p className={s.tCenter}>Factura simplificada</p>
              <p className={s.tCenter}>{factura.n}</p>
              <p className={s.tCenter}>{factura.fecha}</p>
              <hr />
              <p className={s.tRow}><span>{factura.concepto}</span><span>{eur(factura.total)}</span></p>
              <p className={s.tRow}><span>Base imponible</span><span>{eur(factura.total / (1 + IVA))}</span></p>
              <p className={s.tRow}><span>IVA 10 %</span><span>{eur(factura.total - factura.total / (1 + IVA))}</span></p>
              <hr />
              <p className={`${s.tRow} ${s.tTotal}`}><span>TOTAL</span><span>{eur(factura.total)}</span></p>
              <p className={s.tState}>ESTADO: PENDIENTE</p>
              <Qr seed={numero} />
              <p className={s.tCenter}>Escanea para completar</p>
              <p className={s.tCenter}>tus datos fiscales</p>
            </div>
          ) : <div className={s.ticket} />}
        </ReceiptPrinter>

        <div className={s.phone}>
          <div className={s.statusBar} aria-hidden="true"><span>9:41</span><span className={s.icons}><i /><i /><i /></span></div>
          {vista === 'cliente' && <div className={s.urlBar} aria-hidden="true">flesip.com/f/{factura?.n.slice(-4)}</div>}

          {vista === 'importe' && (
            <div className={s.screen}>
              <h4 ref={titulo} tabIndex={-1} className={s.h}>Factura rápida</h4>
              <p className={s.label}>Importe total</p>
              <p className={s.amount} aria-live="polite">{eur(total)}</p>
              <p className={s.sub}>IVA 10 % incluido · base {eur(base)}</p>
              <div className={s.chips} role="radiogroup" aria-label="Concepto">
                {CONCEPTOS.map((c) => <button key={c} type="button" role="radio" aria-checked={c === concepto} className={c === concepto ? s.chipOn : s.chip} onClick={() => setConcepto(c)}>{c}</button>)}
              </div>
              <div className={s.pad}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'].map((k) => (
                  <button key={k} type="button" className={s.key} onClick={() => tecla(k)} aria-label={k === '⌫' ? 'Borrar' : k}>{k}</button>
                ))}
              </div>
              <button type="button" className={s.primary} disabled={total <= 0} onClick={emitir}>Emitir factura</button>
            </div>
          )}

          {vista === 'emitida' && factura && (
            <div className={s.screen}>
              <h4 ref={titulo} tabIndex={-1} className={s.h}>Factura emitida</h4>
              <span className={s.pending}>Pendiente</span>
              <p className={s.amount}>{eur(factura.total)}</p>
              <p className={s.sub}>{factura.n} · {factura.concepto}</p>
              <div className={s.qrBox}><Qr seed={numero} /><p>El pasajero la completa cuando quiera, por QR o por correo.</p></div>
              <button type="button" className={s.primary} onClick={() => ir('cliente')} disabled={stage !== 'complete'}>Simular: el pasajero escanea el QR</button>
              <button type="button" className={s.ghost} onClick={nueva}>Nueva factura</button>
            </div>
          )}

          {vista === 'cliente' && factura && (
            <form className={`${s.screen} ${s.web}`} onSubmit={completar}>
              <h4 ref={titulo} tabIndex={-1} className={s.h}>Completa tu factura</h4>
              <p className={s.sub}>{factura.concepto} · {eur(factura.total)} · {factura.fecha}</p>
              <label className={s.field}><span>Nombre o razón social</span><input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="off" placeholder="Laura Gómez" /></label>
              <label className={s.field}><span>NIF / CIF</span><input value={nif} onChange={(e) => setNif(e.target.value)} autoComplete="off" placeholder="12345678Z" maxLength={9} /></label>
              <button type="submit" className={s.primary} disabled={!datosOk}>Completar factura</button>
              <p className={s.note}>Demo: no se guarda ni se envía nada.</p>
            </form>
          )}

          {vista === 'ingresos' && factura && (
            <div className={s.screen}>
              <h4 ref={titulo} tabIndex={-1} className={s.h}>Ingresos</h4>
              <ul className={s.list}>
                <li className={s.rowNew}><span><b>{factura.cliente?.nombre}</b><small>{factura.n} · {factura.concepto}</small></span><span><b>{eur(factura.total)}</b><em className={s.done}>Procesada</em></span></li>
                <li><span><b className={s.noName}>Sin destinatario</b><small>F-2025-0139 · Servicio de taxi</small></span><span><b>{eur(18.9)}</b><em className={s.pend}>Pendiente</em></span></li>
                <li><span><b>Andrés Ruiz</b><small>F-2025-0137 · Traslado al aeropuerto</small></span><span><b>{eur(32)}</b><em className={s.done}>Procesada</em></span></li>
              </ul>
              <button type="button" className={s.ghost} onClick={nueva}>Nueva factura</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
