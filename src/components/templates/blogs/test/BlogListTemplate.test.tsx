import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogListTemplate from '../BlogsListTemplate';
import { BrowserRouter } from 'react-router-dom';
import { useBlogStore } from '../../../stores/blogStore';
import { useBlogCategoryStore } from '../../../stores/blogCategoryStore';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

jest.mock('../../../stores/blogStore');
jest.mock('../../../stores/blogCategoryStore');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('BlogListTemplate', () => {
  const mockFetchBlogs = jest.fn();
  const mockDeleteBlog = jest.fn();
  const mockToggleStatusBlog = jest.fn();
  const mockFetchCategories = jest.fn();

  const mockBlogs = [
    {
      _id: '1',
      blogTitle: 'React Blog',
      blogCategory: 'cat1',
      seoTitle: 'React SEO',
      seoDescription: 'React Description',
      blogImg: '/img1.jpg',
    },
    {
      _id: '2',
      blogTitle: 'Vue Blog',
      blogCategory: 'cat2',
      seoTitle: 'Vue SEO',
      seoDescription: 'Vue Description',
      blogImg: '/img2.jpg',
    },
  ];

  const mockCategories = [
    { _id: 'cat1', name: 'Frontend' },
    { _id: 'cat2', name: 'JavaScript' },
  ];

  beforeEach(() => {
    (useBlogStore as unknown as jest.Mock).mockReturnValue({
      blogs: mockBlogs,
      fetchBlogs: mockFetchBlogs,
      deleteBlog: mockDeleteBlog,
      toggleStatusBlog: mockToggleStatusBlog,
      totalPages: 2,
      loading: false,
      error: null,
    });

    (useBlogCategoryStore as unknown as jest.Mock).mockReturnValue({
      blogCategory: mockCategories,
      fetchAllActiveBlogCategories: mockFetchCategories,
    });

    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <BlogListTemplate />
      </BrowserRouter>
    );

  it('renders blog list and category names', () => {
    renderComponent();
    expect(screen.getByText('Blogs')).toBeInTheDocument();
    expect(screen.getByText('React Blog')).toBeInTheDocument();
    expect(screen.getByText('Vue Blog')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('calls fetchAllActiveBlogCategories on mount', () => {
    renderComponent();
    expect(mockFetchCategories).toHaveBeenCalled();
  });

  it('filters blogs by search term', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Vue' },
    });
    expect(screen.queryByText('React Blog')).not.toBeInTheDocument();
    expect(screen.getByText('Vue Blog')).toBeInTheDocument();
  });

  it('shows full blog list when search returns no match', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Angular' },
    });
    expect(screen.getByText('React Blog')).toBeInTheDocument();
    expect(screen.getByText('Vue Blog')).toBeInTheDocument();
  });

  it('shows toast when error is present', () => {
    (useBlogStore as unknown as jest.Mock).mockReturnValue({
      blogs: [],
      fetchBlogs: jest.fn(),
      deleteBlog: jest.fn(),
      toggleStatusBlog: jest.fn(),
      totalPages: 1,
      loading: false,
      error: 'Something went wrong',
    });
    renderComponent();
    expect(toast.error).toHaveBeenCalledWith('Something went wrong', {
      position: 'top-right',
      autoClose: 3000,
    });
  });

  it('shows loader when loading is true', () => {
    (useBlogStore as unknown as jest.Mock).mockReturnValue({
      blogs: [],
      fetchBlogs: jest.fn(),
      deleteBlog: jest.fn(),
      toggleStatusBlog: jest.fn(),
      totalPages: 1,
      loading: true,
      error: null,
    });
    renderComponent();
    expect(screen.getByTestId('baz-loader')).toBeInTheDocument();
  });

  it('shows pagination when totalPages > 1', () => {
    renderComponent();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls fetchBlogs on page change', () => {
    renderComponent();
    fireEvent.click(screen.getByText('2'));
    expect(mockFetchBlogs).toHaveBeenCalledWith(2, expect.any(Number));
  });

  it('navigates to edit page on edit click', () => {
    renderComponent();
    fireEvent.click(screen.getAllByText(/edit/i)[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/blogs/edit/1');
  });

  it('toggles blog status on toggle click', () => {
    renderComponent();
    fireEvent.click(screen.getAllByText(/toggle/i)[0]);
    expect(mockToggleStatusBlog).toHaveBeenCalledWith('1');
  });

  it('confirms and deletes blog', async () => {
    renderComponent();
    fireEvent.click(screen.getAllByText(/delete/i)[0]);
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(mockDeleteBlog).toHaveBeenCalledWith('1');
      expect(mockFetchBlogs).toHaveBeenCalled();
    });
  });

  it('adjusts page after deleting last item on page', async () => {
    (useBlogStore as unknown as jest.Mock).mockReturnValue({
      blogs: [mockBlogs[0]],
      fetchBlogs: mockFetchBlogs,
      deleteBlog: mockDeleteBlog,
      toggleStatusBlog: mockToggleStatusBlog,
      totalPages: 1,
      loading: false,
      error: null,
    });

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'React' },
    });
    fireEvent.click(screen.getAllByText(/delete/i)[0]);

    await waitFor(() => {
      expect(mockDeleteBlog).toHaveBeenCalledWith('1');
      expect(mockFetchBlogs).toHaveBeenCalled();
    });
  });

  it('does not delete blog when confirmation is cancelled', async () => {
    (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: false });
    renderComponent();
    fireEvent.click(screen.getAllByText(/delete/i)[0]);
    await waitFor(() => {
      expect(mockDeleteBlog).not.toHaveBeenCalled();
    });
  });
  it('shows full blog list when search returns no match', () => {
  renderComponent();
  fireEvent.change(screen.getByPlaceholderText(/search/i), {
    target: { value: 'Angular' },
  });
  expect(screen.getByText('React Blog')).toBeInTheDocument();
  expect(screen.getByText('Vue Blog')).toBeInTheDocument();
});
it('does not delete blog when confirmation is cancelled', async () => {
  (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: false });
  renderComponent();
  fireEvent.click(screen.getAllByText(/delete/i)[0]);
  await waitFor(() => {
    expect(useBlogStore().deleteBlog).not.toHaveBeenCalled();
  });
});
it('adjusts page after deleting last item on page', async () => {
  (useBlogStore as unknown as jest.Mock).mockReturnValue({
    blogs: [mockBlogs[0]],
    fetchBlogs: mockFetchBlogs,
    deleteBlog: mockDeleteBlog,
    toggleStatusBlog: mockToggleStatusBlog,
    totalPages: 1,
    loading: false,
    error: null,
  });

  renderComponent();
  fireEvent.change(screen.getByPlaceholderText(/search/i), {
    target: { value: 'React' },
  });
  fireEvent.click(screen.getAllByText(/delete/i)[0]);

  await waitFor(() => {
    expect(mockDeleteBlog).toHaveBeenCalledWith('1');
    expect(mockFetchBlogs).toHaveBeenCalled();
  });
});
it('renders fallback when blogImg is empty', () => {
  (useBlogStore as unknown as jest.Mock).mockReturnValue({
    blogs: [
      {
        _id: '3',
        blogTitle: 'Empty Image Blog',
        blogCategory: 'cat1',
        seoTitle: 'Empty SEO',
        seoDescription: 'Empty Desc',
        blogImg: '',
      },
    ],
    fetchBlogs: jest.fn(),
    deleteBlog: jest.fn(),
    toggleStatusBlog: jest.fn(),
    totalPages: 1,
    loading: false,
    error: null,
  });

  renderComponent();
  expect(screen.getByText('-')).toBeInTheDocument();
});
it('renders raw category value if categoryMap lookup fails', () => {
  (useBlogStore as unknown as jest.Mock).mockReturnValue({
    blogs: [
      {
        _id: '3',
        blogTitle: 'Unknown Category Blog',
        blogCategory: 'unknown-cat',
        seoTitle: 'SEO',
        seoDescription: 'Desc',
        blogImg: '/img.jpg',
      },
    ],
    fetchBlogs: jest.fn(),
    deleteBlog: jest.fn(),
    toggleStatusBlog: jest.fn(),
    totalPages: 1,
    loading: false,
    error: null,
  });

  (useBlogCategoryStore as unknown as jest.Mock).mockReturnValue({
    blogCategory: [],
    fetchAllActiveBlogCategories: jest.fn(),
  });

  renderComponent();
  expect(screen.getByText('unknown-cat')).toBeInTheDocument();
});

});