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

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const storedExpiry = localStorage.getItem('tokenExpiry');

  // Axios request interceptor to attach token
  // Remove any existing interceptors
  axios.interceptors.request.eject(0);
  
  // Add new request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      const csrfToken = localStorage.getItem('csrf-token');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Setting Authorization header:', `Bearer ${token}`); // Debug log
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
        console.log('Setting CSRF token header:', csrfToken); // Debug log
      } else {
        console.log('No CSRF token found in localStorage'); // Debug log
      }
      
      // Ensure headers object exists
      config.headers = config.headers || {};
      
      console.log('Request config:', { 
        url: config.url, 
        headers: config.headers,
        method: config.method 
      }); // Debug log
      
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
      // Don't transform error here, let individual handlers deal with it
      return Promise.reject(error);
    }
  );

 

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
    
    logout,
    refreshAuth,
    fetchCurrentUser: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        // Try to get user data from local storage first
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          set({ user: parsedUserData });
          return;
        }

        // If no stored data, try to get from /me endpoint
        const response = await axios.get(API.me);
        if (!response.data || !response.data.data) {
          throw new Error('Invalid response format');
        }
        
        const { data, csrfToken } = response.data;
        
        // Update CSRF token if provided
        if (csrfToken) {
          localStorage.setItem('csrf-token', csrfToken);
          axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
        }
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        set({ user: data });
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user data';
        console.error('Failed to fetch user data:', error);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Token invalid or expired
          set({ user: null, token: null });
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          localStorage.removeItem('userData');
          delete axios.defaults.headers.common['Authorization'];
          stopExpirationCheck();
          throw new Error('Session expired. Please login again.');
        } else {
          // Other errors
          throw new Error(errorMessage);
        }
      }
    },
    login: async (payload) => {
      try {
        const res = await axios.post(`${API.login}`, payload);
        console.log('Login response:', res.data); // Debug log
        
        // Extract token from the correct location in response
        const { token, data: user, expiresIn, csrfToken } = res.data;
        const expiryTime = Date.now() + parseExpiresIn(expiresIn);
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        localStorage.setItem('userData', JSON.stringify(user));
        
        // Store CSRF token if present in login response
        if (csrfToken) {
          console.log('Storing CSRF token from login:', csrfToken); // Debug log
          localStorage.setItem('csrf-token', csrfToken);
          axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
        }
        
        // Set token in axios defaults and interceptor
        const bearerToken = `Bearer ${token}`;
        axios.defaults.headers.common['Authorization'] = bearerToken;
        
        // Set state
        set({ user, token });
        
        // Fetch CSRF token after successful login with explicit headers
        try {
          const csrfResponse = await axios.get(API.me, {
            headers: {
              'Authorization': bearerToken
            }
          });
          if (csrfResponse.data?.csrfToken) {
            localStorage.setItem('csrf-token', csrfResponse.data.csrfToken);
            axios.defaults.headers.common['X-CSRF-Token'] = csrfResponse.data.csrfToken;
          }
        } catch (csrfError) {
          console.error('Failed to fetch CSRF token:', csrfError);
        }
        
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
