import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

/* Un test por criterio de aceptación del ticket APRD-513, en el mismo orden. */

const openStep = () => render(<App initialView="demo" />);
const editor = () => screen.getByRole('textbox', { name: /cuerpo del certificado/i });

describe('APRD-513 · criterios de aceptación', () => {
  it('1. el paso CERTIFICADO aparece en el flujo de creación de certificados', () => {
    openStep();
    const flow = screen.getByRole('navigation', { name: /proceso de suscripción/i });
    expect(within(flow).getByRole('button', { name: /certificados/i })).toHaveAttribute('aria-current', 'step');
  });

  it('2. se puede seleccionar idioma y plantilla', async () => {
    const user = userEvent.setup();
    openStep();
    await user.selectOptions(screen.getByRole('combobox', { name: /plantilla/i }), 'abogacia');
    expect(screen.getByText('Contratos del Sector Público (LCSP)')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'EN' }));
    expect(await screen.findByText(/SURETY INSURANCE CERTIFICATE/)).toBeInTheDocument();
    expect(editor()).toHaveTextContent(/Public Sector Contracts/);
  });

  it('3. cabecera, logotipo y pie no son editables', () => {
    const { container } = openStep();
    for (const id of ['header', 'preamble', 'signature', 'footer']) {
      const region = container.querySelector(`[data-region="${id}"]`)!;
      expect(region).toHaveAttribute('data-editable', 'false');
      expect(region.querySelector('[contenteditable="true"]')).toBeNull();
    }
    const body = container.querySelector('[data-region="body"]')!;
    expect(body.querySelector('[contenteditable="true"]')).not.toBeNull();
  });

  it('4. la edición funciona y permite insertar variables', async () => {
    const user = userEvent.setup();
    openStep();
    await act(async () => {}); // los chips son node views de React: se pintan tras montar
    const before = editor().querySelectorAll('.var-chip').length;
    expect(before).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: /insertar tomador · nombre/i }));
    await act(async () => {});
    expect(editor().querySelectorAll('.var-chip').length).toBe(before + 1);
    expect(screen.getByText(/modificado respecto a la plantilla/i)).toBeInTheDocument();
  });

  it('5. funciona para el tenant y el producto Caución (document_model)', async () => {
    const user = userEvent.setup();
    openStep();
    await user.click(screen.getByRole('button', { name: 'document_model' }));
    const json = screen.getByRole('complementary', { name: 'document_model' }).querySelector('pre code')!.textContent!;
    const { document_model } = JSON.parse(json);
    expect(document_model).toMatchObject({ tenant: 'surety-demo', product: 'caucion', step: 'CERTIFICADO' });
  });

  it('no deja emitir con datos de la póliza pendientes', async () => {
    const user = userEvent.setup();
    openStep();
    await user.selectOptions(screen.getByRole('combobox', { name: /plantilla/i }), 'almacenamiento');
    expect(screen.getByRole('alert')).toHaveTextContent(/falta 1 dato/i);
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.queryByText('Póliza emitida')).not.toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Valor'), 'Antequera 220 kV');
    await user.click(screen.getByRole('button', { name: 'Completar' }));
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    expect(screen.getByText('Póliza emitida')).toBeInTheDocument();
  });
});
