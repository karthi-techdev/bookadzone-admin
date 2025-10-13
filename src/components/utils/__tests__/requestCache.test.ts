import { requestCache, cachedAxios } from '../requestCache';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RequestCache', () => {
  beforeEach(() => {
    requestCache.clear();
    jest.clearAllMocks();

    // Mock axios interceptors
    const mockInterceptors = {
      request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() }
    };
    (mockedAxios as any).interceptors = mockInterceptors;

    // Re-initialize RequestCache to set up interceptors
    requestCache.clear();

    // Set up the mock interceptors to actually work
    const mockRequestInterceptor = (config: any) => {
      const cacheConfig = config.cache;
      if (cacheConfig && config.method?.toLowerCase() === 'get') {
        const cacheKey = cacheConfig.cacheKey || config.url;
        const cached = requestCache.get(cacheKey);
        if (cached) {
          const error = new Error('Cache hit');
          Object.assign(error, {
            isAxiosError: true,
            cachedResponse: true,
            response: {
              data: cached,
              status: 304,
              statusText: 'Not Modified',
              headers: {},
              config
            }
          });
          return Promise.reject(error);
        }
      }
      return config;
    };

    const mockResponseInterceptor = (response: any) => {
      const cacheConfig = response.config.cache;
      if (cacheConfig && response.config.method?.toLowerCase() === 'get') {
        const cacheKey = cacheConfig.cacheKey || response.config.url;
        requestCache.set(cacheKey, response.data, cacheConfig.ttl);
      }
      return response;
    };

    // Register the mock interceptors
    mockInterceptors.request.use.mockImplementation((handler) => handler);
    mockInterceptors.response.use.mockImplementation((handler) => handler);

    // Set up default mock behavior for axios.get
    mockedAxios.get.mockImplementation(async (url, config) => {
      const mockData = { data: 'test' };
      const effectiveConfig = {
        ...config,
        method: 'get',
        url
      };

      try {
        await mockRequestInterceptor(effectiveConfig);
        const response = {
          data: mockData,
          status: 200,
          statusText: 'OK',
          config: effectiveConfig,
          headers: {}
        };
        await mockResponseInterceptor(response);
        return response;
      } catch (error: any) {
        if (error.cachedResponse) {
          return error.response;
        }
        throw error;
      }
    });
  });

  describe('Cache Management', () => {

    it('should cache GET requests', async () => {
      const mockData = { data: 'test' };
      const mockResponse = { 
        data: mockData,
        status: 200,
        config: { method: 'get', url: '/test', cache: { ttl: 1000 } },
        headers: {},
        statusText: 'OK'
      };

      // First request
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const response1 = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(response1.data).toEqual(mockData);

      // Second request should return cached response
      const response2 = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(response2.status).toBe(304);
      expect(response2.data).toEqual(mockData);
    });

    it('should respect TTL', async () => {
      jest.useFakeTimers();

      const mockData = { data: 'test' };
      const mockResponse = {
        data: mockData,
        status: 200,
        config: { method: 'get' },
        headers: {},
        statusText: 'OK'
      };

      // First request
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const response1 = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(response1.data).toEqual(mockData);

      // Advance time beyond TTL
      jest.advanceTimersByTime(1001);

      // Second request after TTL should be a fresh request
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const response2 = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Should make new request
      expect(response2.data).toEqual(mockData);
      expect(response2.status).toBe(200); // Fresh response, not cached

      jest.useRealTimers();
    });

    it('should use custom cache key', async () => {
      const mockData = { data: 'test' };
      const mockResponse = {
        data: mockData,
        status: 200,
        config: { 
          method: 'get', 
          url: '/test?param=1',
          cache: { 
            cacheKey: 'custom-key',
            ttl: 1000 
          }
        },
        headers: {},
        statusText: 'OK'
      };

      // First request with custom cache key
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const response1 = await cachedAxios.get('/test?param=1', { 
        cache: { 
          cacheKey: 'custom-key',
          ttl: 1000 
        } 
      });
      expect(response1.data).toEqual(mockData);

      // Second request should return cached response despite different URL
      const response2 = await cachedAxios.get('/test?param=2', { 
        cache: { 
          cacheKey: 'custom-key',
          ttl: 1000 
        } 
      });
      expect(response2.status).toBe(304);
      expect(response2.data).toEqual(mockData);
    });

    it('should not cache non-GET requests', async () => {
      const mockData = { data: 'test' };
      mockedAxios.post.mockResolvedValue({ data: mockData });

      // Multiple POST requests
      await cachedAxios.post('/test', { data: '1' });
      await cachedAxios.post('/test', { data: '1' });

      expect(mockedAxios.post).toHaveBeenCalledTimes(2); // Should make both requests
    });
  });

  describe('Cache Invalidation', () => {
    it('should clear entire cache', async () => {
      const mockData = { data: 'test' };
      const mockResponse = {
        data: mockData,
        status: 200,
        config: { method: 'get' },
        headers: {},
        statusText: 'OK'
      };

      // First request mocks normal response
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      
      // First request
      const response1 = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(response1.data).toEqual(mockData);
      
      // Clear cache
      requestCache.clear();

      // Second request should not use cache
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const response2 = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(response2.data).toEqual(mockData);
      expect(response2.status).toBe(200); // Should be fresh response
      expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Should make new request
    });

    it('should invalidate specific cache entry', async () => {
      const mockData = { data: 'test' };
      const mockResponse = {
        data: mockData,
        status: 200,
        config: { method: 'get' },
        headers: {},
        statusText: 'OK'
      };

      // First request mocks normal response
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // First request
      const response1 = await cachedAxios.get('/test', { 
        cache: { 
          cacheKey: 'test-key',
          ttl: 1000 
        } 
      });
      expect(response1.data).toEqual(mockData);
      
      // Invalidate specific key
      requestCache.invalidate('test-key');

      // Second request should be fresh after invalidation
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const response2 = await cachedAxios.get('/test', { 
        cache: { 
          cacheKey: 'test-key',
          ttl: 1000 
        } 
      });
      expect(response2.data).toEqual(mockData);
      expect(response2.status).toBe(200); // Should be fresh response
      expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Should make new request
    });
  });

  describe('Error Handling', () => {
    it('should not cache error responses', async () => {
      const error = new Error('Test error');
      mockedAxios.get.mockRejectedValueOnce(error);
      mockedAxios.get.mockResolvedValueOnce({ data: 'success' });

      // First request (error)
      try {
        await cachedAxios.get('/test', { cache: { ttl: 1000 } });
        fail('Expected error to be thrown');
      } catch (e: any) {
        expect(e.message).toBe('Test error');
      }

      // Second request (success)
      const response = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(response.data).toBe('success');
      expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Should make both requests
    });
  });

  describe('Cache Response', () => {
    it('should return cached response with 304 status', async () => {
      const mockData = { data: 'test' };
      const mockResponse = { 
        data: mockData,
        status: 200,
        config: { 
          method: 'get', 
          url: '/test',
          cache: { ttl: 1000 }
        },
        headers: {},
        statusText: 'OK'
      };      // First request
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      const response1 = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(response1.data).toEqual(mockData);

      // Second request should return cached response
      const response2 = await cachedAxios.get('/test', { cache: { ttl: 1000 } });
      expect(response2.status).toBe(304);
      expect(response2.data).toEqual(mockData);
    });
  });
});