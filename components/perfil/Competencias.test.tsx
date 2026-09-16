import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Competencias from './Competencias';
import { COMP_DATA } from '@/lib/data';

describe('Competencias', () => {
  it('pinta los cuatro grupos abiertos y cada cabecera los pliega', () => {
    render(<Competencias />);
    const lists = document.querySelectorAll('.comp-list');
    expect(lists).toHaveLength(4);
    lists.forEach((l) => expect(l).not.toHaveClass('is-shut'));
    expect(screen.getAllByText('06 competencias').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(COMP_DATA[1].name));
    expect(lists[1]).toHaveClass('is-shut');
    expect(lists[0]).not.toHaveClass('is-shut');
    fireEvent.click(screen.getByText(COMP_DATA[1].name));
    expect(lists[1]).not.toHaveClass('is-shut');
  });
});
