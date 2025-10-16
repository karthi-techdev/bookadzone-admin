import { create } from 'zustand';
import axios from 'axios';
import type { Faq } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
interface FaqState {
  faqs: Faq[];
  stats: FaqStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchFaqs: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  fetchFaqById: (id: string) => Promise<Faq | null>;
  addFaq: (faq: Faq) => Promise<void>;
  updateFaq: (id: string, faq: Faq) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  toggleStatusFaq: (id: string) => Promise<void>;
  restoreFaq: (id: string) => Promise<void>;
  deleteFaqPermanently: (id: string) => Promise<void>;
  fetchTrashFaqs: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
}


interface FaqStats {
  total: number;
  active: number;
  inactive: number;
}


export const useFaqStore = create<FaqState>((set) => ({
  faqs: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchFaqs: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
        filter === 'inactive' ? 'inactive' : '';
      const res = await axios.get(`${API.listfaq}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      if (res.data.status === true && res.data.data) {
        const { data: faqs, meta } = res.data.data;
        set({
          faqs: Array.isArray(faqs) ? faqs : [],
          stats: {
            total: meta.total ?? 0,
            active: meta.active ?? 0,
            inactive: meta.inactive ?? 0,
          },
          page: meta.page,
          totalPages: meta.totalPages,
          loading: false,
          error: null
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch FAQs';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },


// If not already complete, add or verify the fetchTrashFaqs method in useFaqStore:

fetchTrashFaqs: async (page = 1, limit = 20, filter = 'total') => {
  try {
    set({ loading: true, error: null });
    const statusParam =
      filter === 'active' ? 'active' :
      filter === 'inactive' ? 'inactive' : '';
    const res = await axios.get(`${API.trashfaqlist}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
    
    if (res.data.status === true && res.data.data) {
      const { data: faqs, meta } = res.data.data;
      set({
        faqs: Array.isArray(faqs) ? faqs : [],
        stats: {
          total: meta.total ?? 0,
          active: meta.active ?? 0,
          inactive: meta.inactive ?? 0,
        },
        page: meta.page,
        totalPages: meta.totalPages,
        loading: false,
        error: null
      });
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash FAQs';
    set({ error: errorMessage, loading: false });
    throw errorMessage;
  }
},

// And ensure restoreFaq and deleteFaqPermanently are implemented:

restoreFaq: async (id: string) => {
  try {
    set({ loading: true, error: null });
    await axios.patch(`${API.restorefaq}${id}`);
    set((state) => ({
      faqs: state.faqs.filter(f => f._id !== id),
      error: null,
      loading: false
    }));
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore FAQ';
    set({ error: errorMessage, loading: false });
    throw errorMessage;
  }
},

deleteFaqPermanently: async (id: string) => {
  try {
    set({ loading: true, error: null });
    await axios.delete(`${API.permanentDeletefaq}${id}`);
    set((state) => ({
      faqs: state.faqs.filter(f => f._id !== id),
      error: null,
      loading: false
    }));
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete FAQ';
    set({ error: errorMessage, loading: false });
    throw errorMessage;
  }
},

  fetchFaqById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getFaq}${id}`);
      const responseData = res.data as { data: Faq };
      set({ loading: false, error: null });
      return responseData.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch FAQ';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  addFaq: async (faq: Faq) => {
    try {
      set({ loading: true, error: null });
      // Convert boolean status to string for backend
      const payload = {
        ...faq,
        status: faq.status === true ? 'active' : faq.status === false ? 'inactive' : faq.status
      };
      const res = await axios.post(API.addfaq, payload);
      const responseData = res.data as { data: Faq };
      set((state) => ({
        faqs: [...state.faqs, responseData.data],
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add FAQ';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  updateFaq: async (id: string, faq: Faq) => {
    try {
      set({ loading: true, error: null });
      // Convert boolean status to string for backend
      const payload = {
        ...faq,
        status: faq.status === true ? 'active' : faq.status === false ? 'inactive' : faq.status
      };
      const res = await axios.put(`${API.updatefaq}${id}`, payload);
      const responseData = res.data as { data: Faq };
      set((state) => ({
        faqs: state.faqs.map(f => f._id === id ? { ...f, ...responseData.data } : f),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update FAQ';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteFaq: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.delete(`${API.deletefaq}${id}`);
      if (res.data.status === true) {
        set((state) => ({
          faqs: state.faqs.filter(f => f._id !== id),
          stats: {
            ...state.stats,
            total: Math.max(0, state.stats.total - 1),
            active: res.data.data?.status === 'active' ? Math.max(0, state.stats.active - 1) : state.stats.active,
            inactive: res.data.data?.status === 'inactive' ? Math.max(0, state.stats.inactive - 1) : state.stats.inactive
          },
          error: null,
          loading: false
        }));
      } else {
        throw new Error('Failed to delete FAQ');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete FAQ';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  toggleStatusFaq: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatusfaq}${id}`);
      if (res.data.status === true && res.data.data) {
        const updatedFaq = res.data.data;
        set((state) => ({
          faqs: state.faqs.map(f => f._id === id ? updatedFaq : f),
          error: null,
          loading: false
        }));
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to toggle status';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  }

}));