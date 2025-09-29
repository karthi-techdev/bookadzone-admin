import { create } from 'zustand';
import axios from 'axios';
import type { NewsLetter } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
interface NewsLetterState {
  newsLetters: NewsLetter[];
  stats: NewsLetterStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchNewsLetters: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  fetchNewsLetterById: (id: string) => Promise<NewsLetter | null>;
  addNewsLetter: (newsletter: NewsLetter) => Promise<void>;
  updateNewsLetter: (id: string, newsletter: NewsLetter) => Promise<void>;
  deleteNewsLetter: (id: string) => Promise<void>;
  toggleStatusNewsLetter: (id: string) => Promise<void>;
  restoreNewsLetter: (id: string) => Promise<void>;
  deleteNewsLetterPermanently: (id: string) => Promise<void>;
  fetchTrashNewsLetters: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
}


interface NewsLetterStats {
  total: number;
  active: number;
  inactive: number;
}


export const useNewsLetterStore = create<NewsLetterState>((set) => ({
  newsLetters: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchNewsLetters: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
        filter === 'inactive' ? 'inactive' : '';
      const res = await axios.get(`${API.listNewsLetter}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      const data = res.data as {
        data: NewsLetter[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        newsLetters: Array.isArray(data.data) ? data.data : [],
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
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch NEWSLETTERs';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },


// If not already complete, add or verify the fetchTrashNewsLetters method in useNewsLetterStore:

fetchTrashNewsLetters: async (page = 1, limit = 20, filter = 'total') => {
  try {
    set({ loading: true, error: null });
    const statusParam =
      filter === 'active' ? 'active' :
      filter === 'inactive' ? 'inactive' : '';
    const res = await axios.get(`${API.trashNewsLetterList}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
    const data = res.data as {
      data: NewsLetter[];
      meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
    };
    set({
      newsLetters: Array.isArray(data.data) ? data.data : [],
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
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash NEWSLETTERs';
    set({ error: errorMessage, loading: false });
    throw errorMessage;
  }
},

// And ensure restoreNewsLetter and deleteNewsLetterPermanently are implemented:

restoreNewsLetter: async (id: string) => {
  try {
    set({ loading: true, error: null });
    await axios.patch(`${API.restoreNewsLetter}${id}`);
    set((state) => ({
      newsLetters: state.newsLetters.filter(N => N._id !== id),
      error: null,
      loading: false
    }));
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore NEWSLETTER';
    set({ error: errorMessage, loading: false });
    throw errorMessage;
  }
},

deleteNewsLetterPermanently: async (id: string) => {
  try {
    set({ loading: true, error: null });
    await axios.delete(`${API.permanentDeleteNewsLetter}${id}`);
    set((state) => ({
      newsLetters: state.newsLetters.filter(n => n._id !== id),
      error: null,
      loading: false
    }));
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete NEWSLETTER';
    set({ error: errorMessage, loading: false });
    throw errorMessage;
  }
},

  fetchNewsLetterById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getNewsLetter}${id}`);
      const responseData = res.data as { data: NewsLetter };
      set({ loading: false, error: null });
      return responseData.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch NEWSLETTER';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  addNewsLetter: async (newsletter: NewsLetter) => {
    try {
      set({ loading: true, error: null });
      // Convert boolean status to string for backend
      const payload = {
        ...newsletter,
        status: newsletter.status === true ? 'active' : newsletter.status === false ? 'inactive' : newsletter.status
      };
      const res = await axios.post(API.addNewsLetter, payload);
      const responseData = res.data as { data: NewsLetter };
      set((state) => ({
        newsLetters: [...state.newsLetters, responseData.data],
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add NEWSLETTER';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  updateNewsLetter: async (id: string, newsletter: NewsLetter) => {
    try {
      set({ loading: true, error: null });
      // Convert boolean status to string for backend
      const payload = {
        ...newsletter,
        status: newsletter.status === true ? 'active' : newsletter.status === false ? 'inactive' : newsletter.status
      };
      const res = await axios.put(`${API.updateNewsLetter}${id}`, payload);
      const responseData = res.data as { data: NewsLetter };
      set((state) => ({
        newsLetters: state.newsLetters.map(n => n._id === id ? { ...n, ...responseData.data } : n),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update NEWSLETTER';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteNewsLetter: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deleteNewsLetter}${id}`);
      set((state) => ({
        newsLetters: state.newsLetters.filter(n => n._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete NEWSLETTER';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  toggleStatusNewsLetter: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatusNewsLetter}${id}`);
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        newsLetters: state.newsLetters.map(n => {
          if (n._id === id) {
            return {
              ...n,
              status: responseData.data.status === 'active'
            };
          }
          return n;
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