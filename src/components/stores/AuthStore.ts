import { create } from 'zustand';
import axios from 'axios';
import type{ User } from '../types/common';
import ImportedURL from '../common/urls';
import { checkTokenValidity } from '../utils/auth/tokenValidation';
import { startExpirationCheck, stopExpirationCheck } from '../utils/auth/expirationCheck';
import { parseExpiresIn } from '../utils/auth/utils';

const { API } = ImportedURL;

interface AuthState {
  user: User | null;
  token: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkTokenValidity: () => boolean;
  startExpirationCheck: () => void;
  stopExpirationCheck: () => void;
}

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

  return {
    user: null,
    token,
    login: async (payload) => {
      try {
        const res = await axios.post(`${API.login}`, payload);
        const { token, data: user, expiresIn } = res.data as { token: string; data: User; expiresIn: string };
        const expiryTime = Date.now() + parseExpiresIn(expiresIn);
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        set({ user, token });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        startExpirationCheck();
      } catch (err) {
        throw err;
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      set({ user: null, token: null });
      delete axios.defaults.headers.common['Authorization'];
      stopExpirationCheck();
    },
    checkTokenValidity,
    startExpirationCheck,
    stopExpirationCheck,
  };
});