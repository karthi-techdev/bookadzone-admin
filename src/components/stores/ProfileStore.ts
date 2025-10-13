import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImportedURL from '../common/urls';
import { useAuthStore } from './AuthStore';

interface ProfileState {
  updateProfile: (data: { email: string; name: string }) => Promise<void>;
  changePassword: (data: { oldPassword: string; newPassword: string }) => Promise<void>;
}

export const useProfileStore = create<ProfileState>(() => ({
  updateProfile: async (data: { email: string; name: string }) => {
    const token = localStorage.getItem('token');
    const csrfToken = localStorage.getItem('csrf-token');
    try {
      // Try to refresh CSRF token first
      try {
        const meResponse = await axios.get(ImportedURL.API.profile.me);
        if (meResponse.data?.csrfToken) {
          localStorage.setItem('csrf-token', meResponse.data.csrfToken);
          axios.defaults.headers.common['X-CSRF-Token'] = meResponse.data.csrfToken;
        }
      } catch (error) {
        console.warn('Failed to refresh CSRF token:', error);
      }

      // Now try to update profile with potentially new CSRF token
      const response = await axios.put(ImportedURL.API.profile.update, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': localStorage.getItem('csrf-token')
        }
      });
      
      // Update auth store with new user data
      useAuthStore.setState({ user: response.data.data });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      if (error.response?.data?.message === 'Invalid CSRF token') {
        toast.error('Session expired. Please try again.');
        // Optionally, you could redirect to login here
      } else {
        const message = error.response?.data?.message || 'Failed to update profile';
        toast.error(message);
      }
      throw error;
    }
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const token = localStorage.getItem('token');
    const csrfToken = localStorage.getItem('csrf-token');
    try {
      const payload = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      };
      await axios.put(ImportedURL.API.profile.changePassword, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken
        }
      });
      toast.success('Password changed successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      throw new Error(message);
    }
  }
}));