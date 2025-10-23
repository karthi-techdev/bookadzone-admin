// no need to import React
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useBlogStore } from '../../../../stores/blogStore';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import BlogTrashListTemplate from '../BlogTrashListTemplate';

// Wraps UI with router
const render = (ui: React.ReactElement) => rtlRender(ui, { wrapper: MemoryRouter });

// 🧩 Mocks
jest.mock('sweetalert2');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
jest.mock('../../../../stores/blogStore');

const mockBlogs = [
  {
    _id: '1',
    blogTitle: 'React Blog',
    seoTitle: 'React SEO',
    seoDescription: 'React Description',
    status: 'active',
  },
  {
    _id: '2',
    blogTitle: 'Vue Blog',
    seoTitle: 'Vue SEO',
    seoDescription: 'Vue Description',
    status: 'inactive',
  },
];

describe('BlogTrashListTemplate', () => {
  let fetchTrashBlogs: jest.Mock;
  let restoreBlog: jest.Mock;
  let deleteBlogPermanently: jest.Mock;

  beforeEach(() => {
    fetchTrashBlogs = jest.fn();
    restoreBlog = jest.fn();
    deleteBlogPermanently = jest.fn();

    (useBlogStore as unknown as jest.Mock).mockReturnValue({
      blogs: mockBlogs,
      fetchTrashBlogs,
      restoreBlog,
      deleteBlogPermanently,
      totalPages: 1,
      loading: false,
      error: '',
    });

    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: true });
    (toast.error as jest.Mock).mockClear();
  });

  it('renders loader when loading', () => {
    (useBlogStore as unknown as jest.Mock).mockReturnValueOnce({
      blogs: [],
      fetchTrashBlogs,
      restoreBlog,
      deleteBlogPermanently,
      totalPages: 1,
      loading: true,
      error: '',
    });
    render(<BlogTrashListTemplate />);
    expect(screen.getByTestId('baz-loader')).toBeInTheDocument();
  });

  it('renders blogs in table', () => {
    render(<BlogTrashListTemplate />);
    expect(screen.getByText('React Blog')).toBeInTheDocument();
    expect(screen.getByText('Vue Blog')).toBeInTheDocument();
    expect(screen.getByText('React SEO')).toBeInTheDocument();
    expect(screen.getByText('Vue SEO')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('filters blogs by search term', () => {
    render(<BlogTrashListTemplate />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Vue' } });
    expect(screen.getByText('Vue Blog')).toBeInTheDocument();
    expect(screen.queryByText('React Blog')).not.toBeInTheDocument();
  });

  it('shows all blogs when search has no match', () => {
    render(<BlogTrashListTemplate />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Angular' },
    });
    expect(screen.getByText('React Blog')).toBeInTheDocument();
    expect(screen.getByText('Vue Blog')).toBeInTheDocument();
  });

  it('handles restore confirmation and action', async () => {
    render(<BlogTrashListTemplate />);
    const restoreBtn = screen.getAllByRole('button', { name: /restore/i })[0];
    fireEvent.click(restoreBtn);
    await waitFor(() => {
      expect(restoreBlog).toHaveBeenCalledWith('1');
      expect(fetchTrashBlogs).toHaveBeenCalled();
    });
  });

  it('does not restore when cancelled', async () => {
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: false });
    render(<BlogTrashListTemplate />);
    const restoreBtn = screen.getAllByRole('button', { name: /restore/i })[0];
    fireEvent.click(restoreBtn);
    await waitFor(() => {
      expect(restoreBlog).not.toHaveBeenCalled();
      expect(fetchTrashBlogs).not.toHaveBeenCalled();
    });
  });

  it('handles permanent delete confirmation and action', async () => {
    render(<BlogTrashListTemplate />);
    const deleteBtn = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(deleteBlogPermanently).toHaveBeenCalledWith('1');
      expect(fetchTrashBlogs).toHaveBeenCalled();
    });
  });

  it('does not delete permanently when cancelled', async () => {
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: false });
    render(<BlogTrashListTemplate />);
    const deleteBtn = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(deleteBlogPermanently).not.toHaveBeenCalled();
      expect(fetchTrashBlogs).not.toHaveBeenCalled();
    });
  });

  it('shows toast error when error exists', () => {
    (useBlogStore as unknown as jest.Mock).mockReturnValueOnce({
      blogs: [],
      fetchTrashBlogs,
      restoreBlog,
      deleteBlogPermanently,
      totalPages: 1,
      loading: false,
      error: 'Something went wrong',
    });
    render(<BlogTrashListTemplate />);
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('renders pagination when totalPages > 1', () => {
    (useBlogStore as unknown as jest.Mock).mockReturnValueOnce({
      blogs: mockBlogs,
      fetchTrashBlogs,
      restoreBlog,
      deleteBlogPermanently,
      totalPages: 2,
      loading: false,
      error: '',
    });
    render(<BlogTrashListTemplate />);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls fetchTrashBlogs on pagination change', () => {
    render(<BlogTrashListTemplate />);
    const nextBtn = screen.getByText('1');
    fireEvent.click(nextBtn);
    expect(fetchTrashBlogs).toHaveBeenCalled();
  });
});
