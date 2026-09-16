import { StrictMode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { CONSENT_KEY } from '@/lib/consent';

const path = { current: '/' };
vi.mock('next/navigation', () => ({ usePathname: () => path.current }));

import AnalyticsPageView from './AnalyticsPageView';

describe('AnalyticsPageView', () => {
  beforeEach(() => {
    path.current = '/';
    (window as unknown as { gtag?: unknown }).gtag = vi.fn();
  });

  it('con consentimiento, no envía nada al montar (ni en StrictMode) y uno solo al cambiar de ruta', () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    const gtag = (window as unknown as { gtag: ReturnType<typeof vi.fn> }).gtag;
    const { rerender } = render(
      <StrictMode>
        <AnalyticsPageView />
      </StrictMode>
    );
    expect(gtag).not.toHaveBeenCalled();
    path.current = '/perfil';
    rerender(
      <StrictMode>
        <AnalyticsPageView />
      </StrictMode>
    );
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({ page_path: '/perfil' }));
  });

  it('sin consentimiento (denied), no envía nada aunque cambie la ruta', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    const gtag = (window as unknown as { gtag: ReturnType<typeof vi.fn> }).gtag;
    const { rerender } = render(
      <StrictMode>
        <AnalyticsPageView />
      </StrictMode>
    );
    path.current = '/perfil';
    rerender(
      <StrictMode>
        <AnalyticsPageView />
      </StrictMode>
    );
    expect(gtag).not.toHaveBeenCalled();
  });
});
