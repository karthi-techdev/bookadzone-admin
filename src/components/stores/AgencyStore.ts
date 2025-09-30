import { create } from 'zustand';
import axios from 'axios';
import ImportedURL from '../common/urls';
import type { Agency, AgencyInput } from '../types/common';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface AgencyState {
  agencies: Agency[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchAgencies: (page?: number, limit?: number) => Promise<void>;
  fetchAgencyById: (id: string) => Promise<Agency | null>;
  addAgency: (agency: FormData) => Promise<void>;
  updateAgency: (id: string, agency: FormData) => Promise<void>;
  deleteAgency: (id: string) => Promise<void>;
  toggleStatusAgency: (id: string) => Promise<void>;
  restoreAgency: (id: string) => Promise<void>;
  deleteAgencyPermanently: (id: string) => Promise<void>;
  fetchTrashAgencies: (page?: number, limit?: number) => Promise<void>;
}

export const useAgencyStore = create<AgencyState>((set) => ({
  agencies: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchAgencies: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.listAgency}?page=${page}&limit=${limit}`);
      const agencies = res.data.agencies || res.data.data || [];
      const totalPages = res.data.meta?.totalPages ?? 1;
      set({
        agencies: Array.isArray(agencies) ? agencies : [],
        page,
        totalPages,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch agencies', loading: false });
      throw error;
    }
  },

  fetchAgencyById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getAgency}${id}`);
      return res.data?.data as Agency;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch agency', loading: false });
      return null;
    }
  },

  addAgency: async (formData: FormData) => {
    try {
      set({ loading: true, error: null });
      await axios.post(API.addAgency, formData);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to add agency', loading: false });
      throw error;
    }
  },

  updateAgency: async (id: string, formData: FormData) => {
    try {
      set({ loading: true, error: null });
      await axios.put(`${API.updateAgency}${id}`, formData);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to update agency', loading: false });
      throw error;
    }
  },

  deleteAgency: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deleteAgency}${id}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to delete agency', loading: false });
      throw error;
    }
  },

  toggleStatusAgency: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatusAgency}${id}`);
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        agencies: state.agencies.map(a => {
          if (a._id === id) {
            return {
              ...a,
              status: responseData.data.status === 'active'
            };
          }
          return a;
        }),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to toggle status', loading: false });
      throw error;
    }
  },

  restoreAgency: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`${API.restoreAgency}${id}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to restore agency', loading: false });
      throw error;
    }
  },

  deleteAgencyPermanently: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.permanentDeleteAgency}${id}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to permanently delete agency', loading: false });
      throw error;
    }
  },

  fetchTrashAgencies: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.trashAgencyList}?page=${page}&limit=${limit}`);
      // Fix: use agencies from backend response
      const data = res.data as { agencies: Agency[]; total?: number; page?: number; limit?: number };
      set({
        agencies: Array.isArray(data.agencies) ? data.agencies : [],
        page: data.page || page,
        totalPages: data.total ? Math.ceil(data.total / (data.limit || limit)) : 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch trashed agencies', loading: false });
      throw error;
    }
  },
}));
