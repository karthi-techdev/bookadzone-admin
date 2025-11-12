import { create } from 'zustand';
import axios from 'axios';
import type { User } from '../types/common';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface UserStats {
    total: number;
    admin: number;
    editor: number;
    viewer: number;
}

interface UserState {
    users: User[];
    stats: UserStats;
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    fetchUsers: (
        page?: number,
        limit?: number,
        filter?: 'total' | 'admin' | 'editor' | 'viewer'
    ) => Promise<void>;
    fetchUserById: (id: string) => Promise<User | null>;
    addUser: (user: User) => Promise<void>;
    updateUser: (id: string, user: User) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    toggleStatusUser: (id: string) => Promise<void>;
    restoreUser: (id: string) => Promise<void>;
    deleteUserPermanently: (id: string) => Promise<void>;
    fetchTrashUsers: (page?: number, limit?: number, filter?: 'total' | 'admin' | 'editor' | 'viewer') => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    stats: { total: 0, admin: 0, editor: 0, viewer: 0 },
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,

    fetchUsers: async (page = 1, limit = 20, filter = 'total') => {
        try {
            set({ loading: true, error: null });
            const roleParam =
                filter === 'admin' ? 'admin' :
                    filter === 'editor' ? 'editor' :
                        filter === 'viewer' ? 'viewer' : '';
            const res = await axios.get(`${API.listUsers}?page=${page}&limit=${limit}${roleParam ? `&role=${roleParam}` : ''}`);
            if (res.data.status === true && res.data.data) {
                const { data: users, meta } = res.data.data;
                set({
                    users: Array.isArray(users) ? users : [],
                    stats: {
                        total: meta.total ?? 0,
                        admin: meta.admin ?? 0,
                        editor: meta.editor ?? 0,
                        viewer: meta.viewer ?? 0,
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
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch users';
            set({ error: errorMessage, loading: false });
            throw errorMessage;
        }
    },

    fetchTrashUsers: async (page = 1, limit = 20, filter = 'total') => {
        try {
            set({ loading: true, error: null });
            const roleParam =
                filter === 'admin' ? 'admin' :
                    filter === 'editor' ? 'editor' :
                        filter === 'viewer' ? 'viewer' : '';
            const res = await axios.get(`${API.trashUserList}?page=${page}&limit=${limit}${roleParam ? `&role=${roleParam}` : ''}`);
            if (res.data.status === true && res.data.data) {
                const { data: users, meta } = res.data.data;
                set({
                    users: Array.isArray(users) ? users : [],
                    stats: {
                        total: meta.total ?? 0,
                        admin: meta.admin ?? 0,
                        editor: meta.editor ?? 0,
                        viewer: meta.viewer ?? 0,
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
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash users';
            set({ error: errorMessage, loading: false });
            throw errorMessage;
        }
    },

    restoreUser: async (id: string) => {
        try {
            set({ loading: true, error: null });
            await axios.patch(`${API.restoreUser}${id}`);
            set((state) => ({
                users: state.users.filter(u => u._id !== id),
                error: null,
                loading: false
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore user';
            set({ error: errorMessage, loading: false });
            throw errorMessage;
        }
    },

    deleteUserPermanently: async (id: string) => {
        try {
            set({ loading: true, error: null });
            await axios.delete(`${API.permanentDeleteUser}${id}`);
            set((state) => ({
                users: state.users.filter(u => u._id !== id),
                error: null,
                loading: false
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete user';
            set({ error: errorMessage, loading: false });
            throw errorMessage;
        }
    },

    fetchUserById: async (id: string) => {
        try {
            set({ loading: true, error: null });
            const res = await axios.get(`${API.getUser}${id}`);
            const responseData = res.data as { data: User };
            set({ loading: false, error: null });
            return responseData.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch user';
            set({ error: errorMessage, loading: false });
            return null;
        }
    },

   addUser: async (user: User) => {
    try {
        set({ loading: true, error: null });

        const payload = { ...user };
        console.log("🟢 [addUser] Sending payload to backend:", payload);

        const res = await axios.post(API.addUser, payload);

        console.log("🟢 [addUser] API endpoint:", API.addUser);
        console.log("🟢 [addUser] Backend response:", res.data);

        const responseData = res.data as { data: User };
        set((state) => ({
            users: [...state.users, responseData.data],
            error: null,
            loading: false
        }));
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add user';
        console.error("🔴 [addUser] Error:", errorMessage);
        console.error("🔴 [addUser] Error details:", error?.response?.data);
        set({ error: errorMessage, loading: false });
        throw errorMessage;
    }
},


    updateUser: async (id: string, user: User) => {
        try {
            set({ loading: true, error: null });
            const payload = { ...user };
            const res = await axios.put(`${API.updateUser}${id}`, payload);
            const responseData = res.data as { data: User };
            set((state) => ({
                users: state.users.map(u => u._id === id ? { ...u, ...responseData.data } : u),
                error: null,
                loading: false
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user';
            set({ error: errorMessage, loading: false });
            throw errorMessage;
        }
    },

    deleteUser: async (id: string) => {
        try {
            set({ loading: true, error: null });
            const res = await axios.delete(`${API.deleteUser}${id}`);
            if (res.data.status === true) {
                set((state) => ({
                    users: state.users.filter(u => u._id !== id),
                    stats: {
                        ...state.stats,
                        total: Math.max(0, state.stats.total - 1),
                        admin: res.data.data?.role === 'admin' ? Math.max(0, state.stats.admin - 1) : state.stats.admin,
                        editor: res.data.data?.role === 'editor' ? Math.max(0, state.stats.editor - 1) : state.stats.editor,
                        viewer: res.data.data?.role === 'viewer' ? Math.max(0, state.stats.viewer - 1) : state.stats.viewer
                    },
                    error: null,
                    loading: false
                }));
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete user';
            set({ error: errorMessage, loading: false });
            throw errorMessage;
        }
    },

    toggleStatusUser: async (id: string) => {
        try {
            set({ loading: true, error: null });
            const res = await axios.patch(`${API.toggleStatusUser}${id}`);
            if (res.data.status === true && res.data.data) {
                const updatedUser = res.data.data;
                set((state) => ({
                    users: state.users.map(u => u._id === id ? updatedUser : u),
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