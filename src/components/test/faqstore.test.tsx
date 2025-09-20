import { act } from '@testing-library/react';
import axios from 'axios';
import { useFaqStore } from '../stores/FaqStore';

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
});
