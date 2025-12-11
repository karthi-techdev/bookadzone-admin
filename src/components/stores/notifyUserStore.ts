import { create } from 'zustand';
import axios from 'axios';
import type { NotifiedUser } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

interface UserState {
  users: NotifiedUser[];
  stats: UserStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchUsers: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
  fetchUserById: (id: string) => Promise<NotifiedUser | null>; // ← Added
  deleteUser: (id: string) => Promise<void>;
}

export const NotifiedUserStore = create<UserState>((set, get) => ({
  users: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchUsers: async (page = 1, limit = 10, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam = filter === 'total' ? '' : `&status=${filter}`;
      const res = await axios.get(`${API.listNotifiedUsers}?page=${page}&limit=${limit}${statusParam}`);

      if (res.data.status === true && res.data.data) {
        const { data: users, meta } = res.data.data;
        set({
          users: Array.isArray(users) ? users : [],
          stats: {
            total: meta.total ?? 0,
            active: meta.active ?? 0,
            inactive: meta.inactive ?? 0,
          },
          page: meta.page,
          totalPages: meta.totalPages,
          loading: false,
        });
      } else {
        throw new Error('Invalid response');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to fetch users';
      set({ error: msg, loading: false });
    }
  },

 fetchUserById: async (id: string) => {
  try {
    set({ loading: true, error: null });
    const res = await axios.get(`${API.getNotifiedUserById}${id}`); 
    const user = res.data.data;
    set({ loading: false });
    return user;
  } catch (err: any) {
    const msg = err?.response?.data?.message || 'Failed to fetch user';
    set({ error: msg, loading: false });
    return null;
  }
},

  deleteUser: async (id: string) => {
    try {
      set({ loading: true });
      await axios.delete(`${API.deleteNotifiedUser}/${id}`);
      set((state) => ({
        users: state.users.filter(u => u._id !== id),
        stats: {
          ...state.stats,
          total: Math.max(0, state.stats.total - 1),
        },
        loading: false,
      }));
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Delete failed';
      set({ error: msg, loading: false });
      throw msg;
    }
  },

 

 
}));