import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { guardarEnHoja } from './hoja';

const fila = { nombre: 'Ana Ruiz', email: 'ana@empresa.com', mensaje: 'Tenemos un ERP.', idioma: 'es' as const };
const red = vi.fn();

beforeEach(() => {
  red.mockReset();
  vi.stubGlobal('fetch', red);
  process.env.CONTACTOS_HOJA_URL = 'https://script.google.com/macros/s/x/exec';
  process.env.CONTACTOS_HOJA_CLAVE = 'secreta';
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.CONTACTOS_HOJA_URL;
  delete process.env.CONTACTOS_HOJA_CLAVE;
  vi.restoreAllMocks();
});

describe('guardarEnHoja', () => {
  it('manda la fila con la clave en el cuerpo, no en la URL', async () => {
    red.mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    await guardarEnHoja(fila);
    const [url, init] = red.mock.calls[0];
    expect(url).toBe('https://script.google.com/macros/s/x/exec');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({ clave: 'secreta', ...fila });
  });

  it('sin configurar no intenta nada', async () => {
    delete process.env.CONTACTOS_HOJA_URL;
    await guardarEnHoja(fila);
    expect(red).not.toHaveBeenCalled();
  });

  /* Es un registro extra: si la hoja falla, deja rastro y no rompe el envío. */
  it('si la hoja rechaza o no responde, no lanza y lo deja en el registro', async () => {
    const registro = vi.spyOn(console, 'error').mockImplementation(() => {});
    red.mockResolvedValueOnce(new Response(JSON.stringify({ ok: false, error: 'clave' })));
    await expect(guardarEnHoja(fila)).resolves.toBeUndefined();
    red.mockRejectedValueOnce(new Error('timeout'));
    await expect(guardarEnHoja(fila)).resolves.toBeUndefined();
    expect(registro).toHaveBeenCalledTimes(2);
    expect(String(registro.mock.calls[0])).toMatch(/clave/);
  });
});
