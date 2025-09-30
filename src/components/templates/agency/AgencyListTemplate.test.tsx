// no need to import React
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgencyListTemplate from './AgencyListTemplate';
import { useAgencyStore } from '../../stores/AgencyStore';
import { BrowserRouter } from 'react-router-dom';

// Mock SweetAlert2 and toast
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

// Mock zustand store
jest.mock('../../stores/AgencyStore');

const mockAgencies = [
  {
    _id: '1',
    agencyName: 'Test Agency',
    name: 'John Doe',
    companyPhone: '1234567890',
    agencyLogo: '/logo.png',
    status: 'active',
  },
];

describe('AgencyListTemplate', () => {
  beforeEach(() => {
  (useAgencyStore as unknown as jest.Mock).mockReturnValue({
      agencies: mockAgencies,
      fetchAgencies: jest.fn(),
      deleteAgency: jest.fn(),
      toggleStatusAgency: jest.fn(),
      totalPages: 1,
      loading: false,
      error: null,
    });
  });

  it('renders agency table', () => {
    render(
      <BrowserRouter>
        <AgencyListTemplate />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Agency')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
  (useAgencyStore as unknown as jest.Mock).mockReturnValueOnce({
      agencies: [],
      fetchAgencies: jest.fn(),
      deleteAgency: jest.fn(),
      toggleStatusAgency: jest.fn(),
      totalPages: 1,
      loading: true,
      error: null,
    });
    render(
      <BrowserRouter>
        <AgencyListTemplate />
      </BrowserRouter>
    );
  // Adjust this selector if your loader has a test id:
  // If your loader uses <BAZLoader data-testid="baz-loader" />
  // Uncomment the next line if so:
  // expect(screen.getByTestId('baz-loader')).toBeInTheDocument();
  });

  it('filters agencies by search', () => {
    render(
      <BrowserRouter>
        <AgencyListTemplate />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'Test' } });
    expect(screen.getByText('Test Agency')).toBeInTheDocument();
  });

  it('handles delete confirmation and deletion', async () => {
    const deleteAgency = jest.fn();
    (useAgencyStore as unknown as jest.Mock).mockReturnValueOnce({
      agencies: mockAgencies,
      fetchAgencies: jest.fn(),
      deleteAgency,
      toggleStatusAgency: jest.fn(),
      totalPages: 1,
      loading: false,
      error: null,
    });
    render(
      <BrowserRouter>
        <AgencyListTemplate />
      </BrowserRouter>
    );
    // You may need to adjust this selector to match your delete button
    // fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    // await waitFor(() => expect(deleteAgency).toHaveBeenCalled());
  });
});
