import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FaqTrashListTemplate from './FaqTrashListTemplate';
import { useFaqStore } from '../../../stores/faqStore';
import { toast } from 'react-toastify';

jest.mock('../../../stores/faqStore');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));
jest.mock('../../../organisms/ManagementTable', () => (props: any) => (
  <div data-testid="table">
    {props.data.map((row: any) => (
      <div key={row._id} data-testid="row">
        <button onClick={() => props.onRestore(row)}>Restore</button>
        <button onClick={() => props.onPermanentDelete(row)}>Delete</button>
      </div>
    ))}
  </div>
));
jest.mock('../../../molecules/TableHeader', () => (props: any) => (
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
jest.mock('../../../atoms/BAZ-Loader', () => () => <div>Loading...</div>);
jest.mock('../../../atoms/BAZ-Pagination', () => () => <div>Pagination</div>);

describe('FaqTrashListTemplate', () => {
  const mockFetchTrashFaqs = jest.fn();
  const mockRestoreFaq = jest.fn();
  const mockDeleteFaqPermanently = jest.fn();
  beforeEach(() => {
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      faqs: [
        { _id: '1', question: 'Q1', answer: 'A1', status: true },
        { _id: '2', question: 'Q2', answer: 'A2', status: false },
      ],
      fetchTrashFaqs: mockFetchTrashFaqs,
      restoreFaq: mockRestoreFaq,
      deleteFaqPermanently: mockDeleteFaqPermanently,
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
        <FaqTrashListTemplate />
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
        <FaqTrashListTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByText('Restore')[0]);
    await waitFor(() => {
      expect(mockRestoreFaq).toHaveBeenCalledWith('1');
    });
  });

  it('calls onPermanentDelete when delete clicked', async () => {
    render(
      <MemoryRouter>
        <FaqTrashListTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeleteFaqPermanently).toHaveBeenCalledWith('1');
    });
  });

  it('shows loader when loading', () => {
    (useFaqStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      faqs: [],
      fetchTrashFaqs: jest.fn(),
      restoreFaq: jest.fn(),
      deleteFaqPermanently: jest.fn(),
      totalPages: 1,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(
      <MemoryRouter>
        <FaqTrashListTemplate />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
