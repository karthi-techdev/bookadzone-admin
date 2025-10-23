import axios from "axios";
import type { BlogCategory } from "../types/common";
import { create } from 'zustand';
import ImportedURL from "../common/urls";

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
interface BlogState {

  blogCategory: BlogCategory[];
  stats: BlogStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchBlogCategory: (
    page?: number,
    limit?: number,
    filter?: 'total' | 'active' | 'inactive'
  ) => Promise<void>;
  fetchBlogCategoryById: (id: string) => Promise<BlogCategory | null>;
  addBlogCategory: (blogCategory: BlogCategory) => Promise<void>;
  updateBlogCategory: (id: string, blogCategory: BlogCategory) => Promise<void>;
  deleteBlogCategory: (id: string) => Promise<void>;
  restoreBlogCategory: (id: string) => Promise<void>;
  toggleStatusBlogCategory: (id: string) => Promise<void>;
  deleteBlogCategoryPermanently: (id: string) => Promise<void>;
  fetchTrashBlogCategory: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
  fetchAllActiveBlogCategories: () => Promise<void>;
}


const { API } = ImportedURL;
interface BlogStats {
  total: number;
  active: number;
  inactive: number;
}

/**
 * Zustand store for managing BlogCategory entities.
 * Handles CRUD, status toggling, trash operations, and pagination state.
 */
export const useBlogCategoryStore = create<BlogState>((set) => ({
  blogCategory: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  /**
   * Fetch paginated blog categories with optional status filtering.
   * filter: 'total' returns all, 'active' and 'inactive' limit by status.
   */
  fetchBlogCategory: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
          filter === 'inactive' ? 'inactive' : '';
      const res = await axios.get(`${API.listBlogCategory}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      console.log(res, "=-=-=-");

      const data = res.data as {
        data: BlogCategory[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        blogCategory: Array.isArray(data.data) ? data.data : [],
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
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch BlogCategories';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
  fetchBlogCategoryById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getBlogCategory}${id}`);
      const responseData = res.data as { data: BlogCategory };
      set({ loading: false, error: null });
      return responseData.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch Blog';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },
  addBlogCategory: async (blogCategory: BlogCategory) => {
    try {
      set({ loading: true, error: null });
      // Convert boolean status to string for backend
      const payload = {
        ...blogCategory,
        status: blogCategory.status === true ? 'active' : blogCategory.status === false ? 'inactive' : blogCategory.status
      };
      const res = await axios.post(API.addBlogCategory, payload);
      const responseData = res.data as { data: BlogCategory };
      set((state) => ({
        blogCategory: [...state.blogCategory, responseData.data],
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add Blog';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
  updateBlogCategory: async (id: string, blogCategory: BlogCategory) => {
    try {
      set({ loading: true, error: null });
      // Convert boolean status to string for backend
      const payload = {
        ...blogCategory,
        status: blogCategory.status === true ? 'active' : blogCategory.status === false ? 'inactive' : blogCategory.status
      };
      const res = await axios.put(`${API.updateBlogCategory}${id}`, payload);
      const responseData = res.data as { data: BlogCategory };
      set((state) => ({
        blogCategory: state.blogCategory.map(f => f._id === id ? { ...f, ...responseData.data } : f),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update Blogcategory';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
  deleteBlogCategory: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deleteBlogCategory}${id}`);
      set((state) => ({
        blogCategory: state.blogCategory.filter(f => f._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete Blog';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
  toggleStatusBlogCategory: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatusBlogCategory}${id}`);
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        blogCategory: state.blogCategory.map(f => {
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
  },
  deleteBlogCategoryPermanently: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.permanentDeleteBlogCategory}${id}`);
      set((state) => ({
        blogCategory: state.blogCategory.filter(f => f._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete Blog';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
  fetchTrashBlogCategory: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'active' ? 'active' :
          filter === 'inactive' ? 'inactive' : '';
      const res = await axios.get(`${API.trashBlogCategoryList}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
      const data = res.data as {
        data: BlogCategory[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      console.log(res, "res");

      set({
        blogCategory: Array.isArray(data.data) ? data.data : [],
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
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash BlogCategory';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  restoreBlogCategory: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`${API.restoreBlogCategory}${id}`);
      set((state) => ({
        blogCategory: state.blogCategory.filter(f => f._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore BlogCategory';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  /**
   * Fetch all active blog categories.
   * Useful when populating dropdowns or filters that should only show active categories.
   */
  fetchAllActiveBlogCategories: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(API.activeBlogCategory);
      const responseData = res.data as { data: BlogCategory[] };
      set({
        blogCategory: Array.isArray(responseData.data) ? responseData.data : [],
        loading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Failed to fetch active Blog Categories';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

}));