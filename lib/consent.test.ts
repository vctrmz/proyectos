import { describe, it, expect, beforeEach } from 'vitest';
import { isLocalHost, readConsent, writeConsent, startGA, startHubSpot, startHotjar, startClarity, startPlerdy, startAnalytics, CONSENT_KEY } from './consent';

beforeEach(() => { document.head.innerHTML = ''; });

describe('isLocalHost', () => {
  it('reconoce local y privadas', () => {
    for (const h of ['', 'localhost', '127.0.0.1', '::1', '[::1]', 'dev.local', '127.5.5.5', '10.0.0.2', '192.168.1.4', '172.16.0.1', '172.31.9.9']) {
      expect(isLocalHost(h), h).toBe(true);
    }
  });
  it('no confunde dominios públicos', () => {
    for (const h of ['proyectos-theta-hazel.vercel.app', '172.32.0.1', '11.0.0.1', 'localhost.com']) {
      expect(isLocalHost(h), h).toBe(false);
    }
  });
});

describe('lectura y escritura', () => {
  it('guarda la decisión en localStorage', () => {
    expect(readConsent()).toBeNull();
    writeConsent('granted');
    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted');
    expect(readConsent()).toBe('granted');
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
  it('HubSpot usa el loader de la región EU', () => {
    startHubSpot();
    expect(document.getElementById('hs-script-loader')?.getAttribute('src')).toBe('https://js-eu1.hs-scripts.com/148496979.js');
  });
  it('Hotjar define settings e inyecta el script (host público)', () => {
    startHotjar();
    expect((window as unknown as { _hjSettings: unknown })._hjSettings).toEqual({ hjid: 6776849, hjsv: 6 });
    expect(document.getElementById('hj-loader')?.getAttribute('src')).toBe('https://static.hotjar.com/c/hotjar-6776849.js?sv=6');
  });
  it('Clarity se importa como módulo con el id del proyecto', () => {
    startClarity();
    const s = document.getElementById('clarity-loader');
    expect(s?.getAttribute('type')).toBe('module');
    expect(s?.textContent).toContain('@microsoft/clarity@1.0.2');
    expect(s?.textContent).toContain("init('yd4g6685po')");
  });
  it('Plerdy define las globales e inyecta el script una vez', () => {
    startPlerdy();
    startPlerdy();
    const w = window as unknown as { _site_hash_code: string; _suid: number };
    expect(w._site_hash_code).toBe('81690a1951e6290b7119405fec614b5d');
    expect(w._suid).toBe(81035);
    expect(document.querySelectorAll('#plerdy-loader')).toHaveLength(1);
    expect(document.getElementById('plerdy-loader')?.getAttribute('src')).toMatch(/^https:\/\/a\.plerdy\.com\/public\/js\/click\/main\.js\?v=/);
  });
  it('startAnalytics arranca los cinco', () => {
    startAnalytics();
    for (const id of ['ga-gtag-loader', 'clarity-loader', 'hj-loader', 'plerdy-loader', 'hs-script-loader']) {
      expect(document.getElementById(id), id).not.toBeNull();
    }
  });
});
