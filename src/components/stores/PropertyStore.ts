import { create } from 'zustand';
import axios from 'axios';
import ImportedURL from '../common/urls';
import type { Property } from '../types/common';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  propertyConfig: any;
  nextBannerCode: string | null;
  fetchProperties: (page?: number, limit?: number) => Promise<void>;
  fetchPropertyById: (id: string) => Promise<Property | null>;
  addProperty: (property: FormData) => Promise<void>;
  updateProperty: (id: string, property: FormData) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  toggleStatusProperty: (id: string) => Promise<void>;
  restoreProperty: (id: string) => Promise<void>;
  deletePropertyPermanently: (id: string) => Promise<void>;
  fetchTrashProperties: (page?: number, limit?: number) => Promise<void>;
  fetchPropertyConfig: () => Promise<void>;
  fetchNextBannerCode: () => Promise<void>;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  propertyConfig: null,
  nextBannerCode: null,

  fetchProperties: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.listProperty}?page=${page}&limit=${limit}&_=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      const properties = res.data.properties || res.data.data || [];
      const totalPages = res.data.meta?.totalPages ?? 1;
      set({
        properties: Array.isArray(properties) ? properties : [],
        page,
        totalPages,
        loading: false,
        error: null
      });
    } catch (error: any) {
      // Log full error payload to help debugging validation/backend errors
      // eslint-disable-next-line no-console
      console.error('PropertyStore.fetchProperties error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch properties', loading: false });
      throw error;
    }
  },

  fetchPropertyById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getProperty}${id}`);
      const property = res.data?.data as Property;

      if (property) {
        set((state) => ({
          properties: state.properties.map((p) =>
            p._id === id ? { ...p, ...property } : p
          ),
          loading: false,
          error: null
        }));
      } else {
        set({ loading: false });
      }

      return property;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('PropertyStore.fetchPropertyById error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch property', loading: false });
      return null;
    }
  },

  addProperty: async (formData: FormData) => {
    try {
      set({ loading: true, error: null });
      await axios.post(API.addProperty, formData);
      set({ loading: false });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      // console.error('PropertyStore.addProperty error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to add property', loading: false });
      throw error;
    }
  },

  updateProperty: async (id: string, formData: FormData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API.updateProperty}${id}`, formData);
      const updatedProperty = res.data?.data;
      set((state) => ({
        properties: state.properties.map((property) =>
          property._id === id ? { ...property, ...updatedProperty } : property
        ),
        loading: false,
        error: null
      }));

      return updatedProperty;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('PropertyStore.updateProperty error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to update property', loading: false });
      throw error;
    }
  },

  deleteProperty: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deleteProperty}${id}`);
      set(state => ({
        loading: false,
        properties: state.properties.filter(p => p._id !== id)
      }));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('PropertyStore.deleteProperty error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to delete property', loading: false });
      throw error;
    }
  },

  toggleStatusProperty: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatusProperty}${id}`);
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        properties: state.properties.map(p => {
          if (p._id === id) {
            return {
              ...p,
              status: responseData.data.status === 'active' ? 'active' : 'inactive'
            };
          }
          return p;
        }),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('PropertyStore.toggleStatusProperty error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to toggle status', loading: false });
      throw error;
    }
  },

  restoreProperty: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`${API.restoreProperty}${id}`);
      set(state => ({
        loading: false,
        error: null,
        properties: state.properties.filter(p => p._id !== id)
      }));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('PropertyStore.restoreProperty error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to restore property', loading: false });
      throw error;
    }
  },

  deletePropertyPermanently: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.permanentDeleteProperty}${id}`);
      set(state => ({
        loading: false,
        error: null,
        properties: state.properties.filter(p => p._id !== id)
      }));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('PropertyStore.deletePropertyPermanently error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to permanently delete property', loading: false });
      throw error;
    }
  },

  fetchTrashProperties: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.trashPropertyList}?page=${page}&limit=${limit}&_=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      });
      const data = res.data as { properties: Property[]; total?: number; page?: number; limit?: number };
      set({
        properties: Array.isArray(data.properties) ? data.properties : [],
        page: data.page || page,
        totalPages: data.total ? Math.ceil(data.total / (data.limit || limit)) : 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('PropertyStore.fetchTrashProperties error:', error?.response?.data || error?.message || error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch trashed properties', loading: false });
      throw error;
    }
  },

  fetchPropertyConfig: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(API.propertyConfig);
      console.log('Property config response:', res.data);
      set({
        propertyConfig: res.data?.data || res.data,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error fetching property config:', error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch property config', loading: false });
      throw error;
    }
  },

  fetchNextBannerCode: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.listProperty}next-banner-code`);
      const bannerCode = res.data?.data?.bannerCode;
      set({
        nextBannerCode: bannerCode,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error fetching next banner code:', error);
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch next banner code', loading: false });
      throw error;
    }
  },
}));
