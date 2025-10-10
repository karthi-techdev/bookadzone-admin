import { renderHook, act } from '@testing-library/react';
import { useApi, ApiError } from '../apiHooks';
import { toast } from 'react-toastify';
import axios from 'axios';

// Define test error type
type TestError = Error | ApiError;

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useApi());
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('should initialize with custom initial data', () => {
    const initialData = { test: 'data' };
    const { result } = renderHook(() => useApi(initialData));
    
    expect(result.current.data).toEqual(initialData);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  it('should handle successful API request', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockResponse = { data: { data: mockData, status: 200 } };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useApi());

    await act(async () => {
      await result.current.request(
        () => axios.get('/test'),
        { successMessage: 'Success!' }
      );
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('Success!');
  });

  it('should handle API error', async () => {
    const errorMessage = 'Not Found';
    const errorResponse = {
      response: {
        status: 404,
        data: { message: errorMessage },
      },
    };
    mockedAxios.get.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useApi());
    
    let caughtError: unknown = null;
    await act(async () => {
      try {
        await result.current.request(
          () => axios.get('/test'),
          { errorMessage: 'Custom error message' }
        );
        fail('Expected request to throw');
      } catch (err) {
        caughtError = err;
      }
    });

    expect(caughtError).toBeInstanceOf(ApiError);
    if (caughtError instanceof ApiError) {
      expect(caughtError.status).toBe(404);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeInstanceOf(ApiError);
      expect(toast.error).toHaveBeenCalledWith('Custom error message');
    } else {
      fail('Expected ApiError instance');
    }
  });

  it('should handle network error', async () => {
    const networkError = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useApi());
    
    let caughtError: unknown = null;
    await act(async () => {
      try {
        await result.current.request(() => axios.get('/test'));
        fail('Expected request to throw');
      } catch (err) {
        caughtError = err;
      }
    });

    expect(caughtError).toBeInstanceOf(ApiError);
    if (caughtError instanceof ApiError) {
      expect(caughtError.status).toBe(500);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeInstanceOf(ApiError);
      expect(toast.error).toHaveBeenCalledWith('Network Error');
    } else {
      fail('Expected ApiError instance');
    }
  });

  it('should call onSuccess callback with response data', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockResponse = { data: { data: mockData, status: 200 } };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useApi());

    await act(async () => {
      await result.current.request(
        () => axios.get('/test'),
        { onSuccess }
      );
    });

    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });

  it('should call onError callback with error', async () => {
    const errorMessage = 'Not Found';
    const errorResponse = {
      response: {
        status: 404,
        data: { message: errorMessage },
      },
    };
    mockedAxios.get.mockRejectedValueOnce(errorResponse);
    const onError = jest.fn();

    const { result } = renderHook(() => useApi());
    
    let caughtError: unknown = null;
    await act(async () => {
      try {
        await result.current.request(
          () => axios.get('/test'),
          { onError }
        );
        fail('Expected request to throw');
      } catch (err) {
        caughtError = err;
      }
    });

    expect(caughtError).toBeInstanceOf(ApiError);
    if (caughtError instanceof ApiError) {
      expect(onError).toHaveBeenCalledWith(expect.any(ApiError));
    } else {
      fail('Expected ApiError instance');
    }
  });

  it('should reset state correctly', () => {
    const initialData = { test: 'data' };
    const { result } = renderHook(() => useApi(initialData));

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toEqual(initialData);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });
});