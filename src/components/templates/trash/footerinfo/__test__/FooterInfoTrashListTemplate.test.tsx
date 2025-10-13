import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FooterInfoTrashListTemplate from '../FooterInfoTrashListTemplate';
import { useFooterStore } from '../../../../stores/FooterInfoStore';
import { BrowserRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

jest.mock('../../../../stores/FooterInfoStore');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() }, ToastContainer: () => <div /> }));
jest.mock('sweetalert2', () => ({ fire: jest.fn() }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('FooterInfoTrashListTemplate', () => {
  const mockFetchTrashFooters = jest.fn();
  const mockRestoreFooterInfo = jest.fn();
  const mockDeleteFooterInfoPermanently = jest.fn();
  const defaultFooters = [
    {
      _id: '1',
      description: 'Trash Footer 1',
      socialmedia: 'Facebook',
      logo: 'logo1.png',
      status: true,
    },
    {
      _id: '2',
      description: 'Trash Footer 2',
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
      fetchTrashFooters: mockFetchTrashFooters,
      restoreFooterInfo: mockRestoreFooterInfo,
      deleteFooterInfoPermanently: mockDeleteFooterInfoPermanently,
      loading: false,
      error: '',
      stats: defaultStats,
    });
  });

  function renderWithRouter() {
    return render(
      <BrowserRouter>
        <FooterInfoTrashListTemplate />
      </BrowserRouter>
    );
  }

  it('renders table header and trash footers', () => {
    renderWithRouter();
    expect(screen.getAllByText('Footer Info').length).toBeGreaterThan(0);
    expect(screen.getByText('Trash Footer 1')).toBeInTheDocument();
    expect(screen.getByText('Trash Footer 2')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    ((useFooterStore as unknown) as jest.Mock).mockReturnValue({
      ...useFooterStore(),
      loading: true,
    });
    renderWithRouter();
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

  it('filters trash footers by search term', () => {
    renderWithRouter();
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Trash Footer 1' } });
    expect(screen.getByText('Trash Footer 1')).toBeInTheDocument();
    expect(screen.queryByText('Trash Footer 2')).not.toBeInTheDocument();
  });

  it('calls restoreFooterInfo and shows Swal on restore', async () => {
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });
    renderWithRouter();
    const restoreButtons = screen.getAllByRole('button', { name: /restore/i });
    fireEvent.click(restoreButtons[0]);
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(mockRestoreFooterInfo).toHaveBeenCalledWith('1');
    });
  });

  it('calls deleteFooterInfoPermanently and shows Swal on permanent delete', async () => {
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });
    renderWithRouter();
    // The button label is 'Permanent Delete'
    const deleteButtons = screen.getAllByRole('button', { name: /permanent delete/i });
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(mockDeleteFooterInfoPermanently).toHaveBeenCalledWith('1');
    });
  });

  it('shows no data message if list is empty', () => {
    ((useFooterStore as unknown) as jest.Mock).mockReturnValue({
      ...useFooterStore(),
      footers: [],
      loading: false,
      error: '',
      stats: { total: 0, active: 0, inactive: 0 },
    });
    renderWithRouter();
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });
});
