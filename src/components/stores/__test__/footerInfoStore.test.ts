import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import { useFooterStore } from '../FooterInfoStore';
import ImportedURL from '../../common/urls';
import type { FooterInfo } from '../../types/common';

const { API } = ImportedURL;

jest.mock('axios');

const mockFooter: FooterInfo = {
  _id: '1',
  logo: 'logo.png',
  description: 'Test Footer',
  socialmedia: 'facebook,twitter',
  socialmedialinks: 'https://fb.com,https://twitter.com',
  google: 'google.com',
  appstore: 'appstore.com',
  status: true,
  priority: 1
};
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FooterInfoStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { result } = renderHook(() => useFooterStore());
    act(() => {
      result.current.footers = [];
      result.current.loading = false;
      result.current.error = null;
      result.current.stats = { total: 0, active: 0, inactive: 0 };
    });
  });

  describe('fetchFooters', () => {
    it('should fetch footers successfully with status filter', async () => {
      const mockData = {
        data: {
          data: {
            data: [{ _id: '1', description: 'Test Footer', status: true }],
            meta: { total: 1, active: 1, inactive: 0 }
          }
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useFooterStore());
      await act(async () => {
        await result.current.fetchFooters(1, 10, 'active');
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/footerinfo/",
        expect.objectContaining({
          params: expect.objectContaining({
            status: "active"
          })
        })
      );

      expect(result.current.footers).toEqual(mockData.data.data.data);
      expect(result.current.stats).toEqual(mockData.data.data.meta);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should fetch footers with total status', async () => {
      const mockData = {
        data: {
          data: {
            data: [mockFooter],
            meta: { total: 1, active: 1, inactive: 0 }
          }
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useFooterStore());
      await act(async () => {
        await result.current.fetchFooters(1, 10, 'total');
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/v1/footerinfo/",
        expect.objectContaining({
          params: expect.any(Object)
        })
      );
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useFooterStore());
      await act(async () => {
        try {
          await result.current.fetchFooters(1, 10);
        } catch (e) {
          expect(e).toBe('Network error');
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network error');
    });

    it('should handle API error response', async () => {
      const mockError = {
        response: {
          data: {
            message: 'API error message'
          }
        }
      };
      mockedAxios.get.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useFooterStore());
      await act(async () => {
        try {
          await result.current.fetchFooters(1, 10);
        } catch (e) {
          expect(e).toBe('API error message');
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('API error message');
    });
  });

  describe('fetchFooterById', () => {
    it('should fetch a single footer successfully', async () => {
      const mockData = {
        data: {
          data: { _id: '1', description: 'Test Footer', status: true }
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useFooterStore());
      let footer;
      await act(async () => {
        footer = await result.current.fetchFooterById('1');
      });

      expect(footer).toEqual(mockData.data.data);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle errors when fetching single footer', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useFooterStore());
      await act(async () => {
        try {
          await result.current.fetchFooterById('1');
        } catch (e) {
          expect(e).toBe('Network error');
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network error');
    });

    it('should handle API errors when fetching single footer', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Footer not found'
          }
        }
      };
      mockedAxios.get.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useFooterStore());
      await act(async () => {
        try {
          await result.current.fetchFooterById('1');
        } catch (e) {
          expect(e).toBe('Footer not found');
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Footer not found');
    });
  });

  describe('addFooter', () => {
    it('should add a footer successfully', async () => {
      const mockData = {
        data: {
          data: { _id: '1', description: 'New Footer', status: true }
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockData);

      const formData = new FormData();
      const { result } = renderHook(() => useFooterStore());
      await act(async () => {
        await result.current.addFooter(formData);
      });

      expect(result.current.footers).toContainEqual(mockData.data.data);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('updateFooter', () => {
    it('should update a footer successfully', async () => {
      const existingFooter: FooterInfo = {
        _id: '1',
        logo: 'old-logo.png',
        description: 'Old Footer',
        socialmedia: 'facebook',
        socialmedialinks: 'https://fb.com',
        google: 'google.com',
        appstore: 'appstore.com',
        status: false,
        priority: 1
      };
      const updatedFooter: FooterInfo = {
        _id: '1',
        logo: 'new-logo.png',
        description: 'Updated Footer',
        socialmedia: 'facebook',
        socialmedialinks: 'https://fb.com',
        google: 'google.com',
        appstore: 'appstore.com',
        status: true,
        priority: 1
      };
      const mockData = {
        data: {
          data: updatedFooter
        }
      };
      mockedAxios.put.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useFooterStore());
      act(() => {
        result.current.footers = [existingFooter];
      });

      const formData = new FormData();
      await act(async () => {
        await result.current.updateFooter('1', formData);
      });

      expect(result.current.footers[0]).toEqual(updatedFooter);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('deleteFooter', () => {
    it('should delete a footer successfully', async () => {
      const existingFooter: FooterInfo = {
        _id: '1',
        logo: 'logo.png',
        description: 'Footer to Delete',
        socialmedia: 'facebook',
        socialmedialinks: 'https://fb.com',
        google: 'google.com',
        appstore: 'appstore.com',
        status: true,
        priority: 1
      };
      mockedAxios.delete.mockResolvedValueOnce({});

      const { result } = renderHook(() => useFooterStore());
      act(() => {
        result.current.footers = [existingFooter];
        result.current.stats = { total: 1, active: 1, inactive: 0 };
      });

      await act(async () => {
        await result.current.deleteFooter('1');
      });

      expect(result.current.footers).toHaveLength(0);
      expect(result.current.stats.total).toBe(0);
      expect(result.current.stats.active).toBe(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('restoreFooterInfo', () => {
    it('should restore a footer successfully', async () => {
      const existingFooter: FooterInfo = {
        _id: '1',
        logo: 'logo.png',
        description: 'Footer to Restore',
        socialmedia: 'facebook',
        socialmedialinks: 'https://fb.com',
        google: 'google.com',
        appstore: 'appstore.com',
        status: true,
        priority: 1
      };
      mockedAxios.patch.mockResolvedValueOnce({});

      const { result } = renderHook(() => useFooterStore());
      act(() => {
        result.current.footers = [existingFooter];
      });

      await act(async () => {
        await result.current.restoreFooterInfo('1');
      });

      expect(result.current.footers).toHaveLength(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('deleteFooterInfoPermanently', () => {
    it('should permanently delete a footer successfully', async () => {
      const existingFooter: FooterInfo = {
        _id: '1',
        logo: 'logo.png',
        description: 'Footer to Delete',
        socialmedia: 'facebook',
        socialmedialinks: 'https://fb.com',
        google: 'google.com',
        appstore: 'appstore.com',
        status: true,
        priority: 1
      };
      mockedAxios.delete.mockResolvedValueOnce({});

      const { result } = renderHook(() => useFooterStore());
      act(() => {
        result.current.footers = [existingFooter];
      });

      await act(async () => {
        await result.current.deleteFooterInfoPermanently('1');
      });

      expect(result.current.footers).toHaveLength(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('fetchTrashFooters', () => {
    it('should fetch trash footers successfully', async () => {
      const mockData = {
        data: {
          data: [{ _id: '1', description: 'Trash Footer', status: true }],
          meta: { total: 1, active: 1, inactive: 0, totalPages: 1 }
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useFooterStore());
      await act(async () => {
        await result.current.fetchTrashFooters(1, 10);
      });

      expect(result.current.footers).toEqual(mockData.data.data);
      expect(result.current.stats).toEqual({
        total: mockData.data.meta.total,
        active: mockData.data.meta.active,
        inactive: mockData.data.meta.inactive
      });
      expect(result.current.page).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });
});