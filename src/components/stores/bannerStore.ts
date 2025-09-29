import { create } from 'zustand';
import axios from 'axios';
import ImportedURL from '../common/urls';
import type { Banner } from '../types/common';

export interface BannerState {
  banner: Banner | null;
  loading: boolean;
  error: string | null;
  fetchBanner: () => Promise<void>;
  updateBanner: (data: Partial<Banner> | FormData) => Promise<void>;
}

export const useBannerStore = create<BannerState>((set) => ({
  banner: null,
  loading: false,
  error: null,

  fetchBanner: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(ImportedURL.API.getBanner);
      const bannerData = res.data as Banner;
      set({ banner: bannerData, loading: false, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch banner management';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  updateBanner: async (data: Partial<Banner> | FormData) => {
    try {
      set({ loading: true, error: null });
      let config = {};
      let payload = data;
      
      if (data instanceof FormData) {
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      }
      
      const res = await axios.put(ImportedURL.API.updateBanner, payload, config);
      const responseData = res.data as Banner;
      set({ banner: responseData, loading: false, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update banner management';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
}));