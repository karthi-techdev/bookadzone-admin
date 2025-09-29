import { act } from 'react';
import { useBannerStore } from './bannerStore';
import axios from 'axios';

jest.mock('axios');

const mockBanner = { homepage: { bannerOne: { title: 'Title' } } };
const mockBannerResponse = { data: mockBanner };
const mockError = { response: { data: { message: 'API error' } }, message: 'Network error' };

describe('useBannerStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBannerStore.setState({ banner: null, loading: false, error: null });
  });

  it('fetchBanner sets banner on success', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce(mockBannerResponse);
    await act(async () => {
      await useBannerStore.getState().fetchBanner();
    });
    expect(useBannerStore.getState().banner).toEqual(mockBanner);
    expect(useBannerStore.getState().loading).toBe(false);
    expect(useBannerStore.getState().error).toBeNull();
  });

  it('fetchBanner sets error on failure', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(mockError);
    await expect(
      act(async () => {
        await useBannerStore.getState().fetchBanner();
      })
    ).rejects.toEqual('API error');
    expect(useBannerStore.getState().error).toBe('API error');
    expect(useBannerStore.getState().loading).toBe(false);
  });

  it('updateBanner sets banner on success', async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce(mockBannerResponse);
    const fullBannerOne = {
      title: 'New Title',
      highlightedText: '',
      image1: '',
      subHead1: '',
      subDescription1: '',
      image2: '',
      subHead2: '',
      subDescription2: '',
      image3: '',
      subHead3: '',
      subDescription3: ''
    };
    const fullBannerTwo = {
      backgroundImage: '',
      title: '',
      description: '',
      features: [],
      buttonName: '',
      buttonUrl: ''
    };
    await act(async () => {
      await useBannerStore.getState().updateBanner({ homepage: { bannerOne: fullBannerOne, bannerTwo: fullBannerTwo } });
    });
    expect(useBannerStore.getState().banner).toEqual(mockBanner);
    expect(useBannerStore.getState().loading).toBe(false);
    expect(useBannerStore.getState().error).toBeNull();
  });

  it('updateBanner sets error on failure', async () => {
    (axios.put as jest.Mock).mockRejectedValueOnce(mockError);
    const fullBannerOne = {
      title: 'New Title',
      highlightedText: '',
      image1: '',
      subHead1: '',
      subDescription1: '',
      image2: '',
      subHead2: '',
      subDescription2: '',
      image3: '',
      subHead3: '',
      subDescription3: ''
    };
    const fullBannerTwo = {
      backgroundImage: '',
      title: '',
      description: '',
      features: [],
      buttonName: '',
      buttonUrl: ''
    };
    await expect(
      act(async () => {
        await useBannerStore.getState().updateBanner({ homepage: { bannerOne: fullBannerOne, bannerTwo: fullBannerTwo } });
      })
    ).rejects.toEqual('API error');
    expect(useBannerStore.getState().error).toBe('API error');
    expect(useBannerStore.getState().loading).toBe(false);
  });

  it('updateBanner handles FormData', async () => {
    (axios.put as jest.Mock).mockResolvedValueOnce(mockBannerResponse);
    const formData = new FormData();
    await act(async () => {
      await useBannerStore.getState().updateBanner(formData);
    });
    expect(axios.put).toHaveBeenCalledWith(expect.anything(), formData, expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }));
    expect(useBannerStore.getState().banner).toEqual(mockBanner);
  });
});