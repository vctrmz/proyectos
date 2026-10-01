import { describe, it, expect, beforeEach } from 'vitest';
import { isLocalHost, readConsent, writeConsent, startGA, startClarity, startHotjar, startPlerdy, startHubSpot, startAnalytics, CONSENT_KEY } from './consent';

beforeEach(() => { document.head.innerHTML = ''; });

describe('isLocalHost', () => {
  it('reconoce local y privadas', () => {
    for (const h of ['', 'localhost', '127.0.0.1', '::1', '[::1]', 'dev.local', '127.5.5.5', '10.0.0.2', '192.168.1.4', '172.16.0.1', '172.31.9.9']) {
      expect(isLocalHost(h), h).toBe(true);
    }
  });
  it('no confunde dominios públicos', () => {
    for (const h of ['victormaza.vercel.app', 'proyectos-sable.vercel.app', 'proyectos-theta-hazel.vercel.app', '172.32.0.1', '11.0.0.1', 'localhost.com']) {
      expect(isLocalHost(h), h).toBe(false);
    }
  });
});

describe('lectura y escritura', () => {
  it('guarda la decisión en localStorage, con su fecha', () => {
    expect(readConsent()).toBeNull();
    writeConsent('granted', 1_000);
    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted|1000');
    expect(readConsent(2_000)).toBe('granted');
  });
  /* La AEPD pide renovar el consentimiento como mucho cada 24 meses: aquí, a los 12. */
  it('la decisión caduca a los 12 meses y se vuelve a preguntar', () => {
    const hoy = Date.UTC(2026, 9, 2);
    writeConsent('denied', hoy);
    expect(readConsent(hoy + 364 * 864e5)).toBe('denied');
    expect(readConsent(hoy + 366 * 864e5)).toBeNull();
  });
  it('una decisión sin fecha, del formato anterior, cuenta como caducada', () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    expect(readConsent()).toBeNull();
  });
});

describe('arranque de servicios', () => {
  it('GA crea la cola antes del script y no duplica', () => {
    startGA();
    startGA();
    const w = window as unknown as { dataLayer: unknown[]; gtag: unknown };
    expect(w.dataLayer).toHaveLength(2);
    expect(typeof w.gtag).toBe('function');
    const s = document.querySelectorAll('#ga-gtag-loader');
    expect(s).toHaveLength(1);
    expect(s[0].getAttribute('src')).toBe('https://www.googletagmanager.com/gtag/js?id=G-HZYDMMSVG5');
  });
  it('Clarity se importa como módulo con el id del proyecto', () => {
    startClarity();
    const s = document.getElementById('clarity-loader');
    expect(s?.getAttribute('type')).toBe('module');
    expect(s?.textContent).toContain('@microsoft/clarity@1.0.2');
    expect(s?.textContent).toContain("init('yd4g6685po')");
  });
  it('Hotjar deja la cola y la configuración antes del script', () => {
    startHotjar();
    const w = window as unknown as { hj: unknown; _hjSettings: { hjid: number; hjsv: number } };
    expect(typeof w.hj).toBe('function');
    expect(w._hjSettings).toEqual({ hjid: 6776849, hjsv: 6 });
    expect(document.getElementById('hj-loader')?.getAttribute('src')).toContain('hotjar-6776849.js?sv=6');
  });
  it('Plerdy define sus globales y pide el script con la política de referente', () => {
    startPlerdy();
    const w = window as unknown as { _site_hash_code: string; _suid: number };
    expect(w._site_hash_code).toBe('81690a1951e6290b7119405fec614b5d');
    expect(w._suid).toBe(81035);
    const s = document.getElementById('plerdy-loader') as HTMLScriptElement | null;
    expect(s?.src).toContain('a.plerdy.com/public/js/click/main.js');
    expect(s?.referrerPolicy).toBe('strict-origin-when-cross-origin');
  });
  it('HubSpot usa el centro de datos europeo y no bloquea', () => {
    startHubSpot();
    const s = document.getElementById('hs-script-loader') as HTMLScriptElement | null;
    expect(s?.getAttribute('src')).toBe('https://js-eu1.hs-scripts.com/148496979.js');
    expect(s?.defer).toBe(true);
  });
  /* El contrato del banner: aceptar enciende los cinco servicios y ninguno
     más. Si mañana se añade uno sin declararlo en la página de privacidad,
     esta lista lo delata. */
  it('startAnalytics arranca los cinco servicios, y nada más', () => {
    startAnalytics();
    const esperados = ['ga-gtag-loader', 'clarity-loader', 'hj-loader', 'plerdy-loader', 'hs-script-loader'];
    for (const id of esperados) expect(document.getElementById(id), id).not.toBeNull();
    const cargadores = [...document.head.querySelectorAll('script[id]')].map((s) => s.id).sort();
    expect(cargadores).toEqual([...esperados].sort());
  });
  it('fuera de consentimiento no se inyecta nada: startAnalytics es el único camino', () => {
    expect(document.head.querySelectorAll('script[id]')).toHaveLength(0);
  });
});
