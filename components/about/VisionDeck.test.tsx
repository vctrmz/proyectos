import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('motion/react', () => import('@/test/motion-mock'));
import BioDrawer from './BioDrawer';
import { ABOUT } from '@/lib/content/about';

describe('VisionDeck en el cajón', () => {
  it('abre con los tres titulares; girar enseña la prueba y, vistas las tres, lleva al caso', async () => {
    render(<BioDrawer />);
    await userEvent.click(screen.getByRole('button', { name: /mi forma de trabajar/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { level: 3, name: 'Diseño sistemas, no pantallas.' })).toBeInTheDocument();
    const cards = ABOUT.vision.cards.map((c) => within(dialog).getByRole('button', { name: new RegExp(c.head.replace(/\./g, '\\.')) }));
    expect(cards).toHaveLength(3);
    for (const c of cards) expect(c).toHaveAttribute('aria-pressed', 'false');
    expect(dialog.textContent).toMatch(/0 de 3 vistas/);
    expect(within(dialog).queryByRole('link', { name: /Ver HERMES/ })).toBeNull();

    await userEvent.click(cards[0]);
    expect(cards[0]).toHaveAttribute('aria-pressed', 'true');
    expect(dialog.textContent).toMatch(/1 de 3 vistas/);
    // volver a girar no cuenta dos veces
    await userEvent.click(cards[0]);
    expect(dialog.textContent).toMatch(/1 de 3 vistas/);
    await userEvent.click(cards[1]);
    await userEvent.click(cards[2]);
    expect(within(dialog).getByRole('link', { name: /Ver HERMES/ })).toHaveAttribute('href', '/es/cases/hermes');
  });

  it('trae «Lo que aporto» completo como checklist', async () => {
    render(<BioDrawer />);
    await userEvent.click(screen.getByRole('button', { name: /mi forma de trabajar/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /Lo que aporto/ })).toBeInTheDocument();
    for (const k of ABOUT.skills) expect(within(dialog).getByText(k)).toBeInTheDocument();
  });
});
