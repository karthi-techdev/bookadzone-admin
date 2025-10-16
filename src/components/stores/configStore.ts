const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

import { create } from 'zustand';
import axios from 'axios';
import type { Config } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

interface ConfigField {
  key: string;
  value: string;
}

interface ConfigStats {
  total: number;
  active: number;
  inactive: number;
}

interface ConfigState {
  configs: Config[];
  stats: ConfigStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  pageConfigFields: ConfigField[];
  fetchConfigs: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  fetchConfigById: (id: string) => Promise<Config | null>;
  addConfig: (config: Config) => Promise<void>;
  updateConfig: (id: string, config: Config) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
  toggleStatusConfig: (id: string) => Promise<void>;
  restoreConfig: (id: string) => Promise<void>;
  deleteConfigPermanently: (id: string) => Promise<void>;
  fetchTrashConfigs: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
  fetchPageConfigFields: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
  configs: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  pageConfigFields: [],

  fetchConfigs: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
        filter === 'inactive' ? 'inactive' : '';
      // Add cache-busting parameter and fix template literal nesting
      const res = await axios.get(
        `${API.listconfig}?page=${page}&limit=${limit}${statusParam ? '&status=' + statusParam : ''}&_=${Date.now()}`
      );
      
      if (res.data.status === true) {
        const { data, meta } = res.data;
        set({
          configs: Array.isArray(data) ? data : [],
          stats: {
            total: meta?.total ?? 0,
            active: meta?.active ?? 0,
            inactive: meta?.inactive ?? 0,
          },
          page: meta?.page ?? page,
          totalPages: meta?.totalPages ?? 1,
          loading: false,
          error: null
        });
      } else {
        throw new Error(res.data.message || 'Failed to fetch configs');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch configs';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchConfigById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getConfig}${id}`);
      const config = res.data.data as Config;
      set({ loading: false });
      return config;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch config';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  addConfig: async (config: Config) => {
    try {
      set({ loading: true, error: null });
      const payload = {
        ...config,
        status: config.status === true ? 'active' : config.status === false ? 'inactive' : config.status || 'active',
        configFields: config.configFields || []
      };
      const res = await axios.post(API.addconfig, payload);
      const responseData = res.data as { data: Config };
      set((state) => ({
        configs: [...state.configs, responseData.data],
        stats: {
          ...state.stats,
          total: state.stats.total + 1,
          active: payload.status === 'active' ? state.stats.active + 1 : state.stats.active
        },
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add config';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  updateConfig: async (id: string, config: Config) => {
    try {
      set({ loading: true, error: null });
      const payload = {
        ...config,
        status: config.status === true ? 'active' : config.status === false ? 'inactive' : config.status,
        configFields: config.configFields || []
      };
      // Add cache-busting parameter
      const res = await axios.put(`${API.updateconfig}${id}?_=${Date.now()}`, payload);
      const responseData = res.data as { data: Config };
      set((state) => ({
        configs: state.configs.map(c => c._id === id ? { ...c, ...responseData.data } : c),
        error: null,
        loading: false
      }));
      // Force refresh the list to get updated data
      await useConfigStore.getState().fetchConfigs(useConfigStore.getState().page);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update config';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteConfig: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Add cache-busting parameter
      await axios.delete(`${API.deleteconfig}${id}?_=${Date.now()}`);
      set((state) => ({
        configs: state.configs.filter(c => c._id !== id),
        error: null,
        loading: false
      }));
      // Force refresh the list after deletion
      await useConfigStore.getState().fetchConfigs(useConfigStore.getState().page);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete config';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  toggleStatusConfig: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Add cache-busting parameter
      const res = await axios.patch(`${API.toggleStatusconfig}${id}?_=${Date.now()}`);
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        configs: state.configs.map(c => {
          if (c._id === id) {
            return {
              ...c,
              status: responseData.data.status === 'active'
            };
          }
          return c;
        }),
        error: null,
        loading: false
      }));
      // Force refresh the list to get updated stats
      await useConfigStore.getState().fetchConfigs(useConfigStore.getState().page);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to toggle status';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  restoreConfig: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Add cache-busting parameter
      await axios.patch(`${API.restoreconfig}${id}?_=${Date.now()}`);
      
      set((state) => ({
        configs: state.configs.filter(c => c._id !== id),
        error: null,
        loading: false
      }));

      // Force refresh the trash list after restore
      await useConfigStore.getState().fetchTrashConfigs(useConfigStore.getState().page);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore config';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteConfigPermanently: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Add cache-busting parameter
      await axios.delete(`${API.permanentDeleteconfig}${id}?_=${Date.now()}`);
      set((state) => ({
        configs: state.configs.filter(c => c._id !== id),
        error: null,
        loading: false
      }));
      // Force refresh the trash list after permanent deletion
      await useConfigStore.getState().fetchTrashConfigs(useConfigStore.getState().page);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete config';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchTrashConfigs: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
        filter === 'inactive' ? 'inactive' : '';
      // Add cache-busting parameter
      const res = await axios.get(
        `${API.trashconfiglist}?page=${page}&limit=${limit}${statusParam ? '&status=' + statusParam : ''}&_=${Date.now()}`
      );
      const data = res.data as {
        data: Config[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        configs: Array.isArray(data.data) ? data.data : [],
        stats: {
          total: data.meta?.total ?? 0,
          active: data.meta?.active ?? 0,
          inactive: data.meta?.inactive ?? 0,
        },
        page,
        totalPages: data.meta?.totalPages ?? 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash configs';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
  
  fetchPageConfigFields: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(API.pagesConfig);
      const data = res.data.data;
      const fields = Array.isArray(data) ? data : Object.entries(data).map(([key, value]) => ({ key, value }));
      set({
        pageConfigFields: fields,
        loading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch page config fields';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
}));