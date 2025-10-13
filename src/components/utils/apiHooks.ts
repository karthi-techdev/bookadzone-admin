import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import type { AxiosError, AxiosResponse } from 'axios';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    const status = error.response.status;
    const message = (error.response.data as any)?.message || error.message;
    return new ApiError(message, status, error.response.data);
  }
  return new ApiError(error.message, 500);
};

export const useApi = <T>(initialData: T | null = null) => {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const request = useCallback(async <R>(
    apiCall: () => Promise<AxiosResponse<ApiResponse<R>>>,
    options: {
      onSuccess?: (data: R) => void;
      onError?: (error: ApiError) => void;
      successMessage?: string;
      errorMessage?: string;
    } = {}
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null, data: null }));

    try {
      const response = await apiCall();
      const data = response.data.data;

      // Handle success
      if (options.successMessage) {
        toast.success(options.successMessage);
      }

      if (options.onSuccess) {
        await Promise.resolve(options.onSuccess(data));
      }

      setState(prev => ({
        data: data as unknown as T,
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      const apiError = error instanceof ApiError 
        ? error 
        : handleApiError(error as AxiosError);

      if (options.errorMessage) {
        toast.error(options.errorMessage);
      } else {
        toast.error(apiError.message);
      }

      if (options.onError) {
        await Promise.resolve(options.onError(apiError));
      }

      setState({
        data: null,
        loading: false,
        error: apiError
      });

      throw apiError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null
    });
  }, [initialData]);

  return {
    ...state,
    request,
    reset
  };
};