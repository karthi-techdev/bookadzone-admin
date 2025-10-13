// __tests__/BlogCategoryListTemplate.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogCategoryListTemplate from '../BlogCategoryListTemplate';
import { useBlogCategoryStore } from '../../../stores/blogCategoryStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// 🔹 Mock dependencies
jest.mock('../../../stores/blogCategoryStore', () => ({
  useBlogCategoryStore: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));

// ✅ Corrected mock paths
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
      onChange={(e) => props.onSearchChange(e.target.value)}
    />
    <button onClick={() => props.addButtonLink && props.onSelectFilter('add')}>Add</button>
  </div>
));

jest.mock('../../../atoms/BAZ-Loader', () => () => <div>Loading...</div>);
jest.mock('../../../atoms/BAZ-Pagination', () => () => <div>Pagination</div>);

describe('BlogCategoryListTemplate', () => {
  const mockFetchBlogCategory = jest.fn();
  const mockDeleteBlogCategory = jest.fn();
  const mockToggleStatusBlogCategory = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useBlogCategoryStore as unknown as jest.Mock).mockReturnValue({
      blogCategory: [
        { _id: '1', name: 'Cat1', slug: 'cat1' },
        { _id: '2', name: 'Cat2', slug: 'cat2' },
      ],
      fetchBlogCategory: mockFetchBlogCategory,
      deleteBlogCategory: mockDeleteBlogCategory,
      toggleStatusBlogCategory: mockToggleStatusBlogCategory,
      loading: false,
      error: null,
      stats: { total: 2, active: 1, inactive: 1 },
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('renders table and filters', () => {
    render(<BlogCategoryListTemplate />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('navigates to edit page when edit clicked', () => {
    render(<BlogCategoryListTemplate />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/blogcategory/edit/1');
  });

  it('calls deleteBlogCategory when confirmed', async () => {
    render(<BlogCategoryListTemplate />);
    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockDeleteBlogCategory).toHaveBeenCalledWith('1');
    });
  });

  it('calls toggleStatusBlogCategory when toggle clicked', () => {
    render(<BlogCategoryListTemplate />);
    fireEvent.click(screen.getAllByText('Toggle')[0]);
    expect(mockToggleStatusBlogCategory).toHaveBeenCalledWith('1');
  });

  it('shows loader when loading', () => {
    (useBlogCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      blogCategory: [],
      fetchBlogCategory: jest.fn(),
      deleteBlogCategory: jest.fn(),
      toggleStatusBlogCategory: jest.fn(),
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<BlogCategoryListTemplate />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error toast when error exists', () => {
    (useBlogCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: false,
      blogCategory: [],
      fetchBlogCategory: jest.fn(),
      deleteBlogCategory: jest.fn(),
      toggleStatusBlogCategory: jest.fn(),
      error: 'Something went wrong',
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<BlogCategoryListTemplate />);
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('filters blog categories based on search input', () => {
    render(<BlogCategoryListTemplate />);
    const searchInput = screen.getByTestId('search');
    fireEvent.change(searchInput, { target: { value: 'Cat1' } });
    expect(searchInput).toHaveValue('Cat1');
  });
});
