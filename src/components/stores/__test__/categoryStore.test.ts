import { act } from 'react';
import { useCategoryStore } from '../categoryStore';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useCategoryStore', () => {
  beforeEach(() => {
    useCategoryStore.setState({
      categories: [],
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
    });
    jest.clearAllMocks();
  });

  it('fetches categories successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { categories: [{ _id: '1', categoryName: 'Test' }], meta: { totalPages: 3 } }
    });
    await act(async () => {
      await useCategoryStore.getState().fetchCategories(1, 10);
    });
    expect(useCategoryStore.getState().categories.length).toBe(1);
    expect(useCategoryStore.getState().totalPages).toBe(3);
    expect(useCategoryStore.getState().loading).toBe(false);
  });

  it('handles fetchCategories error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Fetch failed'));
    await expect(useCategoryStore.getState().fetchCategories(1, 10)).rejects.toThrow('Fetch failed');
    expect(useCategoryStore.getState().error).toBe('Fetch failed');
    expect(useCategoryStore.getState().loading).toBe(false);
  });

  it('fetches category by id', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: { _id: '1', categoryName: 'Test' } } });
    let category = null;
    await act(async () => {
      category = await useCategoryStore.getState().fetchCategoryById('1');
    });
    expect(category).toEqual({ _id: '1', categoryName: 'Test' });
  });

  it('handles fetchCategoryById error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));
    let category = null;
    await act(async () => {
      category = await useCategoryStore.getState().fetchCategoryById('badid');
    });
    expect(category).toBeNull();
    expect(useCategoryStore.getState().error).toBe('Not found');
  });

  it('adds a category', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });
    await act(async () => {
      await useCategoryStore.getState().addCategory(new FormData());
    });
    expect(useCategoryStore.getState().loading).toBe(false);
  });

  it('handles addCategory error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Add failed'));
    await expect(useCategoryStore.getState().addCategory(new FormData())).rejects.toThrow('Add failed');
    expect(useCategoryStore.getState().error).toBe('Add failed');
  });

  it('updates a category', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: {} });
    await act(async () => {
      await useCategoryStore.getState().updateCategory('1', new FormData());
    });
    expect(useCategoryStore.getState().loading).toBe(false);
  });

  it('handles updateCategory error', async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error('Update failed'));
    await expect(useCategoryStore.getState().updateCategory('1', new FormData())).rejects.toThrow('Update failed');
    expect(useCategoryStore.getState().error).toBe('Update failed');
  });

  it('deletes a category', async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: {} });
    await act(async () => {
      await useCategoryStore.getState().deleteCategory('1');
    });
    expect(useCategoryStore.getState().loading).toBe(false);
  });

  it('handles deleteCategory error', async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error('Delete failed'));
    await expect(useCategoryStore.getState().deleteCategory('1')).rejects.toThrow('Delete failed');
    expect(useCategoryStore.getState().error).toBe('Delete failed');
  });

  it('toggles category status', async () => {
    useCategoryStore.setState({
      categories: [
        {
          length: 1,
          _id: '1',
          name: 'Mock Category',
          slug: 'mock-category',
          description: 'This is a test category',
          photo: 'mock.jpg',
          isFeatured: false,
          status: false,
          CategoryFields: [
            { key: 'color', value: 'red' },
            { key: 'size', value: 'large' }
          ]
        }
      ]
    });

    mockedAxios.patch.mockResolvedValueOnce({ data: { data: { status: 'active' } } });
    await act(async () => {
      await useCategoryStore.getState().toggleStatusCategory('1');
    });
    expect(useCategoryStore.getState().categories[0].status).toBe(true);
  });

  it('handles toggleStatusCategory error', async () => {
    mockedAxios.patch.mockRejectedValueOnce(new Error('Toggle failed'));
    await expect(useCategoryStore.getState().toggleStatusCategory('1')).rejects.toThrow('Toggle failed');
    expect(useCategoryStore.getState().error).toBe('Toggle failed');
  });

  it('restores a category', async () => {
    mockedAxios.patch.mockResolvedValueOnce({ data: {} });
    await act(async () => {
      await useCategoryStore.getState().restoreCategory('1');
    });
    expect(useCategoryStore.getState().loading).toBe(false);
  });

  it('handles restoreCategory error', async () => {
    mockedAxios.patch.mockRejectedValueOnce(new Error('Restore failed'));
    await expect(useCategoryStore.getState().restoreCategory('1')).rejects.toThrow('Restore failed');
    expect(useCategoryStore.getState().error).toBe('Restore failed');
  });

  it('permanently deletes a category', async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: {} });
    await act(async () => {
      await useCategoryStore.getState().deleteCategoryPermanently('1');
    });
    expect(useCategoryStore.getState().loading).toBe(false);
  });

  it('handles deleteCategoryPermanently error', async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error('Permanent delete failed'));
    await expect(useCategoryStore.getState().deleteCategoryPermanently('1')).rejects.toThrow('Permanent delete failed');
    expect(useCategoryStore.getState().error).toBe('Permanent delete failed');
  });

  it('fetches trashed categories', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { categories: [{ _id: '1', categoryName: 'Trash' }], total: 10, page: 1, limit: 5 }
    });
    await act(async () => {
      await useCategoryStore.getState().fetchTrashCategories(1, 5);
    });
    expect(useCategoryStore.getState().categories.length).toBe(1);
    expect(useCategoryStore.getState().totalPages).toBe(2);
    expect(useCategoryStore.getState().loading).toBe(false);
  });

  it('handles fetchTrashCategories error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Trash fetch failed'));
    await expect(useCategoryStore.getState().fetchTrashCategories(1, 5)).rejects.toThrow('Trash fetch failed');
    expect(useCategoryStore.getState().error).toBe('Trash fetch failed');
  });
});