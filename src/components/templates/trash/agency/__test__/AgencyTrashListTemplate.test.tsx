// import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// Custom render to wrap with router
const render = (ui: React.ReactElement) => rtlRender(ui, { wrapper: MemoryRouter });
import AgencyTrashListTemplate from '../AgencyTrashListTemplate';
import { useAgencyStore } from '../../../../stores/AgencyStore';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

jest.mock('../../../../stores/AgencyStore');
jest.mock('sweetalert2');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));

const mockAgencies = [
  { _id: '1', agencyName: 'Test Agency', name: 'John Doe', yourPhone: '1234567890', status: 'active' },
  { _id: '2', agencyName: 'Another Agency', name: 'Jane Smith', yourPhone: '0987654321', status: 'inactive' },
];

describe('AgencyTrashListTemplate', () => {
  let fetchTrashAgencies: jest.Mock;
  let restoreAgency: jest.Mock;
  let deleteAgencyPermanently: jest.Mock;

  beforeEach(() => {
    fetchTrashAgencies = jest.fn();
    restoreAgency = jest.fn();
    deleteAgencyPermanently = jest.fn();
  ((useAgencyStore as unknown) as jest.Mock).mockReturnValue({
      agencies: mockAgencies,
      fetchTrashAgencies,
      restoreAgency,
      deleteAgencyPermanently,
      totalPages: 1,
      loading: false,
      error: '',
    });
    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: true });
    (toast.error as jest.Mock).mockClear();
  });

  it('renders loader when loading', () => {
  ((useAgencyStore as unknown) as jest.Mock).mockReturnValueOnce({ ...useAgencyStore(), loading: true });
  render(<AgencyTrashListTemplate />);
    expect(screen.getByTestId('baz-loader')).toBeInTheDocument();
  });

  it('renders table with agencies', () => {
  render(<AgencyTrashListTemplate />);
    expect(screen.getByText('Test Agency')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Another Agency')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('filters agencies by search', () => {
  render(<AgencyTrashListTemplate />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Another' } });
    expect(screen.getByText('Another Agency')).toBeInTheDocument();
    expect(screen.queryByText('Test Agency')).not.toBeInTheDocument();
  });

  it('handles restore action', async () => {
  render(<AgencyTrashListTemplate />);
    const restoreBtn = screen.getAllByRole('button', { name: /restore/i })[0];
    fireEvent.click(restoreBtn);
    await waitFor(() => {
      expect(restoreAgency).toHaveBeenCalledWith('1');
      expect(fetchTrashAgencies).toHaveBeenCalled();
    });
  });

  it('handles permanent delete action', async () => {
  render(<AgencyTrashListTemplate />);
    const deleteBtn = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(deleteAgencyPermanently).toHaveBeenCalledWith('1');
      expect(fetchTrashAgencies).toHaveBeenCalled();
    });
  });

  it('shows error toast if error exists', () => {
  ((useAgencyStore as unknown) as jest.Mock).mockReturnValueOnce({ ...useAgencyStore(), error: 'Some error', loading: false });
  render(<AgencyTrashListTemplate />);
    expect(toast.error).toHaveBeenCalledWith('Some error');
  });

  it('handles pagination', () => {
  ((useAgencyStore as unknown) as jest.Mock).mockReturnValueOnce({
      ...useAgencyStore(),
      totalPages: 2,
      agencies: mockAgencies,
      loading: false,
      error: '',
    });
  render(<AgencyTrashListTemplate />);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });
});
