import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScrollProgress from './ScrollProgress';
import TransitionTabs from './TransitionTabs';
import ImageComparison from './ImageComparison';
import { MorphingDialog, MorphingDialogTrigger, MorphingDialogContainer, MorphingDialogContent, MorphingDialogTitle, MorphingDialogClose } from './MorphingDialog';

/* Los primitivos adaptados de motion-primitives: lo que se comprueba es lo
   que el original no traía —teclado, ARIA y foco—, no la animación. */
describe('primitivos', () => {
  it('ScrollProgress es decorativa: no se anuncia', () => {
    const { container } = render(<ScrollProgress />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('TransitionTabs: pestañas de verdad, con flechas, Inicio y Fin', async () => {
    const u = userEvent.setup();
    render(<TransitionTabs label="Versiones" tabs={[
      { id: 'movil', label: 'Móvil', content: <p>Panel móvil</p> },
      { id: 'web', label: 'Web', content: <p>Panel web</p> },
      { id: 'kit', label: 'Kit', content: <p>Panel kit</p> },
    ]} />);
    expect(screen.getByRole('tablist', { name: 'Versiones' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Móvil' })).toHaveAttribute('aria-selected', 'true');
    await u.click(screen.getByRole('tab', { name: 'Web' }));
    await waitFor(() => expect(screen.getByText('Panel web')).toBeInTheDocument());
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Web');
    await u.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Kit' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Kit' })).toHaveAttribute('aria-selected', 'true');
    await u.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Móvil' })).toHaveAttribute('aria-selected', 'true');
    await u.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Kit' })).toHaveAttribute('aria-selected', 'true');
  });

  it('ImageComparison: el asa es un slider que se mueve con teclado', async () => {
    const u = userEvent.setup();
    render(<ImageComparison width={1600} height={1000} before={{ src: '/a.webp', alt: 'Pantalla anterior' }} after={{ src: '/b.webp', alt: 'Pantalla nueva' }} />);
    const asa = screen.getByRole('slider', { name: 'Comparar antes y después' });
    expect(asa).toHaveAttribute('aria-valuenow', '50');
    asa.focus();
    await u.keyboard('{ArrowRight}');
    expect(asa).toHaveAttribute('aria-valuenow', '55');
    await u.keyboard('{PageDown}');
    expect(asa).toHaveAttribute('aria-valuenow', '35');
    await u.keyboard('{End}');
    expect(asa).toHaveAttribute('aria-valuenow', '100');
    await u.keyboard('{Home}');
    expect(asa).toHaveAttribute('aria-valuetext', '0 % de antes');
    expect(screen.getByAltText('Pantalla anterior')).toBeInTheDocument();
    expect(screen.getByAltText('Pantalla nueva')).toBeInTheDocument();
  });

  it('MorphingDialog: se nombra por su título, Esc cierra y el foco vuelve', async () => {
    const u = userEvent.setup();
    render(
      <MorphingDialog>
        <MorphingDialogTrigger><MorphingDialogTitle>Pidemony</MorphingDialogTitle></MorphingDialogTrigger>
        <MorphingDialogContainer>
          <MorphingDialogContent>
            <MorphingDialogTitle>Pidemony</MorphingDialogTitle>
            <MorphingDialogClose />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>,
    );
    const abrir = screen.getByRole('button', { name: 'Pidemony' });
    await u.click(abrir);
    const dialogo = await screen.findByRole('dialog', { name: 'Pidemony' });
    expect(dialogo).toHaveAttribute('aria-modal', 'true');
    // un solo elemento con el id que nombra al diálogo
    expect(document.querySelectorAll(`[id="${dialogo.getAttribute('aria-labelledby')}"]`)).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus();
    await u.keyboard('{Escape}');
    // jsdom no termina la animación de salida: se comprueba el cierre, no el desmontaje
    await waitFor(() => expect(abrir).toHaveAttribute('aria-expanded', 'false'));
    expect(abrir).toHaveFocus();
  });
});
