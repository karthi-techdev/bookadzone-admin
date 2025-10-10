import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryListTemplate from '../CategoryListTemplate';
import { BrowserRouter } from 'react-router-dom';
import { useCategoryStore } from '../../../stores/categoryStore';
import Swal from 'sweetalert2';

// Mock SweetAlert
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

// Mock Zustand store
jest.mock('../../../stores/categoryStore', () => ({
  useCategoryStore: jest.fn(),
}));

describe('CategoryListTemplate', () => {
  const mockFetchCategorys = jest.fn();
  const mockDeleteCategory = jest.fn();
  const mockToggleStatusCategory = jest.fn();

  const mockCategorys = [
    {
      _id: '1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Devices and gadgets',
      photo: 'electronics.jpg',
    },
    {
      _id: '2',
      name: 'Books',
      slug: 'books',
      description: 'Reading material',
      photo: 'books.jpg',
    },
  ];

  const mockStats = {
    total: 2,
    active: 1,
    inactive: 1,
  };

  beforeEach(() => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categorys: mockCategorys,
      fetchCategorys: mockFetchCategorys,
      deleteCategory: mockDeleteCategory,
      toggleStatusCategory: mockToggleStatusCategory,
      loading: false,
      error: null,
      stats: mockStats,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CategoryListTemplate />
      </BrowserRouter>
    );

  it('renders category list and header', () => {
    renderComponent();

    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('filters categories based on search input', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'book' } });

    await waitFor(() => {
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });
  });

  it('calls deleteCategory when confirmed', async () => {
    renderComponent();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteCategory).toHaveBeenCalledWith('1');
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Deleted!',
          text: 'The category has been removed.',
          icon: 'success',
        })
      );
    });
  });

  it('shows fallback when no categories match filter', async () => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categorys: [],
      fetchCategorys: mockFetchCategorys,
      deleteCategory: mockDeleteCategory,
      toggleStatusCategory: mockToggleStatusCategory,
      loading: false,
      error: null,
      stats: mockStats,
    });

    renderComponent();

    expect(screen.getByText(/No categorys found/i)).toBeInTheDocument();
  });

  it('shows loader when loading is true', () => {
  (useCategoryStore as unknown as jest.Mock).mockReturnValue({
    categorys: [],
    fetchCategorys: mockFetchCategorys,
    deleteCategory: mockDeleteCategory,
    toggleStatusCategory: mockToggleStatusCategory,
    loading: true,
    error: null,
    stats: mockStats,
  });

  renderComponent();
  expect(screen.getByTestId('baz-loader')).toBeInTheDocument(); // Assuming BAZLoader has data-testid
});

it('displays toast when error is present', async () => {
  const errorMessage = 'Something went wrong';
  (useCategoryStore as unknown as jest.Mock).mockReturnValue({
    categorys: [],
    fetchCategorys: mockFetchCategorys,
    deleteCategory: mockDeleteCategory,
    toggleStatusCategory: mockToggleStatusCategory,
    loading: false,
    error: errorMessage,
    stats: mockStats,
  });

  renderComponent();
  await waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});

it('calls toggleStatusCategory when status button is clicked', async () => {
  renderComponent();

  const toggleButtons = screen.getAllByRole('button', { name: /toggle status/i }); // Adjust label if needed
  fireEvent.click(toggleButtons[0]);

  await waitFor(() => {
    expect(mockToggleStatusCategory).toHaveBeenCalledWith('1');
  });
});

it('resets page when filter changes', async () => {
  renderComponent();

  const activeFilterButton = screen.getByRole('button', { name: /Active Categories/i });
  fireEvent.click(activeFilterButton);

  await waitFor(() => {
    expect(mockFetchCategorys).toHaveBeenCalledWith(1, expect.any(Number), 'active');
  });
});

it('changes page when pagination is clicked', async () => {
  renderComponent();

  const paginationButton = screen.getByRole('button', { name: /Go to page 2/i }); // Adjust label if needed
  fireEvent.click(paginationButton);

  await waitFor(() => {
    expect(mockFetchCategorys).toHaveBeenCalledWith(2, expect.any(Number), expect.any(String));
  });
});

it('renders base64 image correctly', () => {
  const base64Photo = 'data:image/png;base64,somebase64string';
  (useCategoryStore as unknown as jest.Mock).mockReturnValue({
    categorys: [{ ...mockCategorys[0], photo: base64Photo }],
    fetchCategorys: mockFetchCategorys,
    deleteCategory: mockDeleteCategory,
    toggleStatusCategory: mockToggleStatusCategory,
    loading: false,
    error: null,
    stats: mockStats,
  });

  renderComponent();
  const img = screen.getByAltText(/Category photo/i);
  expect(img).toHaveAttribute('src', base64Photo);
});

it('shows placeholder image on photo load error', async () => {
  renderComponent();

  const img = screen.getAllByAltText(/Category photo/i)[0];
  fireEvent.error(img);

  await waitFor(() => {
    expect(img).toHaveAttribute('src', '/placeholder-image.png');
  });
});

it('navigates to edit page when edit button is clicked', async () => {
  renderComponent();

  const editButtons = screen.getAllByRole('button', { name: /edit/i });
  fireEvent.click(editButtons[0]);

  await waitFor(() => {
    expect(window.location.pathname).toContain('/categorys/edit/1');
  });
});

it('renders all stat filters', () => {
  renderComponent();

  expect(screen.getByText('All Categories')).toBeInTheDocument();
  expect(screen.getByText('Active Categories')).toBeInTheDocument();
  expect(screen.getByText('Inactive Categories')).toBeInTheDocument();
});

it('shows "No Image" when photo is missing', () => {
  (useCategoryStore as unknown as jest.Mock).mockReturnValue({
    categorys: [{ ...mockCategorys[0], photo: '' }],
    fetchCategorys: mockFetchCategorys,
    deleteCategory: mockDeleteCategory,
    toggleStatusCategory: mockToggleStatusCategory,
    loading: false,
    error: null,
    stats: mockStats,
  });

  renderComponent();
  expect(screen.getByText(/No Image/i)).toBeInTheDocument();
});
});