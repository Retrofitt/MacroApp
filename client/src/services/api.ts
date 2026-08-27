import type { ApiResponse, AuthSuccessData, LoginCredentials, RegisterCredentials, SafeUser } from '../types/auth';

const API_BASE_URL = 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    });

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Network error. Could not connect to API.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export const authApi = {
  register: (credentials: RegisterCredentials) =>
    request<AuthSuccessData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  login: (credentials: LoginCredentials) =>
    request<AuthSuccessData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    request<null>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () =>
    request<{ user: SafeUser }>('/auth/me', {
      method: 'GET',
    }),

  checkHealth: () =>
    request<{ status: string; service: string }>('/health', {
      method: 'GET',
    }),
};
