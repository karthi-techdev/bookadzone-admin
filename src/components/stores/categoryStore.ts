import { create } from 'zustand';
import axios from 'axios';
import ImportedURL from '../common/urls';
import type { Category } from '../types/common';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchCategories: (page?: number, limit?: number) => Promise<void>;
  fetchCategoryById: (id: string) => Promise<Category | null>;
  addCategory: (category: FormData) => Promise<void>;
  updateCategory: (id: string, category: FormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleStatusCategory: (id: string) => Promise<void>;
  restoreCategory: (id: string) => Promise<void>;
  deleteCategoryPermanently: (id: string) => Promise<void>;
  fetchTrashCategories: (page?: number, limit?: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchCategories: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.listcategory}?page=${page}&limit=${limit}`);
      const categories = res.data.categories || res.data.data || [];
      const totalPages = res.data.meta?.totalPages ?? 1;
      set({
        categories: Array.isArray(categories) ? categories : [],
        page,
        totalPages,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch categories', loading: false });
      throw error;
    }
  },

  fetchCategoryById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getcategorybyId}${id}`);
      return res.data?.data as Category;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch category', loading: false });
      return null;
    }
  },

  addCategory: async (formData: FormData) => {
    try {
      set({ loading: true, error: null });
      await axios.post(API.addcategory, formData);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to add category', loading: false });
      throw error;
    }
  },

  updateCategory: async (id: string, formData: FormData) => {
    try {
      set({ loading: true, error: null });
      await axios.put(`${API.updatecategory}${id}`, formData);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to update category', loading: false });
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deletecategory}${id}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to delete category', loading: false });
      throw error;
    }
  },

  toggleStatusCategory: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatuscategory}${id}`);
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        categories: state.categories.map(c => {
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
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to toggle status', loading: false });
      throw error;
    }
  },

  restoreCategory: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`${API.restorecategory}${id}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to restore category', loading: false });
      throw error;
    }
  },

  deleteCategoryPermanently: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.permanentDeletecategory}${id}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to permanently delete category', loading: false });
      throw error;
    }
  },

  fetchTrashCategories: async (page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.trashcategorylist}?page=${page}&limit=${limit}`);
      // Fix: use agencies from backend response
      const data = res.data as { categories: Category[]; total?: number; page?: number; limit?: number };
      set({
        categories: Array.isArray(data.categories) ? data.categories : [],
        page: data.page || page,
        totalPages: data.total ? Math.ceil(data.total / (data.limit || limit)) : 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch trashed categories', loading: false });
      throw error;
    }
  },
}));
