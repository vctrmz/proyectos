import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FindingsTable } from './CaseBlocks';

describe('FindingsTable', () => {
  it('la tabla con scroll horizontal es una región enfocable con nombre', () => {
    render(<FindingsTable items={[{ n: '01', title: 'T', body: 'B', rule: 'R', severity: 'alta', where: 'W' }]} />);
    const region = screen.getByRole('region', { name: /Hallazgos ordenados por severidad/ });
    expect(region).toHaveAttribute('tabindex', '0');
  });
});
