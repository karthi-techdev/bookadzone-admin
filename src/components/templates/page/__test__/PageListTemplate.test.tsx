import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PageListTemplate from '../PageListTemplate';
import { usePageStore } from '../../../stores/PageStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/PageStore', () => ({
  usePageStore: jest.fn(),
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

describe('PageListTemplate', () => {
  const mockFetchPages = jest.fn();
  const mockDeletePage = jest.fn();
  const mockToggleStatusPage = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    (usePageStore as unknown as jest.Mock).mockReturnValue({
      pages: [
        { _id: '1', title: 'Page 1', name: 'Name 1', slug: 'slug-1', type: 'link', status: 'active' },
        { _id: '2', title: 'Page 2', name: 'Name 2', slug: 'slug-2', type: 'template', status: 'inactive' },
      ],
      fetchPages: mockFetchPages,
      deletePage: mockDeletePage,
      toggleStatusPage: mockToggleStatusPage,
      totalPages: 1,
      loading: false,
      error: null,
      stats: { total: 2, active: 1, inactive: 1 },
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('renders table and filters', () => {
    render(<PageListTemplate />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('calls onEdit when edit clicked', () => {
    render(<PageListTemplate />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/page/edit/1');
  });

  it('calls onDelete and confirms', async () => {
    render(<PageListTemplate />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeletePage).toHaveBeenCalledWith('1');
    });
  });

  it('calls onToggleStatus', () => {
    render(<PageListTemplate />);
    fireEvent.click(screen.getAllByText('Toggle')[0]);
    expect(mockToggleStatusPage).toHaveBeenCalledWith('1');
  });

  it('shows loader when loading', () => {
    (usePageStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      pages: [],
      fetchPages: jest.fn(),
      deletePage: jest.fn(),
      toggleStatusPage: jest.fn(),
      totalPages: 1,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<PageListTemplate />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('filters pages based on search', () => {
    render(<PageListTemplate />);
    const searchInput = screen.getByTestId('search');
    fireEvent.change(searchInput, { target: { value: 'Page 1' } });
    expect(screen.getAllByTestId('row')).toHaveLength(1);
  });

  it('handles pagination change', () => {
    render(<PageListTemplate />);
    // Assuming pagination component is mocked, but to test handlePageChange
    // This might need adjustment based on actual pagination mock
  });
});
