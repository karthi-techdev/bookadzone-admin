import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
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
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        set({ user: null, token: null });
        delete axios.defaults.headers.common['Authorization'];
        stopExpirationCheck();
      }
      // Don't transform error here, let individual handlers deal with it
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
        toast.success('Logged in successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
        const statusCode = err.response?.status;
        
        // Different handling for rate limiting (429)
        if (statusCode === 429) {
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 8000, // Longer duration for rate limit messages
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
              background: '#ef4444',
            }
          });
        } else {
          // Show toast error for other errors
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        
        // Still throw the error so the component can handle it
        throw new Error(errorMessage);
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      set({ user: null, token: null });
      delete axios.defaults.headers.common['Authorization'];
      stopExpirationCheck();
      toast.info('Logged out successfully', {
        position: "top-right",
        autoClose: 3000,
      });
    },
    forgotPassword: async (email: string) => {
      try {
        await axios.post(`${API.forgotPassword}`, { email });
        toast.success('Password reset link sent to your email!', {
          position: "top-right",
          autoClose: 5000,
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to process request. Please try again.';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
        throw new Error(errorMessage);
      }
    },
    resetPassword: async (token: string, password: string) => {
      try {
        const response = await axios.post(`${API.resetPassword}`, { token, password });
        
        toast.success('Password reset successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);

        return response.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || error.message || 'Failed to reset password. Please try again.';

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });

        // Redirect to login page after showing error
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);

        throw new Error(errorMessage);
      }
    },
    checkTokenValidity,
    startExpirationCheck,
    stopExpirationCheck,
  };
});