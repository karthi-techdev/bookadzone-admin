import { act } from '@testing-library/react';
import axios from 'axios';
import { useNewsLetterStore } from '../NewsLetterStore';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NewsLetter Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches NewsLetters list and updates state', async () => {
    const fakeNewsLetters = [{ _id: '1', question: 'Q1', answer: 'A1', priority: 1 }];
    const response = {
      data: {
        data: fakeNewsLetters,
        meta: { total: 1, active: 1, inactive: 0, totalPages: 1 },
      },
    };
    mockedAxios.get.mockResolvedValueOnce(response);

    await act(async () => {
      await useNewsLetterStore.getState().fetchNewsLetters(1, 10, 'total');
    });

    const newsLetters = useNewsLetterStore.getState().newsLetters;
    expect(newsLetters).toEqual(fakeNewsLetters);
    expect(useNewsLetterStore.getState().stats.total).toBe(1);
    expect(useNewsLetterStore.getState().loading).toBe(false);
    expect(useNewsLetterStore.getState().error).toBeNull();
  });

  it('adds a new NewsLetter and updates state', async () => {
    const newNewsLetter = { name: 'Q2', slug: 'A2', template:"T2", status: true };
    const returnedNewsLetter = { ...newNewsLetter, _id: '2' };
    mockedAxios.post.mockResolvedValueOnce({ data: { data: returnedNewsLetter } });

    await act(async () => {
      await useNewsLetterStore.getState().addNewsLetter(newNewsLetter);
    });

    const newsLetters = useNewsLetterStore.getState().newsLetters;
    expect(newsLetters.find(n => n._id === '2')).toEqual(returnedNewsLetter);
  });

  it('updates NewsLetter by ID and updates state', async () => {
    const existingNewsLetter = { _id:'1',name: 'Q1', slug: 'A1', template:"T1", status: true };
    useNewsLetterStore.setState({ newsLetters: [existingNewsLetter] });

    const updatedData = { name: 'Q1 updated', slug: 'A1 updated', template:"T1", status: false };
    mockedAxios.put.mockResolvedValueOnce({ data: { data: { ...updatedData, _id: '1' } } });

    await act(async () => {
      await useNewsLetterStore.getState().updateNewsLetter('1', updatedData);
    });

    const updatedNewsLetter = useNewsLetterStore.getState().newsLetters.find(n=> n._id === '1');
    expect(updatedNewsLetter?.name).toBe('Q1 updated');
    expect(updatedNewsLetter?.status).toBe(false);
  });

  it('deletes NewsLetter by ID and updates state', async () => {
    const existingNewsLetter = { _id: '5', name: 'Q5', slug: 'A5', template: "T5" };
    useNewsLetterStore.setState({ newsLetters: [existingNewsLetter] });

    mockedAxios.delete.mockResolvedValueOnce({});

    await act(async () => {
      await useNewsLetterStore.getState().deleteNewsLetter('5');
    });

    expect(useNewsLetterStore.getState().newsLetters.find(n => n._id === '5')).toBeUndefined();
  });

  it('handles error in fetchNewsLetters', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'Network error' });
    await expect(useNewsLetterStore.getState().fetchNewsLetters(1, 10, 'total')).rejects.toMatch('Network error');
    expect(useNewsLetterStore.getState().error).toBe('Network error');
  });
  it('fetches trash NewsLetters', async () => {
    const fakeNewsLetters = [{ _id: 't1', name: 'Trash Q', slug: 'Trash A', template: "Trash T" }];
    const response = {
      data: {
        data: fakeNewsLetters,
        meta: { total: 1, active: 0, inactive: 1, totalPages: 1 },
      },
    };
    // use get instead of patch
    mockedAxios.get.mockResolvedValueOnce(response);

    await act(async () => {
      await useNewsLetterStore.getState().fetchTrashNewsLetters(1, 10, 'inactive');
    });

    expect(useNewsLetterStore.getState().newsLetters).toEqual(fakeNewsLetters);
    expect(useNewsLetterStore.getState().stats.inactive).toBe(1);
  });

   it('handles error in fetchTrashNewsLetters', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'Trash error' });
    await expect(useNewsLetterStore.getState().fetchTrashNewsLetters(1, 10, 'inactive'))
      .rejects.toMatch('Trash error');
    expect(useNewsLetterStore.getState().error).toBe('Trash error');
  });

  it('restores a trashed NewsLetter', async () => {
    const trashedNewsLetter = { _id: 't2', name: 'Trash2', slug: 'A2', template: "T2" };
    useNewsLetterStore.setState({ newsLetters: [trashedNewsLetter] });
    mockedAxios.patch.mockResolvedValueOnce({});
    await act(async () => {
      await useNewsLetterStore.getState().restoreNewsLetter('t2');
    });
    expect(useNewsLetterStore.getState().newsLetters.find(n=> n._id === 't2')).toBeUndefined();
  });

  it('handles error in restoreNewsLetter', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'Restore error' });
    await expect(useNewsLetterStore.getState().restoreNewsLetter('t2')).rejects.toMatch('Restore error');
    expect(useNewsLetterStore.getState().error).toBe('Restore error');
  });

 it('permanently deletes a NewsLetter', async () => {
    const newsletter = { _id: 'p1', name: 'Perm', slug: 'perm', template: '1' };
    useNewsLetterStore.setState({ newsLetters: [newsletter] });
    await act(async () => {
      await useNewsLetterStore.getState().deleteNewsLetterPermanently('p1');
    });
    expect(useNewsLetterStore.getState().newsLetters.find(n => n._id === 'p1')).toBeUndefined();
  });


  it('handles error in deleteNewsLetterPermanently', async () => {
    mockedAxios.delete.mockRejectedValueOnce({ message: 'Permanent error' });
    await expect(useNewsLetterStore.getState().deleteNewsLetterPermanently('p1')).rejects.toMatch('Permanent error');
    expect(useNewsLetterStore.getState().error).toBe('Permanent error');
  });

  it('toggles NewsLetter status', async () => {
    const newsLetter = { _id: 's1', name: 'Status', slug: 'A', template: "T", status: false };
    useNewsLetterStore.setState({ newsLetters: [newsLetter] });
    mockedAxios.patch.mockResolvedValueOnce({ data: { data: { status: 'active' } } });
    await act(async () => {
      await useNewsLetterStore.getState().toggleStatusNewsLetter('s1');
    });
    expect(useNewsLetterStore.getState().newsLetters[0].status).toBe(true);
  });

  it('handles error in toggleStatusNewsLetter', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'Toggle error' });
    await expect(useNewsLetterStore.getState().toggleStatusNewsLetter('s1')).rejects.toMatch('Toggle error');
    expect(useNewsLetterStore.getState().error).toBe('Toggle error');
  });

  it('fetches NewsLetter by ID', async () => {
    const newsLetter = { _id: 'id1', name: 'Q', slug: 'A', tempalte: "T" };
    mockedAxios.get.mockResolvedValueOnce({ data: { data: newsLetter } });
    let result = null;
    await act(async () => {
      result = await useNewsLetterStore.getState().fetchNewsLetterById('id1');
    });
    expect(result).toEqual(newsLetter);
  });

  it('handles error in fetchNewsLetterById', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'ID error' });
    let result = null;
    await act(async () => {
      result = await useNewsLetterStore.getState().fetchNewsLetterById('id404');
    });
    expect(result).toBeNull();
    expect(useNewsLetterStore.getState().error).toBe('ID error');
  });
});
