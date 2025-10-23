// __tests__/BlogsFormTemplate.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import BlogsFormTemplate from '../BlogsFormTemplate';
import { useBlogStore } from '../../../stores/blogStore';
import { useBlogCategoryStore } from '../../../stores/blogCategoryStore';

// 🔧 Mocks
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

jest.mock('../../../stores/blogStore');
jest.mock('../../../stores/blogCategoryStore');

const mockUseBlogStore = useBlogStore as jest.MockedFunction<typeof useBlogStore>;
const mockUseBlogCategoryStore = useBlogCategoryStore as jest.MockedFunction<typeof useBlogCategoryStore>;

describe('BlogsFormTemplate', () => {
  let mockAddBlog: jest.Mock;
  let mockUpdateBlog: jest.Mock;
  let mockFetchBlogById: jest.Mock;
  let mockFetchAllActiveBlogCategories: jest.Mock;

  beforeEach(() => {
    mockAddBlog = jest.fn().mockResolvedValue({});
    mockUpdateBlog = jest.fn().mockResolvedValue({});
    mockFetchBlogById = jest.fn().mockResolvedValue({
      _id: '123',
      seoTitle: 'Old SEO Title',
      seoDescription: 'Old SEO Desc',
      blogTitle: 'Old Blog Title',
      blogCategory: '1',
      blogDescription: 'Old Blog Content',
      blogImg: 'old.jpg',
    });
    mockFetchAllActiveBlogCategories = jest.fn().mockResolvedValue({});

    mockUseBlogStore.mockReturnValue({
      fetchBlogById: mockFetchBlogById,
      addBlog: mockAddBlog,
      updateBlog: mockUpdateBlog,
    } as any);

    mockUseBlogCategoryStore.mockReturnValue({
      blogCategory: [{ name: 'Tech', _id: '1' }, { name: 'Health', _id: '2' }],
      fetchAllActiveBlogCategories: mockFetchAllActiveBlogCategories,
    } as any);

    jest.clearAllMocks();
  });

  // 🧪 1. Render Add mode
  it('renders Add mode correctly', () => {
    render(
      <BrowserRouter>
        <BlogsFormTemplate />
      </BrowserRouter>
    );
    expect(screen.getByText('Add Blog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  // 🧪 2. Render Edit mode + pre-fill data
  it('renders Edit mode with pre-filled data', async () => {
    render(
      <MemoryRouter initialEntries={['/blog/edit/123']}>
        <Routes>
          <Route path="/blog/edit/:id" element={<BlogsFormTemplate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Old SEO Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Old Blog Title')).toBeInTheDocument();
    });
  });

  // 🧪 3. Validation errors for empty fields
  it('shows validation errors when required fields are missing', async () => {
    render(
      <BrowserRouter>
        <BlogsFormTemplate />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please fix all validation errors');
    });
  });

  // 🧪 4. Successful Add
  it('submits form successfully in Add mode', async () => {
    render(
      <BrowserRouter>
        <BlogsFormTemplate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/SEO Title/i), { target: { value: 'SEO Title' } });
    fireEvent.change(screen.getByLabelText(/SEO Description/i), { target: { value: 'SEO Description' } });
    fireEvent.change(screen.getByLabelText(/Blog Title/i), { target: { value: 'New Blog' } });
    fireEvent.change(screen.getByLabelText(/Blog Category/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Blog Description/i), { target: { value: 'Content' } });
    fireEvent.change(screen.getByLabelText(/Blog Image/i), {
      target: { files: [new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })] },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(mockAddBlog).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'Blog added successfully' })
      );
    });
  });

  // 🧪 5. Successful Edit
  it('submits form successfully in Edit mode', async () => {
    render(
      <MemoryRouter initialEntries={['/blog/edit/123']}>
        <Routes>
          <Route path="/blog/edit/:id" element={<BlogsFormTemplate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue('Old SEO Title'));
    fireEvent.change(screen.getByLabelText(/SEO Title/i), { target: { value: 'Updated SEO Title' } });
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(mockUpdateBlog).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ text: 'Blog updated successfully' })
      );
    });
  });

  // 🧪 6. Handles backend validation error array
  it('shows validation errors returned from backend', async () => {
    mockAddBlog.mockRejectedValueOnce({
      response: { data: { errors: [{ path: 'blogTitle', message: 'Invalid title' }] } },
    });

    render(
      <BrowserRouter>
        <BlogsFormTemplate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/SEO Title/i), { target: { value: 'SEO Title' } });
    fireEvent.change(screen.getByLabelText(/SEO Description/i), { target: { value: 'SEO Description' } });
    fireEvent.change(screen.getByLabelText(/Blog Title/i), { target: { value: 'Title' } });
    fireEvent.change(screen.getByLabelText(/Blog Category/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Blog Description/i), { target: { value: 'Description' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('blogTitle: Invalid title');
    });
  });

  // 🧪 7. Shows generic error toast
  it('shows generic error toast for unknown error', async () => {
    mockAddBlog.mockRejectedValueOnce({ response: { data: {} } });

    render(
      <BrowserRouter>
        <BlogsFormTemplate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/SEO Title/i), { target: { value: 'SEO Title' } });
    fireEvent.change(screen.getByLabelText(/SEO Description/i), { target: { value: 'SEO Description' } });
    fireEvent.change(screen.getByLabelText(/Blog Title/i), { target: { value: 'Title' } });
    fireEvent.change(screen.getByLabelText(/Blog Category/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Blog Description/i), { target: { value: 'Description' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });
  });

  // 🧪 8. Image file validation
  it('rejects invalid file types for blog image', async () => {
    render(
      <BrowserRouter>
        <BlogsFormTemplate />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/Blog Image/i);
    const invalidFile = new File(['text'], 'bad.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please fix all validation errors');
    });
  });

  // 🧪 9. Fetch category options correctly
  it('fetches active blog categories on mount', async () => {
    render(
      <BrowserRouter>
        <BlogsFormTemplate />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockFetchAllActiveBlogCategories).toHaveBeenCalled();
    });
  });

  // 🧪 10. Handles fetch failure for blog edit
  it('shows toast if blog fetch fails', async () => {
    mockFetchBlogById.mockResolvedValueOnce(null);
    render(
      <MemoryRouter initialEntries={['/blog/edit/999']}>
        <Routes>
          <Route path="/blog/edit/:id" element={<BlogsFormTemplate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load blog data');
    });
  });
});
