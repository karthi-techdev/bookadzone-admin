import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryTrashListTemplate from '../CategoryTrashListTemplate';
import { BrowserRouter } from 'react-router-dom';
import { useCategoryStore } from '../../../../stores/categoryStore';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

// Mocks
jest.mock('../../../../stores/categoryStore');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

const mockedUseCategoryStore = useCategoryStore as jest.MockedFunction<typeof useCategoryStore>;

describe('CategoryTrashListTemplate', () => {
  let restoreCategory: jest.Mock;
  let deleteCategoryPermanently: jest.Mock;

  beforeEach(() => {
    restoreCategory = jest.fn();
    deleteCategoryPermanently = jest.fn();

    mockedUseCategoryStore.mockReturnValue({
      categorys: [
        {
          _id: '1',
          name: 'Archived Electronics',
          slug: 'archived-electronics',
          description: 'Old gadgets',
          photo: 'sample.jpg',
        },
      ],
      fetchTrashCategorys: jest.fn(),
      restoreCategory,
      deleteCategoryPermanently,
      totalPages: 1,
      loading: false,
      error: null,
      stats: { total: 1, active: 0, inactive: 1 },
    });
    jest.clearAllMocks();
  });

  it('renders trash list with category data', () => {
    render(
      <BrowserRouter>
        <CategoryTrashListTemplate />
      </BrowserRouter>
    );

    expect(screen.getByText('Archived Electronics')).toBeInTheDocument();
    expect(screen.getByText('archived-electronics')).toBeInTheDocument();
    expect(screen.getByText('Old gadgets')).toBeInTheDocument();
  });

  it('shows loader when loading is true', () => {
    mockedUseCategoryStore.mockReturnValue({
      ...mockedUseCategoryStore(),
      loading: true,
    });

    render(
      <BrowserRouter>
        <CategoryTrashListTemplate />
      </BrowserRouter>
    );

    // Adjust based on Loader component implementation
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error toast when error exists', async () => {
    mockedUseCategoryStore.mockReturnValue({
      ...mockedUseCategoryStore(),
      error: 'Failed to fetch trash',
    });

    render(
      <BrowserRouter>
        <CategoryTrashListTemplate />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch trash');
    });
  });

  it('filters category by search term', () => {
    render(
      <BrowserRouter>
        <CategoryTrashListTemplate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'Archived' },
    });

    expect(screen.getByText('Archived Electronics')).toBeInTheDocument();
  });

  it('restores a category when confirmed', async () => {
    render(
      <BrowserRouter>
        <CategoryTrashListTemplate />
      </BrowserRouter>
    );

    // depends on ManagementTable: adjust selector
    const restoreButton = screen.getByRole('button', { name: /restore/i });
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(restoreCategory).toHaveBeenCalledWith('1');
    });
  });

  it('permanently deletes a category when confirmed', async () => {
    render(
      <BrowserRouter>
        <CategoryTrashListTemplate />
      </BrowserRouter>
    );

    // depends on ManagementTable: adjust selector
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteCategoryPermanently).toHaveBeenCalledWith('1');
    });
  });
});
