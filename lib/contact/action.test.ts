import { describe, it, expect, vi, beforeEach } from 'vitest';

/* El SDK se sustituye por un espía: estos tests comprueban las reglas del
   formulario, no que Resend sepa mandar correos. */
const enviar = vi.fn();
vi.mock('resend', () => ({ Resend: class { emails = { send: enviar }; } }));
/* BotID también: aquí se decide qué responde, no cómo clasifica Vercel. */
const botid = vi.fn();
vi.mock('botid/server', () => ({ checkBotId: () => botid() }));
/* `after` solo existe dentro de una petición: aquí se apunta lo programado y
   la copia a la hoja se sustituye por un espía. */
const despues: (() => unknown)[] = [];
vi.mock('next/server', () => ({ after: (fn: () => unknown) => { despues.push(fn); } }));
const hoja = vi.fn();
vi.mock('./hoja', () => ({ guardarEnHoja: (f: unknown) => hoja(f) }));

import { enviarContacto } from './action';
import { ESTADO_INICIAL } from './estado';

const datos = (extra: Record<string, string> = {}) => {
  const f = new FormData();
  f.set('locale', 'es');
  f.set('nombre', 'Ana Ruiz');
  f.set('email', 'ana@empresa.com');
  f.set('mensaje', 'Tenemos un ERP con reglas por cliente y queremos ordenarlo.');
  f.set('privacidad', 'on');
  for (const [k, v] of Object.entries(extra)) f.set(k, v);
  return f;
};

beforeEach(() => {
  despues.length = 0;
  hoja.mockReset();
  botid.mockReset();
  botid.mockResolvedValue({ isBot: false, isHuman: true, isVerifiedBot: false, bypassed: false });
  enviar.mockReset();
  enviar.mockResolvedValue({ data: { id: 'x' }, error: null });
  process.env.RESEND_API_KEY = 'test';
});

describe('enviarContacto', () => {
  it('envía a mi bandeja con reply-to del visitante', async () => {
    const r = await enviarContacto(ESTADO_INICIAL, datos());
    expect(r.estado).toBe('ok');
    const carga = enviar.mock.calls[0][0];
    expect(carga.to).toBe('vctrmz47@gmail.com');
    /* Sin reply-to habría que copiar la dirección a mano para responder. */
    expect(carga.replyTo).toBe('ana@empresa.com');
    expect(carga.text).toContain('Tenemos un ERP');
  });

  it('el asunto nunca lleva saltos de línea', async () => {
    await enviarContacto(ESTADO_INICIAL, datos({ nombre: 'Ana\nBcc: otro@sitio.com' }));
    expect(enviar.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });

  describe('validación', () => {
    it('reúne todos los errores de una vez, no de uno en uno', async () => {
      const r = await enviarContacto(ESTADO_INICIAL, datos({ nombre: '', email: 'no-es-correo', mensaje: 'corto' }));
      expect(r.estado).toBe('error');
      expect(Object.keys(r.errores!).sort()).toEqual(['email', 'mensaje', 'nombre']);
      expect(enviar).not.toHaveBeenCalled();
    });
    it('sin aceptar la privacidad no se envía', async () => {
      const f = datos();
      f.delete('privacidad');
      const r = await enviarContacto(ESTADO_INICIAL, f);
      expect(r.errores?.privacidad).toBeTruthy();
      expect(enviar).not.toHaveBeenCalled();
    });
    /* Lo escrito vuelve al formulario: nadie teclea dos veces el mismo párrafo
       porque se equivocó en el correo. */
    it('devuelve lo escrito para no perderlo', async () => {
      const r = await enviarContacto(ESTADO_INICIAL, datos({ email: 'mal' }));
      expect(r.valores?.mensaje).toContain('ERP');
      expect(r.valores?.nombre).toBe('Ana Ruiz');
    });
    it('los errores salen en el idioma de la página', async () => {
      const r = await enviarContacto(ESTADO_INICIAL, datos({ locale: 'en', email: 'mal' }));
      expect(r.errores?.email).toMatch(/does not look valid/);
    });
  });

  describe('robots', () => {
    /* A un robot se le responde «enviado» sin enviar: decirle que se le ha
       pillado sólo le enseña a evitar la trampa la próxima vez. */
    it('el campo trampa relleno finge éxito y no envía', async () => {
      const r = await enviarContacto(ESTADO_INICIAL, datos({ empresa: 'SEO Corp' }));
      expect(r.estado).toBe('ok');
      expect(enviar).not.toHaveBeenCalled();
    });
    /* Hubo una trampa de tiempo y se retiró: con autocompletado una persona
       envía en menos de tres segundos, y el fallo tiraba mensajes reales
       fingiendo que habían salido. Este test fija que enviar rápido funciona. */
    it('enviar deprisa no se castiga: un humano con autocompletado es rápido', async () => {
      await enviarContacto(ESTADO_INICIAL, datos());
      expect(enviar).toHaveBeenCalled();
    });
  });

  describe('cuando el envío falla', () => {
    it('sin clave lo dice y ofrece el correo directo, en vez de fingir', async () => {
      delete process.env.RESEND_API_KEY;
      const r = await enviarContacto(ESTADO_INICIAL, datos());
      expect(r.estado).toBe('error');
      expect(r.errores?.global).toMatch(/vctrmz47@gmail\.com/);
      expect(enviar).not.toHaveBeenCalled();
    });
    it('si el servicio devuelve error, no dice que salió', async () => {
      enviar.mockResolvedValue({ data: null, error: { message: 'rate limited' } });
      const r = await enviarContacto(ESTADO_INICIAL, datos());
      expect(r.estado).toBe('error');
      expect(r.valores?.mensaje).toContain('ERP');
    });
    it('si el SDK revienta, tampoco', async () => {
      enviar.mockRejectedValue(new Error('red caída'));
      expect((await enviarContacto(ESTADO_INICIAL, datos())).estado).toBe('error');
    });
  });

  /* Si BotID lo marca como robot no se envía nada, pero tampoco se finge que
     salió: una persona marcada por error tiene que saber que no llegó y a qué
     otra vía ir. Y el aviso no enseña el correo, que no está en la web. */
  it('si BotID lo marca como robot, no envía y manda a las otras vías', async () => {
    botid.mockResolvedValue({ isBot: true, isHuman: false, isVerifiedBot: false, bypassed: false });
    const r = await enviarContacto(ESTADO_INICIAL, datos());
    expect(enviar).not.toHaveBeenCalled();
    expect(r.estado).toBe('error');
    expect(r.errores?.global).toMatch(/LinkedIn/);
    expect(r.errores?.global).not.toMatch(/vctrmz47/);
    // lo escrito se conserva para poder copiarlo
    expect(r.valores?.mensaje).toContain('Tenemos un ERP');
  });

  /* La trampa va antes que BotID: lo que ya delata el campo oculto no gasta
     una comprobación. */
  it('la trampa para robots responde antes de consultar a BotID', async () => {
    const r = await enviarContacto(ESTADO_INICIAL, datos({ empresa: 'Spam S.L.' }));
    expect(r.estado).toBe('ok');
    expect(botid).not.toHaveBeenCalled();
    expect(enviar).not.toHaveBeenCalled();
  });

  /* La copia en la hoja va después de responder y no depende del correo. */
  it('programa la copia en la hoja con los datos del mensaje', async () => {
    const r = await enviarContacto(ESTADO_INICIAL, datos());
    expect(r.estado).toBe('ok');
    expect(hoja).not.toHaveBeenCalled();
    for (const fn of despues) await fn();
    expect(hoja).toHaveBeenCalledWith({ nombre: 'Ana Ruiz', email: 'ana@empresa.com', mensaje: 'Tenemos un ERP con reglas por cliente y queremos ordenarlo.', idioma: 'es' });
  });

  it('la copia en la hoja se guarda aunque el correo falle', async () => {
    enviar.mockResolvedValue({ data: null, error: { name: 'x', message: 'y' } });
    const r = await enviarContacto(ESTADO_INICIAL, datos());
    expect(r.estado).toBe('error');
    for (const fn of despues) await fn();
    expect(hoja).toHaveBeenCalledOnce();
  });

  it('ni robots ni datos inválidos llegan a la hoja', async () => {
    await enviarContacto(ESTADO_INICIAL, datos({ empresa: 'Spam S.L.' }));
    botid.mockResolvedValue({ isBot: true, isHuman: false, isVerifiedBot: false, bypassed: false });
    await enviarContacto(ESTADO_INICIAL, datos());
    botid.mockResolvedValue({ isBot: false, isHuman: true, isVerifiedBot: false, bypassed: false });
    await enviarContacto(ESTADO_INICIAL, datos({ email: 'no-es-un-correo' }));
    expect(despues).toHaveLength(0);
  });
});
