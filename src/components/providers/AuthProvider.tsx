// AuthProvider.tsx
import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/AuthStore';
import axios from 'axios';
import ImportedURL from '../common/urls';
import { parseExpiresIn } from '../utils/auth/utils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { token, checkTokenValidity, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        // Only redirect if not already on /login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return;
      }
      if (!checkTokenValidity()) {
        try {
          const response = await axios.post(ImportedURL.API.refresh, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const { token: newToken, expiresIn, data: user, menus } = response.data;
          const expiryTime = Date.now() + parseExpiresIn(expiresIn);
          localStorage.setItem('token', newToken);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
          localStorage.setItem('userData', JSON.stringify(user));
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          if (menus) {
            useAuthStore.setState({ menus });
          }
        } catch (error: any) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          localStorage.removeItem('userData');
          localStorage.removeItem('csrf-token');
          delete axios.defaults.headers.common['Authorization'];
          delete axios.defaults.headers.common['X-CSRF-Token'];
          useAuthStore.setState({ user: null, token: null, menus: null });
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return;
        }
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        await fetchCurrentUser();
      } catch (error: any) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userData');
        localStorage.removeItem('csrf-token');
        delete axios.defaults.headers.common['Authorization'];
        delete axios.defaults.headers.common['X-CSRF-Token'];
        useAuthStore.setState({ user: null, token: null, menus: null });
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    };
    initializeAuth();
  }, [token]);

  return <>{children}</>;
};