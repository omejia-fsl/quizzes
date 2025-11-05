import { ApiRequestError } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth = false, headers, ...restOptions } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({
        message: response.statusText,
        statusCode: response.status,
      }))) as { message: string; statusCode: number; error?: string };

      throw new ApiRequestError(
        errorData.message || 'Request failed',
        response.status,
        errorData.error,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiRequestError(
        error.message || 'Network error occurred',
        0,
        'NetworkError',
      );
    }

    throw new ApiRequestError('Unknown error occurred', 0);
  }
}

function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem('auth_token');
    return token;
  } catch {
    return null;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};
