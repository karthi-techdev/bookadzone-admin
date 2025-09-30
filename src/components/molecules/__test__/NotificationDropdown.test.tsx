
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationDropdown from '../NotificationDropdown';
import { MemoryRouter } from 'react-router-dom';

describe('NotificationDropdown', () => {
  it('renders notification bell', () => {
    render(
      <MemoryRouter>
        <NotificationDropdown />
      </MemoryRouter>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows notifications when clicked', () => {
    render(
      <MemoryRouter>
        <NotificationDropdown />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});
