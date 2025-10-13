import { act } from 'react';
import { useAgencyStore } from '../AgencyStore';
import type { Agency } from '../../types/common';
import axios from 'axios';
import ImportedURL from '../../common/urls';

const { API } = ImportedURL;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAgency: Agency = {
  _id: '1',
  agencyName: 'Test Agency',
  agencyLogo: 'logo.png',
  name: 'John Doe',
  photo: 'photo.png',
  position: 'Manager',
  yourEmail: 'john@example.com',
  yourPhone: '1234567890',
  companyEmail: 'company@example.com',
  companyPhone: '0987654321',
  companyRegistrationNumberGST: 'GST123456',
  website: 'example.com',
  uploadIdProof: 'id.pdf',
  uploadBusinessProof: 'business.pdf',
  agencyAddress: 'Test Address',
  agencyLocation: 'Test Location',
  country: 'Test Country',
  state: 'Test State',
  city: 'Test City',
  pincode: '123456',
  status: true,
  priority: 1
};

describe('useAgencyStore', () => {
  beforeEach(() => {
    useAgencyStore.setState({
      agencies: [],
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
    });
    jest.clearAllMocks();
  });

  describe('fetchAgencies', () => {
    it('fetches agencies successfully with meta data', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { agencies: [mockAgency], meta: { totalPages: 2 } }
      });
      await act(async () => {
        await useAgencyStore.getState().fetchAgencies(1, 10);
      });
      expect(useAgencyStore.getState().agencies.length).toBe(1);
      expect(useAgencyStore.getState().totalPages).toBe(2);
      expect(useAgencyStore.getState().loading).toBe(false);
    });

    it('fetches agencies successfully with data field', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [mockAgency] }
      });
      await act(async () => {
        await useAgencyStore.getState().fetchAgencies(1, 10);
      });
      expect(useAgencyStore.getState().agencies.length).toBe(1);
      expect(useAgencyStore.getState().loading).toBe(false);
    });

    it('handles fetchAgencies error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(useAgencyStore.getState().fetchAgencies(1, 10)).rejects.toThrow('Network error');
      expect(useAgencyStore.getState().error).toBe('Network error');
      expect(useAgencyStore.getState().loading).toBe(false);
    });

    it('handles fetchAgencies error with response data', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'API Error'
          }
        }
      };
      mockedAxios.get.mockRejectedValueOnce(errorResponse);
      
      await expect(async () => {
        await useAgencyStore.getState().fetchAgencies(1, 10);
      }).rejects.toEqual(errorResponse);

      expect(useAgencyStore.getState().error).toBe('API Error');
      expect(useAgencyStore.getState().loading).toBe(false);
    });
  });

  describe('fetchAgencyById', () => {
    it('fetches agency by id successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { data: mockAgency } });
      let agency = null;

      // Set initial state
      useAgencyStore.setState({ loading: true });

      await act(async () => {
        agency = await useAgencyStore.getState().fetchAgencyById('1');
      });
      expect(agency).toEqual(mockAgency);
      expect(useAgencyStore.getState().loading).toBe(false);
    });

    it('handles fetchAgencyById network error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));
      let agency = null;
      await act(async () => {
        agency = await useAgencyStore.getState().fetchAgencyById('badid');
      });
      expect(agency).toBeNull();
      expect(useAgencyStore.getState().error).toBe('Not found');
    });

    it('handles fetchAgencyById API error', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Agency not found'
          }
        }
      });
      let agency = null;
      await act(async () => {
        agency = await useAgencyStore.getState().fetchAgencyById('badid');
      });
      expect(agency).toBeNull();
      expect(useAgencyStore.getState().error).toBe('Agency not found');
    });
  });

  describe('addAgency', () => {
    it('adds an agency successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockAgency });
      const formData = new FormData();
      await act(async () => {
        await useAgencyStore.getState().addAgency(formData);
      });
      expect(mockedAxios.post).toHaveBeenCalledWith(API.addAgency, formData);
      expect(useAgencyStore.getState().loading).toBe(false);
      expect(useAgencyStore.getState().error).toBe(null);
    });

    it('handles addAgency error', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Add failed'));
      await expect(useAgencyStore.getState().addAgency(new FormData())).rejects.toThrow('Add failed');
      expect(useAgencyStore.getState().error).toBe('Add failed');
      expect(useAgencyStore.getState().loading).toBe(false);
    });

    it('handles addAgency API error', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Invalid data'
          }
        }
      };
      mockedAxios.post.mockRejectedValueOnce(errorResponse);
      
      await expect(async () => {
        await useAgencyStore.getState().addAgency(new FormData());
      }).rejects.toEqual(errorResponse);

      expect(useAgencyStore.getState().error).toBe('Invalid data');
      expect(useAgencyStore.getState().loading).toBe(false);
    });
  });

  describe('updateAgency', () => {
    it('updates an agency successfully', async () => {
      mockedAxios.put.mockResolvedValueOnce({ data: mockAgency });
      const formData = new FormData();
      await act(async () => {
        await useAgencyStore.getState().updateAgency('1', formData);
      });
      expect(mockedAxios.put).toHaveBeenCalledWith(`${API.updateAgency}1`, formData);
      expect(useAgencyStore.getState().loading).toBe(false);
      expect(useAgencyStore.getState().error).toBe(null);
    });

    it('handles updateAgency error', async () => {
      mockedAxios.put.mockRejectedValueOnce(new Error('Update failed'));
      await expect(useAgencyStore.getState().updateAgency('1', new FormData())).rejects.toThrow('Update failed');
      expect(useAgencyStore.getState().error).toBe('Update failed');
      expect(useAgencyStore.getState().loading).toBe(false);
    });
  });

  describe('deleteAgency', () => {
    it('deletes an agency successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });
      await act(async () => {
        await useAgencyStore.getState().deleteAgency('1');
      });
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API.deleteAgency}1`);
      expect(useAgencyStore.getState().loading).toBe(false);
      expect(useAgencyStore.getState().error).toBe(null);
    });

    it('handles deleteAgency error', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Delete failed'));
      await expect(useAgencyStore.getState().deleteAgency('1')).rejects.toThrow('Delete failed');
      expect(useAgencyStore.getState().error).toBe('Delete failed');
      expect(useAgencyStore.getState().loading).toBe(false);
    });
  });

  describe('toggleStatusAgency', () => {
    it('toggles agency status successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            status: 'active'
          }
        }
      };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      useAgencyStore.setState({
        agencies: [mockAgency]
      });

      await act(async () => {
        await useAgencyStore.getState().toggleStatusAgency('1');
      });

      expect(mockedAxios.patch).toHaveBeenCalledWith(`${API.toggleStatusAgency}1`);
      expect(useAgencyStore.getState().loading).toBe(false);
      expect(useAgencyStore.getState().error).toBe(null);
      expect(useAgencyStore.getState().agencies[0].status).toBe(true);
    });

    it('handles toggleStatusAgency error', async () => {
      mockedAxios.patch.mockRejectedValueOnce(new Error('Toggle failed'));
      await expect(useAgencyStore.getState().toggleStatusAgency('1')).rejects.toThrow('Toggle failed');
      expect(useAgencyStore.getState().error).toBe('Toggle failed');
      expect(useAgencyStore.getState().loading).toBe(false);
    });
  });

  describe('restoreAgency', () => {
    it('restores an agency successfully', async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { success: true } });
      await act(async () => {
        await useAgencyStore.getState().restoreAgency('1');
      });
      expect(mockedAxios.patch).toHaveBeenCalledWith(`${API.restoreAgency}1`);
      expect(useAgencyStore.getState().loading).toBe(false);
      expect(useAgencyStore.getState().error).toBe(null);
    });

    it('handles restoreAgency error', async () => {
      mockedAxios.patch.mockRejectedValueOnce(new Error('Restore failed'));
      await expect(useAgencyStore.getState().restoreAgency('1')).rejects.toThrow('Restore failed');
      expect(useAgencyStore.getState().error).toBe('Restore failed');
      expect(useAgencyStore.getState().loading).toBe(false);
    });
  });

  describe('deleteAgencyPermanently', () => {
    it('permanently deletes an agency successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });
      await act(async () => {
        await useAgencyStore.getState().deleteAgencyPermanently('1');
      });
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API.permanentDeleteAgency}1`);
      expect(useAgencyStore.getState().loading).toBe(false);
      expect(useAgencyStore.getState().error).toBe(null);
    });

    it('handles permanent delete error', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Delete failed'));
      await expect(useAgencyStore.getState().deleteAgencyPermanently('1')).rejects.toThrow('Delete failed');
      expect(useAgencyStore.getState().error).toBe('Delete failed');
      expect(useAgencyStore.getState().loading).toBe(false);
    });
  });

  describe('fetchTrashAgencies', () => {
    it('fetches trashed agencies successfully', async () => {
      const mockData = {
        data: {
          agencies: [mockAgency],
          total: 5,
          page: 1,
          limit: 20
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockData);

      await act(async () => {
        await useAgencyStore.getState().fetchTrashAgencies(1, 20);
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API.trashAgencyList}?page=1&limit=20`);
      expect(useAgencyStore.getState().agencies).toEqual([mockAgency]);
      expect(useAgencyStore.getState().page).toBe(1);
      expect(useAgencyStore.getState().totalPages).toBe(1);
      expect(useAgencyStore.getState().loading).toBe(false);
      expect(useAgencyStore.getState().error).toBe(null);
    });

    it('handles fetchTrashAgencies error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Fetch failed'));
      await expect(useAgencyStore.getState().fetchTrashAgencies()).rejects.toThrow('Fetch failed');
      expect(useAgencyStore.getState().error).toBe('Fetch failed');
      expect(useAgencyStore.getState().loading).toBe(false);
    });

    it('handles non-array response', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          agencies: null
        }
      });

      await act(async () => {
        await useAgencyStore.getState().fetchTrashAgencies();
      });

      expect(useAgencyStore.getState().agencies).toEqual([]);
      expect(useAgencyStore.getState().loading).toBe(false);
      expect(useAgencyStore.getState().error).toBe(null);
    });
  });
});
