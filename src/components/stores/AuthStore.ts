import { create } from 'zustand';
import axios from 'axios';
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
  checkTokenValidity: () => boolean;
  startExpirationCheck: () => void;
  stopExpirationCheck: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const storedExpiry = localStorage.getItem('tokenExpiry');

  // Axios request interceptor to attach token
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

  // Axios response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        set({ user: null, token: null, menus: null });
        delete axios.defaults.headers.common['Authorization'];
        stopExpirationCheck();
      }
      return Promise.reject(error);
    }
  );

  // Login function
  const login = async (payload: { email: string; password: string }) => {
    const res = await axios.post(`${API.login}`, payload);
    const { token, data: user, expiresIn, menus } = res.data;

    const expiryTime = Date.now() + parseExpiresIn(expiresIn);
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', expiryTime.toString());

    set({ user, token, menus });
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    startExpirationCheck();
  };

  // Refresh auth function (used on page reload)
  const refreshAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`${API.refresh}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { token: newToken, data: user, expiresIn, menus } = res.data;

      const expiryTime = Date.now() + parseExpiresIn(expiresIn);
      localStorage.setItem('token', newToken);
      localStorage.setItem('tokenExpiry', expiryTime.toString());

      set({ user, token: newToken, menus });
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      startExpirationCheck();
    } catch {
      logout();
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    set({ user: null, token: null, menus: null });
    delete axios.defaults.headers.common['Authorization'];
    stopExpirationCheck();
  };

  // Initialize auth on store creation
  if (token && storedExpiry && checkTokenValidity()) {
    startExpirationCheck();
    refreshAuth(); // fetch user + menus after page reload
  }

  return {
    user: null,
    token,
    menus: null,
    login,
    logout,
    refreshAuth,
    checkTokenValidity,
    startExpirationCheck,
    stopExpirationCheck,
  };
});
