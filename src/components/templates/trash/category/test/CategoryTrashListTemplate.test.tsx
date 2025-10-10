// import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// Custom render to wrap with router
const render = (ui: React.ReactElement) => rtlRender(ui, { wrapper: MemoryRouter });

import CategoryTrashListTemplate from '../CategoryTrashListTemplate';
import { useCategoryStore } from '../../../../stores/categoryStore';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

jest.mock('../../../../stores/categoryStore');
jest.mock('sweetalert2');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));

const mockCategories = [
  {
    _id: '1',
    name: 'Test Category',
    slug: 'test-category',
    description: 'This is a test category',
    status: 'active',
    isFeatured: false,
    photo: '/test.jpg',
    CategoryFields: [{ key: 'color', value: 'red' }],
    length: 1,
  },
  {
    _id: '2',
    name: 'Another Category',
    slug: 'another-category',
    description: 'Another description',
    status: 'inactive',
    isFeatured: false,
    photo: '/another.jpg',
    CategoryFields: [{ key: 'size', value: 'large' }],
    length: 1,
  },
];

describe('CategoryTrashListTemplate', () => {
  let fetchTrashCategories: jest.Mock;
  let restoreCategory: jest.Mock;
  let deleteCategoryPermanently: jest.Mock;

  beforeEach(() => {
    fetchTrashCategories = jest.fn();
    restoreCategory = jest.fn();
    deleteCategoryPermanently = jest.fn();
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categories: mockCategories,
      fetchTrashCategories,
      restoreCategory,
      deleteCategoryPermanently,
      totalPages: 1,
      loading: false,
      error: '',
    });
    (Swal.fire as jest.Mock).mockResolvedValue({ isConfirmed: true });
    (toast.error as jest.Mock).mockClear();
  });

  it('renders loader when loading', () => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      ...useCategoryStore(),
      loading: true,
    });
    render(<CategoryTrashListTemplate />);
    expect(screen.getByTestId('baz-loader')).toBeInTheDocument();
  });

  it('renders table with categories', () => {
    render(<CategoryTrashListTemplate />);
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('test-category')).toBeInTheDocument();
    expect(screen.getByText('Another Category')).toBeInTheDocument();
    expect(screen.getByText('another-category')).toBeInTheDocument();
  });

  it('filters categories by search', () => {
    render(<CategoryTrashListTemplate />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Another' } });
    expect(screen.getByText('Another Category')).toBeInTheDocument();
    expect(screen.queryByText('Test Category')).not.toBeInTheDocument();
  });

  it('handles restore action', async () => {
    render(<CategoryTrashListTemplate />);
    const restoreBtn = screen.getAllByRole('button', { name: /restore/i })[0];
    fireEvent.click(restoreBtn);
    await waitFor(() => {
      expect(restoreCategory).toHaveBeenCalledWith('1');
      expect(fetchTrashCategories).toHaveBeenCalled();
    });
  });

  it('handles permanent delete action', async () => {
    render(<CategoryTrashListTemplate />);
    const deleteBtn = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(deleteCategoryPermanently).toHaveBeenCalledWith('1');
      expect(fetchTrashCategories).toHaveBeenCalled();
    });
  });

  it('shows error toast if error exists', () => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      ...useCategoryStore(),
      error: 'Some error',
      loading: false,
    });
    render(<CategoryTrashListTemplate />);
    expect(toast.error).toHaveBeenCalledWith('Some error');
  });

  it('handles pagination', () => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValueOnce({
      ...useCategoryStore(),
      totalPages: 2,
      categories: mockCategories,
      loading: false,
      error: '',
    });
    render(<CategoryTrashListTemplate />);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });
});