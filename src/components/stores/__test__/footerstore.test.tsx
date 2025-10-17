import { act } from '@testing-library/react';
import axios from 'axios';
import { useFooterStore } from '../FooterInfoStore';
import type { FooterInfo } from '../../types/common';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Footer Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFooterStore.setState({
      footers: [],
      loading: false,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
      page: 1,
      totalPages: 1,
    });
  });

  it('fetches footers and updates state', async () => {
    const fakeFooters: FooterInfo[] = [
      {
        _id: '1',
        description: 'Footer1',
        logo: 'logo1.png',
        socialmedia: 'fb',
        status: true,
        socialmedialinks:'',
        google: '',
        appstore: '',
        priority: 1,
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: { data: fakeFooters, meta: { total: 1, active: 1, inactive: 0, totalPages: 1 } } },
    });

    await act(async () => {
      await useFooterStore.getState().fetchFooters(1, 10, 'total');
    });

    const state = useFooterStore.getState();
    expect(state.footers).toEqual(fakeFooters);
    expect(state.stats.total).toBe(1);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('adds a footer and updates state', async () => {
    const newFooter = { description: 'Footer2', logo: 'logo2.png', socialmedia: 'tw', status: true } as any;
    const returnedFooter = { ...newFooter, _id: '2' };
    mockedAxios.post.mockResolvedValueOnce({ data: { data: returnedFooter } });

    await act(async () => {
      await useFooterStore.getState().addFooter(new FormData());
    });

    const state = useFooterStore.getState();
    expect(state.footers.find(f => f._id === '2')).toEqual(returnedFooter);
    expect(state.stats.total).toBe(1); // Incremented
    expect(state.stats.active).toBe(1);
  });

  it('updates a footer by ID', async () => {
    const footer = { _id: '1', description: 'Old', logo: '', socialmedia: '', status: true } as FooterInfo;
    useFooterStore.setState({ footers: [footer], stats: { total: 1, active: 1, inactive: 0 }, page: 1, totalPages: 1 });
    const updatedData = { description: 'Updated', logo: '', socialmedia: '', status: false } as any;

    mockedAxios.put.mockResolvedValueOnce({ data: { data: { ...updatedData, _id: '1' } } });

    await act(async () => {
      await useFooterStore.getState().updateFooter('1', new FormData());
    });

    const updatedFooter = useFooterStore.getState().footers.find(f => f._id === '1');
    expect(updatedFooter?.description).toBe('Updated');
    expect(updatedFooter?.status).toBe(false);
  });

  it('deletes a footer by ID', async () => {
    const footer = { _id: '1', description: 'Footer', status: true } as FooterInfo;
    useFooterStore.setState({ footers: [footer], stats: { total: 1, active: 1, inactive: 0 }, page: 1, totalPages: 1 });
    mockedAxios.delete.mockResolvedValueOnce({});

    await act(async () => {
      await useFooterStore.getState().deleteFooter('1');
    });

    expect(useFooterStore.getState().footers.find(f => f._id === '1')).toBeUndefined();
    expect(useFooterStore.getState().stats.total).toBe(0);
  });

  it('restores a trashed footer', async () => {
    const footer = { _id: 't1', description: 'Trash', status: false } as FooterInfo;
    useFooterStore.setState({ footers: [footer] });
    mockedAxios.patch.mockResolvedValueOnce({});

    await act(async () => {
      await useFooterStore.getState().restoreFooterInfo('t1');
    });

    expect(useFooterStore.getState().footers.find(f => f._id === 't1')).toBeUndefined();
  });

  it('permanently deletes a footer', async () => {
    const footer = { _id: 'p1', description: 'Permanent' } as FooterInfo;
    useFooterStore.setState({ footers: [footer] });
    mockedAxios.delete.mockResolvedValueOnce({});

    await act(async () => {
      await useFooterStore.getState().deleteFooterInfoPermanently('p1');
    });

    expect(useFooterStore.getState().footers.find(f => f._id === 'p1')).toBeUndefined();
  });

  it('fetches trash footers', async () => {
    const trash = [{ _id: 't1', description: 'Trash Footer', status: false }] as FooterInfo[];
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: trash, meta: { total: 1, active: 0, inactive: 1, totalPages: 1 } },
    });

    await act(async () => {
      await useFooterStore.getState().fetchTrashFooters(1, 10, 'inactive');
    });

    const state = useFooterStore.getState();
    expect(state.footers).toEqual(trash);
    expect(state.stats.inactive).toBe(1);
  });

  it('handles errors in fetchFooters', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'Network error' });

    await expect(useFooterStore.getState().fetchFooters(1, 10)).rejects.toMatch('Network error');
    expect(useFooterStore.getState().error).toBe('Network error');
  });

  it('fetches footer by ID', async () => {
    const footer = { _id: 'id1', description: 'ByID', status: true } as FooterInfo;
    mockedAxios.get.mockResolvedValueOnce({ data: { data: footer } });

    let result: FooterInfo | null = null;
    await act(async () => {
      result = await useFooterStore.getState().fetchFooterById('id1');
    });

    expect(result).toEqual(footer);
  });

  it('handles error in fetchFooterById', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'ID error' });

    await expect(useFooterStore.getState().fetchFooterById('id404')).rejects.toMatch('ID error');
    expect(useFooterStore.getState().error).toBe('ID error');
  });
});
