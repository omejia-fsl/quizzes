import { apiFetch } from '../fetch';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@quiz-app/shared-models/models/auth';
import type { User } from '@quiz-app/shared-models/models/user';

export const login = (credentials: LoginCredentials) =>
  apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
    skipAuth: true,
  });

export const register = (credentials: RegisterCredentials) =>
  apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: credentials,
    skipAuth: true,
  });

export const getProfile = () =>
  apiFetch<{ user: User }>('/auth/profile', {
    method: 'GET',
  });

export const logout = () =>
  apiFetch<void>('/auth/logout', {
    method: 'POST',
  });
