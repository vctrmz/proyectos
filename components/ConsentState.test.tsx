import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConsentState from './ConsentState';
import { CONSENT_KEY } from '@/lib/consent';

vi.mock('@/lib/consent', async (orig) => ({ ...(await orig<typeof import('@/lib/consent')>()), resetConsent: vi.fn() }));
import { resetConsent } from '@/lib/consent';

describe('ConsentState', () => {
  it('refleja la decisión guardada', () => {
    const { unmount } = render(<ConsentState />);
    expect(screen.getByText('sin decidir')).toBeInTheDocument();
    unmount();
    localStorage.setItem(CONSENT_KEY, `granted|${Date.now()}`);
    render(<ConsentState />);
    expect(screen.getByText('aceptadas')).toBeInTheDocument();
  });
  it('el botón deshace la decisión', () => {
    render(<ConsentState />);
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar mi decisión' }));
    expect(resetConsent).toHaveBeenCalled();
  });
});
