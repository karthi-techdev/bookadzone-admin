import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
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
    console.log("Category API Response:", res.data);

    const api = res.data;

    set({
      categories: Array.isArray(api.categories) ? api.categories : [],
      page: api.page || page,
      totalPages: Math.ceil((api.total || 1) / limit),
      loading: false,
    });

  } catch (error: any) {
    set({
      error: error?.response?.data?.message || error?.message || "Failed to fetch categories",
      loading: false,
    });
    throw error;
  }
},


 fetchCategoryById: async (id: string) => {
  try {
    const res = await axios.get(`${API.getcategorybyId}${id}`);

    if (res.data && res.data.category) {
      return res.data.category;   
    }

    return null; 
  } catch (error) {
    console.error("fetchCategoryById error:", error);
    throw error;
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

      // Immediately remove the deleted category from state
      set(state => ({
        categories: state.categories.filter(cat => cat._id !== id),
        loading: false,
        error: null,
        // Recalculate totalPages
        totalPages: Math.ceil((state.categories.length - 1) / 20)
      }));

      // Do not return any value to match the expected Promise<void> type
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete category';
      set({ error: errorMessage, loading: false });
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
      console.log('Trash categories response:', res.data); // Debug log

      const categories = res.data?.data || [];
      const meta = res.data?.meta || {};

      set({
        categories: Array.isArray(categories) ? categories : [],
        page: meta.page || page,
        totalPages: meta.totalPages || 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trashed categories';
      set({ error: errorMessage, loading: false });
      console.error('Fetch trash categories error:', error);
      throw error;
    }
  },
}));
