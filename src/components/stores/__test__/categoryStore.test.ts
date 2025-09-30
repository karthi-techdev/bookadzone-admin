import { act } from 'react';
import { useCategoryStore } from '../categoryStore';
import axios from 'axios';

jest.mock('axios');

describe('useCategoryStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCategoryStore.setState({
      categorys: [],
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
      stats: { total: 0, active: 0, inactive: 0 },
    });
  });

  it('fetchCategorys sets categories on success', async () => {
    const mockCategories = [{ _id: '1', name: 'Test', status: true }];
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: { data: mockCategories, meta: { total: 1, active: 1, inactive: 0 } } },
    });

    await act(async () => {
      await useCategoryStore.getState().fetchCategorys(1, 10, 'total');
    });

    expect(useCategoryStore.getState().categorys).toEqual(mockCategories);
    expect(useCategoryStore.getState().stats).toEqual({ total: 1, active: 1, inactive: 0 });
    expect(useCategoryStore.getState().error).toBeNull();
  });

  it('fetchCategorys sets error on failure', async () => {
    (axios.get as jest.Mock).mockRejectedValue({ response: { data: { message: 'fail' } } });

    await act(async () => {
      await expect(useCategoryStore.getState().fetchCategorys(1, 10)).rejects.toEqual('fail');
    });

    expect(useCategoryStore.getState().error).toBe('fail');
  });

  it('fetchCategoryById works on success', async () => {
    const mockCategory = { _id: '1', name: 'Cat1', status: true };
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: mockCategory } });

    const result = await act(async () => {
      return await useCategoryStore.getState().fetchCategoryById('1');
    });

    expect(result).toEqual(mockCategory);
  });

  it('addCategory updates state on success', async () => {
    const mockCategory = { _id: '1', name: 'New Cat', status: true };
    (axios.post as jest.Mock).mockResolvedValue({ data: { data: mockCategory } });

    const formData = new FormData();
    formData.append('name', 'New Cat');

    await act(async () => {
      await useCategoryStore.getState().addCategory(formData);
    });

    expect(useCategoryStore.getState().categorys).toContainEqual(mockCategory);
    expect(useCategoryStore.getState().stats.total).toBe(1);
  });

  it('updateCategory updates item in state', async () => {
    useCategoryStore.setState({
      categorys: [{ _id: '1', name: 'Old Cat', status: true } as any],
      stats: { total: 1, active: 1, inactive: 0 },
    });
    const updatedCat = { _id: '1', name: 'Updated Cat', status: true };
    (axios.put as jest.Mock).mockResolvedValue({ data: { data: updatedCat } });

    const formData = new FormData();
    formData.append('name', 'Updated Cat');

    await act(async () => {
      await useCategoryStore.getState().updateCategory('1', formData);
    });

    expect(useCategoryStore.getState().categorys[0]).toEqual(updatedCat);
  });

  it('updateCategory sets error on failure', async () => {
    (axios.put as jest.Mock).mockRejectedValue({ message: 'update fail' });

    const formData = new FormData();
    formData.append('name', 'Bad Update');

    await act(async () => {
      await expect(useCategoryStore.getState().updateCategory('1', formData)).rejects.toEqual('update fail');
    });

    expect(useCategoryStore.getState().error).toBe('update fail');
  });

  it('deleteCategory removes item from state', async () => {
    useCategoryStore.setState({
      categorys: [{ _id: '1', name: 'Delete Me', status: true } as any],
      stats: { total: 1, active: 1, inactive: 0 },
    });

    (axios.delete as jest.Mock).mockResolvedValue({});

    await act(async () => {
      await useCategoryStore.getState().deleteCategory('1');
    });

    expect(useCategoryStore.getState().categorys).toEqual([]);
    expect(useCategoryStore.getState().stats.total).toBe(0);
  });

  it('deleteCategory sets error on failure', async () => {
    (axios.delete as jest.Mock).mockRejectedValue({ message: 'delete fail' });

    await act(async () => {
      await expect(useCategoryStore.getState().deleteCategory('1')).rejects.toEqual('delete fail');
    });

    expect(useCategoryStore.getState().error).toBe('delete fail');
  });

  it('toggleStatusCategory toggles status', async () => {
    useCategoryStore.setState({
      categorys: [{ _id: '1', name: 'Toggle Cat', status: true } as any],
    });
    (axios.patch as jest.Mock).mockResolvedValue({ data: { data: { status: 'inactive' } } });

    await act(async () => {
      await useCategoryStore.getState().toggleStatusCategory('1');
    });

    expect(useCategoryStore.getState().categorys[0].status).toBe(false);
  });

  it('restoreCategory removes from list after restoring', async () => {
    useCategoryStore.setState({
      categorys: [{ _id: '1', name: 'Trash Me', status: false } as any],
    });
    (axios.patch as jest.Mock).mockResolvedValue({});

    await act(async () => {
      await useCategoryStore.getState().restoreCategory('1');
    });

    expect(useCategoryStore.getState().categorys).toEqual([]);
  });

  it('deleteCategoryPermanently removes from list', async () => {
    useCategoryStore.setState({
      categorys: [{ _id: '1', name: 'Permanent Delete', status: false } as any],
    });
    (axios.delete as jest.Mock).mockResolvedValue({});

    await act(async () => {
      await useCategoryStore.getState().deleteCategoryPermanently('1');
    });

    expect(useCategoryStore.getState().categorys).toEqual([]);
  });

  it('fetchTrashCategorys loads trash items', async () => {
    const mockTrash = [{ _id: '2', name: 'Trashed Cat', status: false }];
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: mockTrash, meta: { total: 1, active: 0, inactive: 1, totalPages: 1 } },
    });

    await act(async () => {
      await useCategoryStore.getState().fetchTrashCategorys(1, 10, 'total');
    });

    expect(useCategoryStore.getState().categorys).toEqual(mockTrash);
    expect(useCategoryStore.getState().stats.total).toBe(1);
  });
});
