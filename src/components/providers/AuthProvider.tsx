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
  const token = localStorage.getItem('token');
  const { checkTokenValidity } = useAuthStore.getState();

  useEffect(() => {
    // Function to handle initial auth state
    const initializeAuth = async () => {
      if (!token) return;

      // First check if token is valid
      if (!checkTokenValidity()) {
        try {
          // Try to refresh the token
          const response = await axios.post(ImportedURL.API.refresh);
          const { token: newToken, expiresIn } = response.data;
          
          // Update token and expiry
          const expiryTime = Date.now() + parseExpiresIn(expiresIn);
          localStorage.setItem('token', newToken);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
          // If refresh fails, clear auth state
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          localStorage.removeItem('userData');
          localStorage.removeItem('csrf-token');
          delete axios.defaults.headers.common['Authorization'];
          delete axios.defaults.headers.common['X-CSRF-Token'];
          return;
        }
      }

      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      try {
        // Try to fetch the current user data
        await useAuthStore.getState().fetchCurrentUser();
      } catch (error: any) {
        console.error('Failed to fetch user data:', error);
        if (error.message.includes('Session expired') || error.response?.status === 404) {
          // Clear auth state if session expired or user not found
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          localStorage.removeItem('userData');
          localStorage.removeItem('csrf-token');
          delete axios.defaults.headers.common['Authorization'];
          delete axios.defaults.headers.common['X-CSRF-Token'];
        }
      }
    };

    initializeAuth();
  }, [token, checkTokenValidity]);

  return <>{children}</>;
};