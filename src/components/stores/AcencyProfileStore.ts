// stores/useAgencyProfileStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

// Ensure axios has auth header
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export interface AgencyProfileData {
  agencyName: string;
  slogan: string;
  about: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

interface AgencyProfileState {
  loading: boolean;
  error: string | null;
  updateAgencyProfile: (data: Partial<AgencyProfileData>) => Promise<void>;
  uploadDocument: (
    file: File,
    type: 'logo' | 'businessLicense' | 'identityProof' | 'agreement'
  ) => Promise<string>;
}

export const useAgencyProfileStore = create<AgencyProfileState>((set) => ({
  loading: false,
  error: null,

  // Update Agency Profile
  updateAgencyProfile: async (data: Partial<AgencyProfileData>) => {
    set({ loading: true, error: null });

    try {
      // Refresh CSRF token if possible
      try {
        const meRes = await axios.get(ImportedURL.API.profile.me);
        if (meRes.data?.csrfToken) {
          localStorage.setItem('csrf-token', meRes.data.csrfToken);
          axios.defaults.headers.common['X-CSRF-Token'] = meRes.data.csrfToken;
        }
      } catch (err) {
        console.warn('CSRF token refresh failed, continuing...');
      }

      await axios.put(API.updateagencyprofile, data, {
        headers: {
          'X-CSRF-Token': localStorage.getItem('csrf-token') || '',
          'Content-Type': 'application/json',
        },
      });

      toast.success('Agency profile updated successfully!');
      set({ loading: false });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update agency profile';

      toast.error(message);
      set({ loading: false, error: message });
      throw error;
    }
  },

  // Upload Document (Logo or KYC)
  uploadDocument: async (file: File, type: 'logo' | 'businessLicense' | 'identityProof' | 'agreement') => {
    set({ loading: true, error: null });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await axios.post(API.updatedocument, formData, {
        headers: {
          'X-CSRF-Token': localStorage.getItem('csrf-token') || '',
          // DO NOT set Content-Type — let browser set it with correct boundary
        },
      });

      if (res.data.status !== true) {
        throw new Error(res.data.message || 'Upload failed');
      }

      const fileUrl = res.data.data?.url || res.data.data?.fileUrl;

      if (!fileUrl) {
        throw new Error('No file URL returned from server');
      }

      toast.success(
        type === 'logo'
          ? 'Logo uploaded successfully'
          : 'Document uploaded successfully'
      );

      set({ loading: false });
      return fileUrl;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to upload document';

      toast.error(message);
      set({ loading: false, error: message });
      throw error;
    }
  },
}));