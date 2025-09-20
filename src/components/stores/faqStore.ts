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
      const data = res.data as {
        data: Faq[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        faqs: Array.isArray(data.data) ? data.data : [],
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
    const res = await axios.patch(`${API.trashfaqlist}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
    const data = res.data as {
      data: Faq[];
      meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
    };
    set({
      faqs: Array.isArray(data.data) ? data.data : [],
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
      await axios.delete(`${API.deletefaq}${id}`);
      set((state) => ({
        faqs: state.faqs.filter(f => f._id !== id),
        error: null,
        loading: false
      }));
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
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        faqs: state.faqs.map(f => {
          if (f._id === id) {
            return {
              ...f,
              status: responseData.data.status === 'active'
            };
          }
          return f;
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