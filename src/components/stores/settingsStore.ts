
import { create } from 'zustand';
import axios from 'axios';
import ImportedURL from '../common/urls';
import type { Settings } from '../types/common';

const { API } = ImportedURL;


interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<Settings> | FormData) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ error: 'No authentication token', loading: false });
      return;
    }

    try {
      set(state => ({ ...state, loading: true, error: null }));
      const res = await axios.get(
        API.listconfig.replace('configs/', 'settings/'),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data as { data: Settings };
      set(state => ({ ...state, settings: data.data, loading: false }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch settings';
      set(state => ({ ...state, error: errorMessage, loading: false }));
      console.error('Error fetching settings:', errorMessage);
    }
  },

  updateSettings: async (data: Partial<Settings> | FormData) => {
    try {
      set({ loading: true, error: null });
      let config = {};
      let payload = data;
      if (data instanceof FormData) {
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      }
      const res = await axios.put(API.listconfig.replace('configs/', 'settings/'), payload, config);
      const responseData = res.data as { data: Settings };
      set({ settings: responseData.data, loading: false, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update settings';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
}));
