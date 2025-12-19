import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QueryKeys } from '@quiz-app/shared-types/query-keys';
import { login, register, logout } from '../endpoints/auth.ts';

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Logout failed. Please try again.');
    },
  });
};
