import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogCategoryTrashListTemplate from './blogCategoryTrashListTemplate';
import { useBlogCategoryStore } from '../../../stores/blogCategoryStore';
import { toast } from 'react-toastify';

// 🔹 Mock dependencies
jest.mock('../../../stores/blogCategoryStore', () => ({
  useBlogCategoryStore: jest.fn(),
}));
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
      onChange={(e) => props.onSearchChange(e.target.value)}
    />
  </div>
));
jest.mock('../../../atoms/BAZ-Loader', () => () => <div>Loading...</div>);
jest.mock('../../../atoms/BAZ-Pagination', () => () => <div>Pagination</div>);

describe('BlogCategoryTrashListTemplate', () => {
  const mockFetchTrashBlogCategory = jest.fn();
  const mockRestoreBlogCategory = jest.fn();
  const mockDeleteBlogCategoryPermanently = jest.fn();

  beforeEach(() => {
    (useBlogCategoryStore as unknown as jest.Mock).mockReturnValue({
      blogCategory: [
        { _id: '1', name: 'Cat1', slug: 'cat1' },
        { _id: '2', name: 'Cat2', slug: 'cat2' },
      ],
      fetchTrashBlogCategory: mockFetchTrashBlogCategory,
      restoreBlogCategory: mockRestoreBlogCategory,
      deleteBlogCategoryPermanently: mockDeleteBlogCategoryPermanently,
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
        <BlogCategoryTrashListTemplate />
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
        <BlogCategoryTrashListTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByText('Restore')[0]);
    await waitFor(() => {
      expect(mockRestoreBlogCategory).toHaveBeenCalledWith('1');
    });
  });

  it('calls onPermanentDelete when delete clicked', async () => {
    render(
      <MemoryRouter>
        <BlogCategoryTrashListTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeleteBlogCategoryPermanently).toHaveBeenCalledWith('1');
    });
  });

  it('shows loader when loading', () => {
    (useBlogCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      blogCategory: [],
      fetchTrashBlogCategory: jest.fn(),
      restoreBlogCategory: jest.fn(),
      deleteBlogCategoryPermanently: jest.fn(),
      totalPages: 1,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(
      <MemoryRouter>
        <BlogCategoryTrashListTemplate />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error toast when error exists', () => {
    (useBlogCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: false,
      blogCategory: [],
      fetchTrashBlogCategory: jest.fn(),
      restoreBlogCategory: jest.fn(),
      deleteBlogCategoryPermanently: jest.fn(),
      totalPages: 1,
      error: 'Something went wrong',
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(
      <MemoryRouter>
        <BlogCategoryTrashListTemplate />
      </MemoryRouter>
    );
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });
});
