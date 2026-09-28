import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar search validation', () => {
  it('shows no validation message before the user types anything', async () => {
    renderNavbar();

    await screen.findByPlaceholderText('Search Movie');
    expect(screen.queryByText('Type at least 2 characters')).not.toBeInTheDocument();
  });

  it('shows a validation message for a single-character query', async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.type(screen.getByPlaceholderText('Search Movie'), 'a');

    expect(await screen.findByText('Type at least 2 characters')).toBeInTheDocument();
  });

  it('clears the validation message once the query is long enough', async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.type(screen.getByPlaceholderText('Search Movie'), 'a');
    expect(await screen.findByText('Type at least 2 characters')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search Movie'), 'b');
    expect(screen.queryByText('Type at least 2 characters')).not.toBeInTheDocument();
  });

  it('clears the validation message once the query is emptied out', async () => {
    const user = userEvent.setup();
    renderNavbar();

    const input = screen.getByPlaceholderText('Search Movie');
    await user.type(input, 'a');
    expect(await screen.findByText('Type at least 2 characters')).toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText('Search Movie'));
    expect(screen.queryByText('Type at least 2 characters')).not.toBeInTheDocument();
  });
});
