import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsLetterListTemplate from '../NewsLetterListTemplate';
import { useNewsLetterStore } from '../../../stores/NewsLetterStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/NewsLetterStore', () => ({
  useNewsLetterStore: jest.fn(),
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

describe('NewsLetterListTemplate', () => {
  const mockFetchNewsLetters = jest.fn();
  const mockDeleteNewsLetter = jest.fn();
  const mockToggleStatusNewsLetter = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    (useNewsLetterStore as unknown as jest.Mock).mockReturnValue({
      newsLetters: [
        { _id: '1', name: 'N1', slug: 'N1',template:"testing" ,status: true},
        { _id: '2', name: 'N2', slug: 'N3',template:"testing-2" ,status: true},
      ],
      fetchNewsLetters: mockFetchNewsLetters,
      deleteNewsLetter: mockDeleteNewsLetter,
      toggleStatusNewsLetter: mockToggleStatusNewsLetter,
      totalPages: 1,
      loading: false,
      error: null,
      stats: { total: 2, active: 1, inactive: 1 },
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('renders table and filters', () => {
    render(<NewsLetterListTemplate />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('calls onEdit when edit clicked', () => {
    render(<NewsLetterListTemplate />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/newsletter/edit/1');
  });

  it('calls onDelete and confirms', async () => {
    render(<NewsLetterListTemplate />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeleteNewsLetter).toHaveBeenCalledWith('1');
    });
  });

  it('calls onToggleStatus', () => {
    render(<NewsLetterListTemplate />);
    fireEvent.click(screen.getAllByText('Toggle')[0]);
    expect(mockToggleStatusNewsLetter).toHaveBeenCalledWith('1');
  });

  it('shows loader when loading', () => {
    (useNewsLetterStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      newsLetters: [],
      fetchNewsLetters: jest.fn(),
      deleteNewsLetter: jest.fn(),
      toggleStatusNewsLetter: jest.fn(),
      totalPages: 1,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<NewsLetterListTemplate />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
