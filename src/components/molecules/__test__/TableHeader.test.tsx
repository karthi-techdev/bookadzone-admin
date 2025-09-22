import { render, screen, fireEvent } from '@testing-library/react';
import TableHeader from '../TableHeader';
import { MemoryRouter } from 'react-router-dom';

describe('TableHeader', () => {
  it('renders managementName', () => {
    render(
      <MemoryRouter>
        <TableHeader managementName="Users" onSearchChange={() => {}} />
      </MemoryRouter>
    );
    // Use getByRole to specifically target the heading
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
  });

  it('calls onSearchChange', () => {
    const onSearchChange = jest.fn();
    render(
      <MemoryRouter>
        <TableHeader managementName="Users" onSearchChange={onSearchChange} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'abc' } });
    expect(onSearchChange).toHaveBeenCalledWith('abc');
  });
});
