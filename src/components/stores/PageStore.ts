import { create } from 'zustand';
import axios from 'axios';
import type { Page } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface PageState {
  pages: Page[];
  stats: PageStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchPages: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  fetchPageById: (id: string) => Promise<Page | null>;
  addPage: (page: Page) => Promise<void>;
  updatePage: (id: string, page: Page) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  toggleStatusPage: (id: string) => Promise<void>;
  restorePage: (id: string) => Promise<void>;
  deletePagePermanently: (id: string) => Promise<void>;
  fetchTrashPages: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
}

interface PageStats {
  total: number;
  active: number;
  inactive: number;
}

export const usePageStore = create<PageState>((set) => ({
  pages: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchPages: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
        filter === 'inactive' ? 'inactive' : '';
      const res = await axios.get(`${API.listPage}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      const data = res.data as {
        data: Page[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        pages: Array.isArray(data.data) ? data.data : [],
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
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch pages';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchTrashPages: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
        filter === 'inactive' ? 'inactive' : '';
      const res = await axios.get(`${API.trashPageList}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      const data = res.data as {
        data: Page[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        pages: Array.isArray(data.data) ? data.data : [],
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
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash pages';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  restorePage: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`${API.restorePage}${id}`);
      set((state) => ({
        pages: state.pages.filter(p => p._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore page';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deletePagePermanently: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.permanentDeletePage}${id}`);
      set((state) => ({
        pages: state.pages.filter(p => p._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete page';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchPageById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getPage}${id}`);
      const responseData = res.data as { data: Page };
      set({ loading: false, error: null });
      return responseData.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch page';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  addPage: async (page: Page) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(API.addPage, page);
      const responseData = res.data as { data: Page };
      set((state) => ({
        pages: [...state.pages, responseData.data],
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add page';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  updatePage: async (id: string, page: Page) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API.updatePage}${id}`, page);
      const responseData = res.data as { data: Page };
      set((state) => ({
        pages: state.pages.map(p => p._id === id ? { ...p, ...responseData.data } : p),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update page';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deletePage: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deletePage}${id}`);
      set((state) => ({
        pages: state.pages.filter(p => p._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete page';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  toggleStatusPage: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatusPage}${id}`);
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        pages: state.pages.map(p => {
          if (p._id === id) {
            return {
              ...p,
              status: responseData.data.status as 'active' | 'inactive'
            };
          }
          return p;
        }),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to toggle status';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  }

}));
