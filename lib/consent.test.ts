import { describe, it, expect, beforeEach } from 'vitest';
import { isLocalHost, readConsent, writeConsent, startGA, startClarity, startAnalytics, CONSENT_KEY } from './consent';

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
  it('Clarity se importa como módulo con el id del proyecto', () => {
    startClarity();
    const s = document.getElementById('clarity-loader');
    expect(s?.getAttribute('type')).toBe('module');
    expect(s?.textContent).toContain('@microsoft/clarity@1.0.2');
    expect(s?.textContent).toContain("init('yd4g6685po')");
  });
  it('startAnalytics arranca GA4 y Clarity, y nada más', () => {
    startAnalytics();
    for (const id of ['ga-gtag-loader', 'clarity-loader']) expect(document.getElementById(id), id).not.toBeNull();
    for (const id of ['hj-loader', 'plerdy-loader', 'hs-script-loader']) expect(document.getElementById(id), id).toBeNull();
  });
});
