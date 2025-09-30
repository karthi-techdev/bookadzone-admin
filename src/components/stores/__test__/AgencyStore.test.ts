import { act } from 'react';
import { useAgencyStore } from '../AgencyStore';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useAgencyStore', () => {
  beforeEach(() => {
    useAgencyStore.setState({
      agencies: [],
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
    });
    jest.clearAllMocks();
  });

  it('fetches agencies successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { agencies: [{ _id: '1', agencyName: 'Test' }], meta: { totalPages: 2 } }
    });
    await act(async () => {
      await useAgencyStore.getState().fetchAgencies(1, 10);
    });
    expect(useAgencyStore.getState().agencies.length).toBe(1);
    expect(useAgencyStore.getState().totalPages).toBe(2);
    expect(useAgencyStore.getState().loading).toBe(false);
  });

  it('handles fetchAgencies error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    await expect(useAgencyStore.getState().fetchAgencies(1, 10)).rejects.toThrow('Network error');
    expect(useAgencyStore.getState().error).toBe('Network error');
    expect(useAgencyStore.getState().loading).toBe(false);
  });

  it('fetches agency by id', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: { _id: '1', agencyName: 'Test' } } });
    let agency = null;
    await act(async () => {
      agency = await useAgencyStore.getState().fetchAgencyById('1');
    });
    expect(agency).toEqual({ _id: '1', agencyName: 'Test' });
  });

  it('handles fetchAgencyById error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));
    let agency = null;
    await act(async () => {
      agency = await useAgencyStore.getState().fetchAgencyById('badid');
    });
    expect(agency).toBeNull();
    expect(useAgencyStore.getState().error).toBe('Not found');
  });

  it('adds an agency', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });
    await act(async () => {
      await useAgencyStore.getState().addAgency(new FormData());
    });
    expect(useAgencyStore.getState().loading).toBe(false);
  });

  it('handles addAgency error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Add failed'));
    await expect(useAgencyStore.getState().addAgency(new FormData())).rejects.toThrow('Add failed');
    expect(useAgencyStore.getState().error).toBe('Add failed');
  });

  // Add similar tests for updateAgency, deleteAgency, toggleStatusAgency, restoreAgency, deleteAgencyPermanently, fetchTrashAgencies...
});
