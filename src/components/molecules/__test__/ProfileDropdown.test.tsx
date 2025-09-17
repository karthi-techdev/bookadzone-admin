
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileDropdown from '../ProfileDropdown';
import { MemoryRouter } from 'react-router-dom';

describe('ProfileDropdown', () => {
  it('renders profile button', () => {
    render(
      <MemoryRouter>
        <ProfileDropdown />
      </MemoryRouter>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows dropdown when clicked', () => {
    render(
      <MemoryRouter>
        <ProfileDropdown />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
