import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { useRegisterMutation } from '../../api/auth.ts';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { CheckCircle } from 'lucide-react';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    )
    .required('Username is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...credentials } = data;
    registerMutation.mutate(credentials);
  };

  const password = watch('password');

  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    if (!pwd) return 'weak';
    if (pwd.length < 6) return 'weak';
    if (pwd.length < 10) return 'medium';
    return 'strong';
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Join and start testing your AI knowledge
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              type="text"
              label="Username"
              placeholder="Choose a username"
              autoComplete="username"
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                type="password"
                label="Password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />

              {password && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength === 'weak'
                            ? 'w-1/3 bg-red-500'
                            : passwordStrength === 'medium'
                              ? 'w-2/3 bg-yellow-500'
                              : 'w-full bg-green-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-medium">
                      {passwordStrength === 'weak' && (
                        <span className="text-red-600 dark:text-red-400">
                          Weak
                        </span>
                      )}
                      {passwordStrength === 'medium' && (
                        <span className="text-yellow-600 dark:text-yellow-400">
                          Medium
                        </span>
                      )}
                      {passwordStrength === 'strong' && (
                        <span className="text-green-600 dark:text-green-400">
                          Strong
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Use at least 10 characters for a strong password
                  </p>
                </div>
              )}
            </div>

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs font-semibold mb-2">
                Password Requirements:
              </p>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-3 h-3 ${password?.length >= 6 ? 'text-green-500' : 'text-slate-400'}`}
                  />
                  At least 6 characters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-3 h-3 ${password?.length >= 10 ? 'text-green-500' : 'text-slate-400'}`}
                  />
                  10+ characters for strong password
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting || registerMutation.isPending}
            >
              {isSubmitting || registerMutation.isPending
                ? 'Creating account...'
                : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By creating an account, you agree to our{' '}
              <a
                href="#"
                className="underline hover:text-slate-700 dark:hover:text-slate-300"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="underline hover:text-slate-700 dark:hover:text-slate-300"
              >
                Privacy Policy
              </a>
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
};
