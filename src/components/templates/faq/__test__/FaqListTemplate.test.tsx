import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FaqListTemplate from '../FaqListTemplate';
import { useFaqStore } from '../../../stores/FaqStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/FaqStore', () => ({
  useFaqStore: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));
jest.mock('../../../organisms/ManagementTable', () => (props: any) => (
  <div data-testid="table">
    {props.data.map((row: any) => (
      <div key={row._id} data-testid="row">
        <button onClick={() => props.onEdit(row)}>Edit</button>
        <button onClick={() => props.onDelete(row)}>Delete</button>
        <button onClick={() => props.onToggleStatus(row)}>Toggle</button>
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
    <button onClick={() => props.addButtonLink && props.onSelectFilter('add')}>Add</button>
  </div>
));
jest.mock('../../../atoms/BAZ-Loader', () => () => <div>Loading...</div>);
jest.mock('../../../atoms/BAZ-Pagination', () => () => <div>Pagination</div>);

describe('FaqListTemplate', () => {
  const mockFetchFaqs = jest.fn();
  const mockDeleteFaq = jest.fn();
  const mockToggleStatusFaq = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    (useFaqStore as unknown as jest.Mock).mockReturnValue({
      faqs: [
        { _id: '1', question: 'Q1', answer: 'A1', status: true, priority: 1 },
        { _id: '2', question: 'Q2', answer: 'A2', status: false, priority: 2 },
      ],
      fetchFaqs: mockFetchFaqs,
      deleteFaq: mockDeleteFaq,
      toggleStatusFaq: mockToggleStatusFaq,
      totalPages: 1,
      loading: false,
      error: null,
      stats: { total: 2, active: 1, inactive: 1 },
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('renders table and filters', () => {
    render(<FaqListTemplate />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('calls onEdit when edit clicked', () => {
    render(<FaqListTemplate />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/faq/edit/1');
  });

  it('calls onDelete and confirms', async () => {
    render(<FaqListTemplate />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeleteFaq).toHaveBeenCalledWith('1');
    });
  });

  it('calls onToggleStatus', () => {
    render(<FaqListTemplate />);
    fireEvent.click(screen.getAllByText('Toggle')[0]);
    expect(mockToggleStatusFaq).toHaveBeenCalledWith('1');
  });

  it('shows loader when loading', () => {
    (useFaqStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      faqs: [],
      fetchFaqs: jest.fn(),
      deleteFaq: jest.fn(),
      toggleStatusFaq: jest.fn(),
      totalPages: 1,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<FaqListTemplate />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
