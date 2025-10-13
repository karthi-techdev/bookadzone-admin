import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FooterListTemplate from '../FooterInfoListTemplate';
import { useFooterStore } from '../../../stores/FooterInfoStore';
import { BrowserRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

jest.mock('../../../stores/FooterInfoStore');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() }, ToastContainer: () => <div /> }));
jest.mock('sweetalert2', () => ({ fire: jest.fn() }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('FooterListTemplate', () => {
  const mockFetchFooters = jest.fn();
  const mockDeleteFooter = jest.fn();
  const defaultFooters = [
    {
      _id: '1',
      description: 'Footer 1',
      socialmedia: 'Facebook',
      logo: 'logo1.png',
      status: true,
    },
    {
      _id: '2',
      description: 'Footer 2',
      socialmedia: 'Twitter',
      logo: 'logo2.png',
      status: false,
    },
  ];
  const defaultStats = { total: 2, active: 1, inactive: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
    ((useFooterStore as unknown) as jest.Mock).mockReturnValue({
      footers: defaultFooters,
      fetchFooters: mockFetchFooters,
      deleteFooter: mockDeleteFooter,
      loading: false,
      error: '',
      stats: defaultStats,
    });
  });

  function renderWithRouter() {
    return render(
      <BrowserRouter>
        <FooterListTemplate />
      </BrowserRouter>
    );
  }

  it('renders table header and footers', () => {
  renderWithRouter();
  // Check for the header text - we expect multiple instances
  expect(screen.getAllByText('Footer Info')).toHaveLength(2);
  expect(screen.getByText('Footer 1')).toBeInTheDocument();
  expect(screen.getByText('Footer 2')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    ((useFooterStore as unknown) as jest.Mock).mockReturnValue({
      ...useFooterStore(),
      loading: true,
    });
    renderWithRouter();
    // Loader is a custom component, check for its test id or fallback to class
    expect(screen.getByTestId('baz-loader')).toBeInTheDocument();
  });

  it('shows error toast when error exists', () => {
    ((useFooterStore as unknown) as jest.Mock).mockReturnValue({
      ...useFooterStore(),
      error: 'Test error',
    });
    renderWithRouter();
    expect(toast.error).toHaveBeenCalledWith('Test error', expect.any(Object));
  });

  it('filters footers by search term', async () => {
    renderWithRouter();
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Footer 1' } });
    expect(screen.getByText('Footer 1')).toBeInTheDocument();
    expect(screen.queryByText('Footer 2')).not.toBeInTheDocument();
  });

  it('navigates to add page on add button click', () => {
  renderWithRouter();
  // The add button is a link styled as a button
  const addLink = screen.getByRole('link', { name: /add/i });
  expect(addLink).toHaveAttribute('href', '/footerinfo/add');
  });

  it('navigates to edit page on edit', () => {
    renderWithRouter();
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/footerinfo/edit/1');
  });

  it('calls deleteFooter and shows Swal on delete', async () => {
    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: true });
    renderWithRouter();
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(mockDeleteFooter).toHaveBeenCalledWith('1');
    });
  });

  it('shows no footers found if list is empty', () => {
    ((useFooterStore as unknown) as jest.Mock).mockReturnValue({
      ...useFooterStore(),
      footers: [],
      loading: false,
      error: '',
      stats: { total: 0, active: 0, inactive: 0 },
    });
    renderWithRouter();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
