import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NewsLetterTrashListTemplate from '../NewsLetterTrashListTemplate';
import { useNewsLetterStore } from '../../../../stores/NewsLetterStore';
import { toast } from 'react-toastify';

jest.mock('../../../../stores/NewsLetterStore', () => ({
  useNewsLetterStore: jest.fn(),
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));
jest.mock('../../../../organisms/ManagementTable', () => (props: any) => (
  <div data-testid="table">
    {props.data.map((row: any) => (
      <div key={row._id} data-testid="row">
        <button onClick={() => props.onRestore(row)}>Restore</button>
        <button onClick={() => props.onPermanentDelete(row)}>Delete</button>
      </div>
    ))}
  </div>
));
jest.mock('../../../../molecules/TableHeader', () => (props: any) => (
  <div>
    <button onClick={() => props.onSelectFilter('active')}>Active</button>
    <button onClick={() => props.onSelectFilter('inactive')}>Inactive</button>
    <button onClick={() => props.onSelectFilter('total')}>Total</button>
    <input
      data-testid="search"
      value={props.searchTerm}
      onChange={e => props.onSearchChange(e.target.value)}
    />
  </div>
));
jest.mock('../../../../atoms/BAZ-Loader', () => () => <div>Loading...</div>);
jest.mock('../../../../atoms/BAZ-Pagination', () => () => <div>Pagination</div>);

describe('NewsLetterTrashListTemplate', () => {
  const mockFetchTrashNewsLetters = jest.fn();
  const mockRestoreNewsLetter = jest.fn();
  const mockDeleteNewsLetterPermanently = jest.fn();

  beforeEach(() => {
    (useNewsLetterStore as unknown as jest.Mock).mockReturnValue({
      newsLetters: [
        { _id: '1', name: 'Q1-Q', slug: 'q1-q', template: "testing", status: true },
        { _id: '2', name: 'Q2-Q', slug: 'q2-q', template: "testing template", status: true },
      ],
      fetchTrashNewsLetters: mockFetchTrashNewsLetters,
      restoreNewsLetter: mockRestoreNewsLetter,
      deleteNewsLetterPermanently: mockDeleteNewsLetterPermanently,
      totalPages: 1,
      loading: false,
      error: null,
      stats: { total: 2, active: 1, inactive: 1 },
    });
    jest.clearAllMocks();
  });

  it('renders table and filters', () => {
    render(
      <MemoryRouter>
        <NewsLetterTrashListTemplate />
      </MemoryRouter>
    );
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('calls onRestore when restore clicked', async () => {
    render(
      <MemoryRouter>
        <NewsLetterTrashListTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByText('Restore')[0]);
    await waitFor(() => {
      expect(mockRestoreNewsLetter).toHaveBeenCalledWith('1');
    });
  });

  it('calls onPermanentDelete when delete clicked', async () => {
    render(
      <MemoryRouter>
        <NewsLetterTrashListTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeleteNewsLetterPermanently).toHaveBeenCalledWith('1');
    });
  });

  it('handles search input change', () => {
    render(
      <MemoryRouter>
        <NewsLetterTrashListTemplate />
      </MemoryRouter>
    );
    const searchInput = screen.getByTestId('search') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Q1' } });
    expect(searchInput.value).toBe('Q1');
  });

  it('shows loader when loading', () => {
    (useNewsLetterStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      newsLetters: [],
      fetchTrashNewsLetters: jest.fn(),
      restoreNewsLetter: jest.fn(),
      deleteNewsLetterPermanently: jest.fn(),
      totalPages: 1,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(
      <MemoryRouter>
        <NewsLetterTrashListTemplate />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
