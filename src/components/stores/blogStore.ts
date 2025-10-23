import { create } from 'zustand';
import axios from 'axios';
import ImportedURL from '../common/urls';
import type { Blog } from '../types/common';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface BlogState {
    blogs: Blog[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    fetchBlogs: (page?: number, limit?: number) => Promise<void>;
    fetchBlogById: (id: string) => Promise<Blog | null>;
    addBlog: (blog: FormData) => Promise<void>;
    updateBlog: (id: string, blog: FormData) => Promise<void>;
    deleteBlog: (id: string) => Promise<void>;
    toggleStatusBlog: (id: string) => Promise<void>;
    restoreBlog: (id: string) => Promise<void>;
    deleteBlogPermanently: (id: string) => Promise<void>;
    fetchTrashBlogs: (page?: number, limit?: number) => Promise<void>;
}

export const useBlogStore = create<BlogState>((set) => ({
    blogs: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,

    fetchBlogs: async (page = 1, limit = 20) => {
        try {
            set({ loading: true, error: null });
            const res = await axios.get(`${API.listBlog}?page=${page}&limit=${limit}`);
            const blogs = res.data.blogs || res.data.data || [];
            const totalPages = res.data.meta?.totalPages ?? 1;
            set({
                blogs: Array.isArray(blogs) ? blogs : [],
                page,
                totalPages,
                loading: false,
                error: null
            });
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch blogs', loading: false });
            throw error;
        }
    },

    fetchBlogById: async (id: string) => {
        try {
            set({ loading: true, error: null });
            const res = await axios.get(`${API.getBlogbyId}${id}`);
            return res.data?.data as Blog;
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch blog', loading: false });
            return null;
        }
    },

    addBlog: async (formData: FormData) => {
        try {
            set({ loading: true, error: null });
            await axios.post(API.addBlog, formData);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to add blog', loading: false });
            throw error;
        }
    },

    updateBlog: async (id: string, formData: FormData) => {
        try {
            set({ loading: true, error: null });
            await axios.put(`${API.updateBlog}${id}`, formData);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to update blog', loading: false });
            throw error;
        }
    },

    deleteBlog: async (id: string) => {
        try {
            set({ loading: true, error: null });
            await axios.delete(`${API.deleteBlog}${id}`);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to delete blog', loading: false });
            throw error;
        }
    },

    toggleStatusBlog: async (id: string) => {
        try {
            set({ loading: true, error: null });
            const res = await axios.patch(`${API.toggleStatusBlog}${id}`);
            const responseData = res.data as { data: { status: string } };
            set((state) => ({
                blogs: state.blogs.map(b => {
                    if (b._id === id) {
                        return {
                            ...b,
                            status: responseData.data.status === 'active'
                        };
                    }
                    return b;
                }),
                error: null,
                loading: false
            }));
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to toggle status', loading: false });
            throw error;
        }
    },

    restoreBlog: async (id: string) => {
        try {
            set({ loading: true, error: null });
            await axios.patch(`${API.restoreBlog}${id}`);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to restore blog', loading: false });
            throw error;
        }
    },

    deleteBlogPermanently: async (id: string) => {
        try {
            set({ loading: true, error: null });
            await axios.delete(`${API.permanentDeleteBlog}${id}`);
            set({ loading: false });
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to permanently delete blog', loading: false });
            throw error;
        }
    },

    fetchTrashBlogs: async (page = 1, limit = 20) => {
        try {
            set({ loading: true, error: null });
            const res = await axios.get(`${API.trashBloglist}?page=${page}&limit=${limit}`);
            // Fix: use agencies from backend response
            const data = res.data as { blogs: Blog[]; total?: number; page?: number; limit?: number };
            set({
                blogs: Array.isArray(data.blogs) ? data.blogs : [],
                page: data.page || page,
                totalPages: data.total ? Math.ceil(data.total / (data.limit || limit)) : 1,
                loading: false,
                error: null
            });
        } catch (error: any) {
            set({ error: error?.response?.data?.message || error?.message || 'Failed to fetch trashed blogs', loading: false });
            throw error;
        }
    },
}));
