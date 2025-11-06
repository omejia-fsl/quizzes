import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { useLoginMutation } from '../hooks/mutations/useAuthMutations';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input/Input';
import { Button } from '../components/Button/Button';
import type { LoginCredentials } from '../types';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to continue your learning journey
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting || loginMutation.isPending}
            >
              {isSubmitting || loginMutation.isPending
                ? 'Signing in...'
                : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
