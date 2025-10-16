
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { User } from '../types/common';
import ImportedURL from '../common/urls';
import { checkTokenValidity } from '../utils/auth/tokenValidation';
import { startExpirationCheck, stopExpirationCheck } from '../utils/auth/expirationCheck';
import { parseExpiresIn } from '../utils/auth/utils';

const { API } = ImportedURL;

interface IMenuItem {
  name: string;
  slug: string;
  icon: string;
  path?: string;
  sequenceOrder: number;
  children?: ISubmenuItem[];
  special?: boolean;
}

interface ISubmenuItem {
  name: string;
  slug: string;
  path: string;
  icon: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  menus: IMenuItem[] | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  checkTokenValidity: () => boolean;
  startExpirationCheck: () => void;
  stopExpirationCheck: () => void;
  fetchCurrentUser: () => Promise<void>;
}

<<<<<<< HEAD


export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const storedExpiry = localStorage.getItem('tokenExpiry');


  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        set({ user: null, token: null });
        delete axios.defaults.headers.common['Authorization'];
        stopExpirationCheck();
      }
      return Promise.reject(error);
    }
  );

  // Initialize token validation
  if (token && storedExpiry) {
    if (checkTokenValidity()) {
      startExpirationCheck();
    }
  }

=======
export const useAuthStore = create<AuthState>((set, get) => {
  const storedMenus = localStorage.getItem('menus');
>>>>>>> 6d68b3d53446aca9522715e11cc55b96757cc2cb
  return {
    user: null,
    token: localStorage.getItem('token'),
    menus: storedMenus ? JSON.parse(storedMenus) : null,
    login: async (payload: { email: string; password: string }) => {
      try {
        const res = await axios.post(API.login, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        const { token, data: user, expiresIn, csrfToken, menus } = res.data;
        const expiryTime = Date.now() + parseExpiresIn(expiresIn);
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('menus', JSON.stringify(menus));
        if (csrfToken) {
          localStorage.setItem('csrf-token', csrfToken);
          axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user, token, menus });
        startExpirationCheck();
        toast.success('Logged in successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
        });
        throw new Error(errorMessage);
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userData');
      localStorage.removeItem('csrf-token');
      localStorage.removeItem('menus');
      set({ user: null, token: null, menus: null });
      delete axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['X-CSRF-Token'];
      stopExpirationCheck();
    },
    refreshAuth: async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.post(API.refresh, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const { token: newToken, data: user, expiresIn, menus } = res.data;
        const expiryTime = Date.now() + parseExpiresIn(expiresIn);
        localStorage.setItem('token', newToken);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('menus', JSON.stringify(menus));
        set({ user, token: newToken, menus });
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        startExpirationCheck();
      } catch (err: any) {
        get().logout();
      }
    },
    fetchCurrentUser: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          set({ user: JSON.parse(userData) });
          return;
        }
        const response = await axios.get(API.me);
        if (!response.data || !response.data.data) throw new Error('Invalid response format');
        const { data, csrfToken } = response.data;
        if (csrfToken) {
          localStorage.setItem('csrf-token', csrfToken);
          axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
        }
        localStorage.setItem('userData', JSON.stringify(data));
        set({ user: data });
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          get().logout();
          throw new Error('Session expired. Please login again.');
        } else {
          throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user data');
        }
      }
    },
    forgotPassword: async (email: string) => {
      try {
        await axios.post(API.forgotPassword, { email }, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Password reset link sent to your email!', {
          position: 'top-right',
          autoClose: 5000,
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to process request. Please try again.';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
        });
        throw new Error(errorMessage);
      }
    },
    resetPassword: async (token: string, password: string) => {
      try {
        const response = await axios.post(API.resetPassword, { token, password }, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Password reset successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password. Please try again.';
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
        });
        throw new Error(errorMessage);
      }
    },
    checkTokenValidity,
    startExpirationCheck,
    stopExpirationCheck,
  };
});