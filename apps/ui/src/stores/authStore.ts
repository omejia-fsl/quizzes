import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/api';
import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>(
            '/auth/login',
            credentials,
            {
              skipAuth: true,
            },
          );

          localStorage.setItem('auth_token', response.access_token);

          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>(
            '/auth/register',
            credentials,
            {
              skipAuth: true,
            },
          );

          localStorage.setItem('auth_token', response.access_token);

          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.message || 'Registration failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await api.get<{ user: User }>('/auth/profile');
          set({
            user: response.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
