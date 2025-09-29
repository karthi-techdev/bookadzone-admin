import { act } from '@testing-library/react';
import axios from 'axios';
import { useFaqStore } from '../FaqStore';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Faq Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches FAQs list and updates state', async () => {
    const fakeFaqs = [{ _id: '1', question: 'Q1', answer: 'A1', priority: 1 }];
    const response = {
      data: {
        data: fakeFaqs,
        meta: { total: 1, active: 1, inactive: 0, totalPages: 1 },
      },
    };
    mockedAxios.get.mockResolvedValueOnce(response);

    await act(async () => {
      await useFaqStore.getState().fetchFaqs(1, 10, 'total');
    });

    const faqs = useFaqStore.getState().faqs;
    expect(faqs).toEqual(fakeFaqs);
    expect(useFaqStore.getState().stats.total).toBe(1);
    expect(useFaqStore.getState().loading).toBe(false);
    expect(useFaqStore.getState().error).toBeNull();
  });

  it('adds a new FAQ and updates state', async () => {
    const newFaq = { question: 'Q2', answer: 'A2', priority: 2, status: true };
    const returnedFaq = { ...newFaq, _id: '2' };
    mockedAxios.post.mockResolvedValueOnce({ data: { data: returnedFaq } });

    await act(async () => {
      await useFaqStore.getState().addFaq(newFaq);
    });

    const faqs = useFaqStore.getState().faqs;
    expect(faqs.find(f => f._id === '2')).toEqual(returnedFaq);
  });

  it('updates FAQ by ID and updates state', async () => {
    const existingFaq = { _id: '1', question: 'Q1', answer: 'A1', priority: 1, status: true };
    useFaqStore.setState({ faqs: [existingFaq] });

    const updatedData = { question: 'Q1 updated', answer: 'A1 updated', priority: 1, status: false };
    mockedAxios.put.mockResolvedValueOnce({ data: { data: { ...updatedData, _id: '1' } } });

    await act(async () => {
      await useFaqStore.getState().updateFaq('1', updatedData);
    });

    const updatedFaq = useFaqStore.getState().faqs.find(f => f._id === '1');
    expect(updatedFaq?.question).toBe('Q1 updated');
    expect(updatedFaq?.status).toBe(false);
  });

  it('deletes FAQ by ID and updates state', async () => {
    const existingFaq = { _id: '5', question: 'Q5', answer: 'A5', priority: 5 };
    useFaqStore.setState({ faqs: [existingFaq] });

    mockedAxios.delete.mockResolvedValueOnce({});

    await act(async () => {
      await useFaqStore.getState().deleteFaq('5');
    });

    expect(useFaqStore.getState().faqs.find(f => f._id === '5')).toBeUndefined();
  });

  it('handles error in fetchFaqs', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'Network error' });
    await expect(useFaqStore.getState().fetchFaqs(1, 10, 'total')).rejects.toMatch('Network error');
    expect(useFaqStore.getState().error).toBe('Network error');
  });

  it('fetches trash FAQs', async () => {
    const fakeFaqs = [{ _id: 't1', question: 'Trash Q', answer: 'Trash A', priority: 1 }];
    const response = {
      data: {
        data: fakeFaqs,
        meta: { total: 1, active: 0, inactive: 1, totalPages: 1 },
      },
    };
    mockedAxios.patch.mockResolvedValueOnce(response);
    await act(async () => {
      await useFaqStore.getState().fetchTrashFaqs(1, 10, 'inactive');
    });
    expect(useFaqStore.getState().faqs).toEqual(fakeFaqs);
    expect(useFaqStore.getState().stats.inactive).toBe(1);
  });

  it('handles error in fetchTrashFaqs', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'Trash error' });
    await expect(useFaqStore.getState().fetchTrashFaqs(1, 10, 'inactive')).rejects.toMatch('Trash error');
    expect(useFaqStore.getState().error).toBe('Trash error');
  });

  it('restores a trashed FAQ', async () => {
    const trashedFaq = { _id: 't2', question: 'Trash2', answer: 'A2', priority: 2 };
    useFaqStore.setState({ faqs: [trashedFaq] });
    mockedAxios.patch.mockResolvedValueOnce({});
    await act(async () => {
      await useFaqStore.getState().restoreFaq('t2');
    });
    expect(useFaqStore.getState().faqs.find(f => f._id === 't2')).toBeUndefined();
  });

  it('handles error in restoreFaq', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'Restore error' });
    await expect(useFaqStore.getState().restoreFaq('t2')).rejects.toMatch('Restore error');
    expect(useFaqStore.getState().error).toBe('Restore error');
  });

  it('permanently deletes a FAQ', async () => {
    const faq = { _id: 'p1', question: 'Perm', answer: 'A', priority: 1 };
    useFaqStore.setState({ faqs: [faq] });
    mockedAxios.delete.mockResolvedValueOnce({});
    await act(async () => {
      await useFaqStore.getState().deleteFaqPermanently('p1');
    });
    expect(useFaqStore.getState().faqs.find(f => f._id === 'p1')).toBeUndefined();
  });

  it('handles error in deleteFaqPermanently', async () => {
    mockedAxios.delete.mockRejectedValueOnce({ message: 'Permanent error' });
    await expect(useFaqStore.getState().deleteFaqPermanently('p1')).rejects.toMatch('Permanent error');
    expect(useFaqStore.getState().error).toBe('Permanent error');
  });

  it('toggles FAQ status', async () => {
    const faq = { _id: 's1', question: 'Status', answer: 'A', priority: 1, status: false };
    useFaqStore.setState({ faqs: [faq] });
    mockedAxios.patch.mockResolvedValueOnce({ data: { data: { status: 'active' } } });
    await act(async () => {
      await useFaqStore.getState().toggleStatusFaq('s1');
    });
    expect(useFaqStore.getState().faqs[0].status).toBe(true);
  });

  it('handles error in toggleStatusFaq', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'Toggle error' });
    await expect(useFaqStore.getState().toggleStatusFaq('s1')).rejects.toMatch('Toggle error');
    expect(useFaqStore.getState().error).toBe('Toggle error');
  });

  it('fetches FAQ by ID', async () => {
    const faq = { _id: 'id1', question: 'Q', answer: 'A', priority: 1 };
    mockedAxios.get.mockResolvedValueOnce({ data: { data: faq } });
    let result = null;
    await act(async () => {
      result = await useFaqStore.getState().fetchFaqById('id1');
    });
    expect(result).toEqual(faq);
  });

  it('handles error in fetchFaqById', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'ID error' });
    let result = null;
    await act(async () => {
      result = await useFaqStore.getState().fetchFaqById('id404');
    });
    expect(result).toBeNull();
    expect(useFaqStore.getState().error).toBe('ID error');
  });
});
