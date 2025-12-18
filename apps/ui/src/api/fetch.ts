import { ApiRequestError } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>;
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
}

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

function buildUrl(
  baseUrl: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, String(value));
    }
  });

  const queryString = urlParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

function buildHeaders(options: ApiFetchOptions): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!options.skipAuth) {
    const token = options.token || getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

function buildRequestOptions(options: ApiFetchOptions): RequestInit {
  const { body } = options;

  return {
    headers: buildHeaders(options),
    ...(body && { body: JSON.stringify(body) }),
  };
}

async function extractErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type');

  try {
    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      return errorData.message || errorData.error || 'Request failed';
    }

    const text = await response.text();
    return text || response.statusText || 'Request failed';
  } catch {
    return response.statusText || 'Request failed';
  }
}

async function processResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ApiRequestError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await response.json();
  }

  return (await response.text()) as T;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const url = buildUrl(`${API_BASE_URL}${endpoint}`, options.params);
  const requestOptions = buildRequestOptions(options);

  try {
    const response = await fetch(url, requestOptions);
    return await processResponse<T>(response);
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
