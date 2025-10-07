import { act } from '@testing-library/react';
import axios from 'axios';
import { useBlogCategoryStore } from '../blogCategoryStore';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BlogCategory Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches blog categories list and updates state', async () => {
    const fakeCategories = [
      { _id: '1', name: 'Tech', label: 'Technology', slug: 'tech', status: true },
    ];
    const response = {
      data: {
        data: fakeCategories,
        meta: { total: 1, active: 1, inactive: 0, totalPages: 1 },
      },
    };
    mockedAxios.get.mockResolvedValueOnce(response);

    await act(async () => {
      await useBlogCategoryStore.getState().fetchBlogCategory(1, 10, 'total');
    });

    const categories = useBlogCategoryStore.getState().blogCategory;
    expect(categories).toEqual(fakeCategories);
    expect(useBlogCategoryStore.getState().stats.total).toBe(1);
    expect(useBlogCategoryStore.getState().loading).toBe(false);
    expect(useBlogCategoryStore.getState().error).toBeNull();
  });

  it('adds a new blog category and updates state', async () => {
    const newCategory = {
      name: 'Health',
      label: 'Health & Wellness',
      slug: 'health',
      status: true,
    };
    const returnedCategory = { ...newCategory, _id: '2' };
    mockedAxios.post.mockResolvedValueOnce({ data: { data: returnedCategory } });

    await act(async () => {
      await useBlogCategoryStore.getState().addBlogCategory(newCategory);
    });

    const categories = useBlogCategoryStore.getState().blogCategory;
    expect(categories.find(c => c._id === '2')).toEqual(returnedCategory);
  });

  it('updates blog category by ID and updates state', async () => {
    const existingCategory = {
      _id: '1',
      name: 'Tech',
      label: 'Technology',
      slug: 'tech',
      status: true,
    };
    useBlogCategoryStore.setState({ blogCategory: [existingCategory] });

    const updatedData = {
      name: 'Tech Updated',
      label: 'Technology Updated',
      slug: 'tech-updated',
      status: false,
    };
    mockedAxios.put.mockResolvedValueOnce({ data: { data: { ...updatedData, _id: '1' } } });

    await act(async () => {
      await useBlogCategoryStore.getState().updateBlogCategory('1', updatedData);
    });

    const updatedCategory = useBlogCategoryStore.getState().blogCategory.find(c => c._id === '1');
    expect(updatedCategory?.name).toBe('Tech Updated');
    expect(updatedCategory?.status).toBe(false);
  });

  it('deletes blog category by ID and updates state', async () => {
    const existingCategory = {
      _id: '5',
      name: 'Delete',
      label: 'ToDelete',
      slug: 'delete',
    };
    useBlogCategoryStore.setState({ blogCategory: [existingCategory] });

    mockedAxios.delete.mockResolvedValueOnce({});

    await act(async () => {
      await useBlogCategoryStore.getState().deleteBlogCategory('5');
    });

    expect(useBlogCategoryStore.getState().blogCategory.find(c => c._id === '5')).toBeUndefined();
  });

  it('handles error in fetchBlogCategories', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'Network error' });
    await expect(useBlogCategoryStore.getState().fetchBlogCategory(1, 10, 'total')).rejects.toMatch('Network error');
    expect(useBlogCategoryStore.getState().error).toBe('Network error');
  });

  it('fetches trash blog categories', async () => {
    const fakeCategories = [
      { _id: 't1', name: 'TrashCat', label: 'Trash', slug: 'trash', status: false },
    ];
    const response = {
      data: {
        data: fakeCategories,
        meta: { total: 1, active: 0, inactive: 1, totalPages: 1 },
      },
    };
    mockedAxios.get.mockResolvedValueOnce(response);

    await act(async () => {
      await useBlogCategoryStore.getState().fetchTrashBlogCategory(1, 10, 'inactive');
    });

    expect(useBlogCategoryStore.getState().blogCategory).toEqual(fakeCategories);
    expect(useBlogCategoryStore.getState().stats.inactive).toBe(1);
  });

  it('handles error in fetchTrashBlogCategories', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'Trash error' });
    await expect(useBlogCategoryStore.getState().fetchTrashBlogCategory(1, 10, 'inactive')).rejects.toMatch('Trash error');
    expect(useBlogCategoryStore.getState().error).toBe('Trash error');
  });

  it('restores a trashed blog category', async () => {
    const trashedCategory = {
      _id: 't2',
      name: 'RestoreCat',
      label: 'Restore',
      slug: 'restore',
    };
    useBlogCategoryStore.setState({ blogCategory: [trashedCategory] });
    mockedAxios.patch.mockResolvedValueOnce({});

    await act(async () => {
      await useBlogCategoryStore.getState().restoreBlogCategory('t2');
    });

    expect(useBlogCategoryStore.getState().blogCategory.find(c => c._id === 't2')).toBeUndefined();
  });

  it('handles error in restoreBlogCategory', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'Restore error' });
    await expect(useBlogCategoryStore.getState().restoreBlogCategory('t2')).rejects.toMatch('Restore error');
    expect(useBlogCategoryStore.getState().error).toBe('Restore error');
  });

  it('permanently deletes a blog category', async () => {
    const category = {
      _id: 'p1',
      name: 'Permanent',
      label: 'Permanent',
      slug: 'perm',
    };
    useBlogCategoryStore.setState({ blogCategory: [category] });
    mockedAxios.delete.mockResolvedValueOnce({});

    await act(async () => {
      await useBlogCategoryStore.getState().deleteBlogCategoryPermanently('p1');
    });

    expect(useBlogCategoryStore.getState().blogCategory.find(c => c._id === 'p1')).toBeUndefined();
  });

  it('handles error in deleteBlogCategoryPermanently', async () => {
    mockedAxios.delete.mockRejectedValueOnce({ message: 'Permanent error' });
    await expect(useBlogCategoryStore.getState().deleteBlogCategoryPermanently('p1')).rejects.toMatch('Permanent error');
    expect(useBlogCategoryStore.getState().error).toBe('Permanent error');
  });

  it('toggles blog category status', async () => {
    const category = {
      _id: 's1',
      name: 'StatusCat',
      label: 'Status',
      slug: 'status',
      status: false,
    };
    useBlogCategoryStore.setState({ blogCategory: [category] });
    mockedAxios.patch.mockResolvedValueOnce({ data: { data: { status: 'active' } } });

    await act(async () => {
      await useBlogCategoryStore.getState().toggleStatusBlogCategory('s1');
    });

    expect(useBlogCategoryStore.getState().blogCategory[0].status).toBe(true);
  });

  it('handles error in toggleStatusBlogCategory', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'Toggle error' });
    await expect(useBlogCategoryStore.getState().toggleStatusBlogCategory('s1')).rejects.toMatch('Toggle error');
    expect(useBlogCategoryStore.getState().error).toBe('Toggle error');
  });

  it('fetches blog category by ID', async () => {
    const category = {
      _id: 'id1',
      name: 'Cat1',
      label: 'Category 1',
      slug: 'cat1',
    };
    mockedAxios.get.mockResolvedValueOnce({ data: { data: category } });

    let result = null;
    await act(async () => {
      result = await useBlogCategoryStore.getState().fetchBlogCategoryById('id1');
    });

    expect(result).toEqual(category);
  });

  it('handles error in fetchBlogCategoryById', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'ID error' });
    let result = null;

    await act(async () => {
      result = await useBlogCategoryStore.getState().fetchBlogCategoryById('id404');
    });

    expect(result).toBeNull();
    expect(useBlogCategoryStore.getState().error).toBe('ID error');
  });
});