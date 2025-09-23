import { create } from 'zustand';
import axios from 'axios';
import type { FooterInfo } from '../types/common';
import ImportedURL from '../common/urls';
const { API } = ImportedURL;

interface FooterState {
  footers: FooterInfo[];
  loading: boolean;
  page: number;
  totalPages: number;
  error: string | null;
  stats: { total: number; active: number; inactive: number };
  fetchFooters: (page: number, limit: number, status?: 'total' | 'active' | 'inactive') => Promise<void>;
  fetchFooterById: (id: string) => Promise<FooterInfo>;
  addFooter: (footer: FormData) => Promise<void>;
  updateFooter: (id: string, footer: FormData) => Promise<void>;
  deleteFooter: (id: string) => Promise<void>;
  restoreFooterInfo: (id: string) => Promise<void>;
  deleteFooterInfoPermanently: (id: string) => Promise<void>;
  fetchTrashFooters: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
}

export const useFooterStore = create<FooterState>((set) => ({
  footers: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  stats: { total: 0, active: 0, inactive: 0 },

  fetchFooters: async (page: number, limit: number, status?: 'total' | 'active' | 'inactive') => {
    try {
      set({ loading: true, error: null });
      const params = { page, limit, status: status !== 'total' ? status : undefined };
      const res = await axios.get(API.listfooterinfo, { params });
      const footerData = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      set({
        footers: footerData,
        stats: res.data?.data?.meta || { total: footerData.length, active: 0, inactive: 0 },
        error: null,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch footers';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchFooterById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getfooterinfobyid}${id}`);
      const footer = res.data.data as FooterInfo;
      set({ error: null, loading: false });
      return footer;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch footer';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  addFooter: async (footer: FormData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(API.addfooterinfo, footer, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const responseData = res.data.data as FooterInfo;
      set((state) => ({
        footers: [...state.footers, responseData],
        stats: {
          ...state.stats,
          total: state.stats.total + 1,
          active: responseData.status ? state.stats.active + 1 : state.stats.active,
          inactive: !responseData.status ? state.stats.inactive + 1 : state.stats.inactive,
        },
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add footer';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  updateFooter: async (id: string, footer: FormData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API.updatefooterinfo}${id}`, footer, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const responseData = res.data.data as FooterInfo;
      set((state) => ({
        footers: state.footers.map((f) => (f._id === id ? { ...f, ...responseData } : f)),
        stats: {
          ...state.stats,
          active: responseData.status
            ? state.stats.active + (state.footers.find((f) => f._id === id)?.status ? 0 : 1)
            : state.stats.active - (state.footers.find((f) => f._id === id)?.status ? 1 : 0),
          inactive: !responseData.status
            ? state.stats.inactive + (state.footers.find((f) => f._id === id)?.status ? 1 : 0)
            : state.stats.inactive - (state.footers.find((f) => f._id === id)?.status ? 0 : 1),
        },
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update footer';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteFooter: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deletefooterinfo}${id}`);
      set((state) => ({
        footers: state.footers.filter((f) => f._id !== id),
        stats: {
          ...state.stats,
          total: state.stats.total - 1,
          active: state.footers.find((f) => f._id === id)?.status
            ? state.stats.active - 1
            : state.stats.active,
          inactive: !state.footers.find((f) => f._id === id)?.status
            ? state.stats.inactive - 1
            : state.stats.inactive,
        },
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete footer';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  restoreFooterInfo: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`${API.restorefooterinfo}${id}`);
      set((state) => ({
        footers: state.footers.filter(f => f._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore FooterInfo';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteFooterInfoPermanently: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.permanentDeletefooterinfo}${id}`);
      set((state) => ({
        footers: state.footers.filter(f => f._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete FooterInfo';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchTrashFooters: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam = filter === 'total' ? '' : `&status=${filter}`;
      const res = await axios.get(`${API.trashfooterinfolist}?page=${page}&limit=${limit}${statusParam}`); // Changed to GET
      const data = res.data as {
        data: FooterInfo[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        footers: Array.isArray(data.data) ? data.data : [],
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
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash FooterInfo';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
}));