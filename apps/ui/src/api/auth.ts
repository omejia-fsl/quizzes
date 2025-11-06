import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth.ts';
import type { LoginCredentials, RegisterCredentials } from '../types';

export const useLoginMutation = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      await login(credentials);
    },
    onSuccess: () => {
      toast.success('Successfully logged in!');
      void navigate({ to: '/' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
};

export const useRegisterMutation = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      await register(credentials);
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
      void navigate({ to: '/' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });
};

export const useLogoutMutation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      toast.success('Successfully logged out!');
      void navigate({ to: '/' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Logout failed. Please try again.');
    },
  });
};
