// no need to import React
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryListTemplate from '../CategoryListTemplate';
import { useCategoryStore } from '../../../stores/categoryStore';
import { BrowserRouter } from 'react-router-dom';

// Mock SweetAlert2 and toast
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

// Mock zustand store
jest.mock('../../../stores/categoryStore');

const mockCategories = [
  {
    _id: '1',
    name: 'Test Category',
    slug: 'test-category',
    description: 'This is a test category',
    photo: '/test.jpg',
    isFeatured: false,
    status: true,
    CategoryFields: [{ key: 'color', value: 'red' }],
    length: 1,
  },
];

describe('CategoryListTemplate', () => {
  beforeEach(() => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categories: mockCategories,
      fetchCategories: jest.fn(),
      deleteCategory: jest.fn(),
      toggleStatusCategory: jest.fn(),
      totalPages: 1,
      loading: false,
      error: null,
    });
  });

  it('renders category table', () => {
    render(
      <BrowserRouter>
        <CategoryListTemplate />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('test-category')).toBeInTheDocument();
    expect(screen.getByText('This is a test category')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      categories: [],
      fetchCategories: jest.fn(),
      deleteCategory: jest.fn(),
      toggleStatusCategory: jest.fn(),
      totalPages: 1,
      loading: true,
      error: null,
    });
    render(
      <BrowserRouter>
        <CategoryListTemplate />
      </BrowserRouter>
    );
    // Uncomment if your loader has a test id
    // expect(screen.getByTestId('baz-loader')).toBeInTheDocument();
  });

  it('filters categories by search', () => {
    render(
      <BrowserRouter>
        <CategoryListTemplate />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Test' },
    });
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('handles delete confirmation and deletion', async () => {
    const deleteCategory = jest.fn();
    (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      categories: mockCategories,
      fetchCategories: jest.fn(),
      deleteCategory,
      toggleStatusCategory: jest.fn(),
      totalPages: 1,
      loading: false,
      error: null,
    });
    render(
      <BrowserRouter>
        <CategoryListTemplate />
      </BrowserRouter>
    );
    // Adjust selector to match your delete button
    // fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    // await waitFor(() => expect(deleteCategory).toHaveBeenCalled());
  });

  it('shows error toast when error exists', () => {
  (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
    categories: [],
    fetchCategories: jest.fn(),
    deleteCategory: jest.fn(),
    toggleStatusCategory: jest.fn(),
    totalPages: 1,
    loading: false,
    error: 'Something went wrong',
  });
  render(
    <BrowserRouter>
      <CategoryListTemplate />
    </BrowserRouter>
  );
  expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Something went wrong', expect.any(Object));
});

it('handles toggle status action', async () => {
  const toggleStatusCategory = jest.fn();
  (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
    categories: mockCategories,
    fetchCategories: jest.fn(),
    deleteCategory: jest.fn(),
    toggleStatusCategory,
    totalPages: 1,
    loading: false,
    error: null,
  });
  render(
    <BrowserRouter>
      <CategoryListTemplate />
    </BrowserRouter>
  );
  const toggleBtn = screen.getAllByRole('button', { name: /toggle status/i })[0];
  fireEvent.click(toggleBtn);
  await waitFor(() => expect(toggleStatusCategory).toHaveBeenCalledWith('1'));
});

it('renders pagination when totalPages > 1', () => {
  (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
    categories: mockCategories,
    fetchCategories: jest.fn(),
    deleteCategory: jest.fn(),
    toggleStatusCategory: jest.fn(),
    totalPages: 2,
    loading: false,
    error: null,
  });
  render(
    <BrowserRouter>
      <CategoryListTemplate />
    </BrowserRouter>
  );
  expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
});

it('confirms and deletes category', async () => {
  const deleteCategory = jest.fn();
  (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
    categories: mockCategories,
    fetchCategories: jest.fn(),
    deleteCategory,
    toggleStatusCategory: jest.fn(),
    totalPages: 1,
    loading: false,
    error: null,
  });
  render(
    <BrowserRouter>
      <CategoryListTemplate />
    </BrowserRouter>
  );
  const deleteBtn = screen.getAllByRole('button', { name: /delete/i })[0];
  fireEvent.click(deleteBtn);
  await waitFor(() => expect(deleteCategory).toHaveBeenCalledWith('1'));
});

it('shows fallback when search yields no results', () => {
  render(
    <BrowserRouter>
      <CategoryListTemplate />
    </BrowserRouter>
  );
  fireEvent.change(screen.getByPlaceholderText(/search/i), {
    target: { value: 'Nonexistent' },
  });
  expect(screen.queryByText('Test Category')).not.toBeInTheDocument();
});
});