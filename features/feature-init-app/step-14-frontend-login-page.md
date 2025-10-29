# Step 14: Frontend - Login Page

## Goal
Build a functional login page with React Hook Form, Yup validation, and integration with the auth store. Include error handling, loading states, and link to register page.

## Prerequisites
- Step 13 completed (Auth store fully functional)
- react-hook-form, yup, @hookform/resolvers installed

## Files to Create
- `apps/ui/src/routes/login.tsx` - Login page route
- `apps/ui/src/shared/components/ui/Input.tsx` - Reusable input component
- `apps/ui/src/shared/components/ui/Button.tsx` - Reusable button component

## Implementation Details

### 1. Create Reusable Input Component (`apps/ui/src/shared/components/ui/Input.tsx`)

```bash
mkdir -p apps/ui/src/shared/components/ui
```

```typescript
import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg border
            bg-white dark:bg-slate-800
            border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

### 2. Create Reusable Button Component (`apps/ui/src/shared/components/ui/Button.tsx`)

```typescript
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  isLoading?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading = false, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600',
      secondary: 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700',
      outline: 'border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

### 3. Create Login Page (`apps/ui/src/routes/login.tsx`)

```typescript
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { useLoginMutation } from '../shared/hooks/queries/useAuthMutation'
import { useAuth } from '../shared/hooks/useAuth'
import { Input } from '../shared/components/ui/Input'
import { Button } from '../shared/components/ui/Button'
import type { LoginCredentials } from '../shared/types'

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const loginMutation = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: LoginCredentials) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password Field */}
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting || loginMutation.isPending}
            >
              {isSubmitting || loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
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

          {/* Demo Credentials (Development Only) */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                Demo Credentials (Dev Only)
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Email: demo@example.com<br />
                Password: password123
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
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
  )
}
```

### 4. Generate Routes

```bash
pnpm --filter ui generate-routes
```

## Verification Steps

1. **Start both servers:**
   ```bash
   pnpm dev:api  # Terminal 1
   pnpm dev:ui   # Terminal 2
   ```

2. **Navigate to login page:**
   - Go to http://localhost:5173/login

3. **Test form validation:**
   - Try submitting empty form → Should show required errors
   - Enter invalid email → Should show email error
   - Enter short password → Should show length error

4. **Test login with wrong credentials:**
   - Enter wrong email/password
   - Should show toast error: "Invalid credentials"

5. **Create test user (if needed):**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

6. **Test successful login:**
   - Enter valid credentials
   - Should see success toast
   - Should redirect to /dashboard
   - Navbar should show username
   - Token should be in localStorage

7. **Test redirect when authenticated:**
   - While logged in, navigate to /login
   - Should auto-redirect to /dashboard

8. **Test UI components:**
   - Input focus states (blue ring)
   - Button loading state (spinner)
   - Error messages (red text below input)
   - Dark mode appearance

9. **Test accessibility:**
   - Tab through form fields
   - Submit with Enter key
   - Labels associated with inputs

## Success Criteria
✅ Login page renders correctly
✅ Form validation works with Yup
✅ React Hook Form integration working
✅ Login mutation calls API
✅ Success redirects to dashboard
✅ Error handling with toast notifications
✅ Loading states shown during submission
✅ Redirect when already authenticated
✅ Link to register page works
✅ Dark mode support
✅ Responsive design
✅ Accessible form

## Troubleshooting

**Issue:** Form doesn't submit
- **Fix:** Check handleSubmit wraps onSubmit
- Verify yupResolver is configured

**Issue:** Validation not working
- **Fix:** Ensure @hookform/resolvers installed
- Check yup schema is correct

**Issue:** Login succeeds but doesn't redirect
- **Fix:** Check useLoginMutation navigation
- Verify TanStack Router navigate works

**Issue:** Inputs not styled correctly
- **Fix:** Check Tailwind classes compile
- Verify dark: variants work

**Issue:** Password field shows text
- **Fix:** Ensure type="password" on input
- Check HTML attributes passed correctly

## Form Features

1. **Validation:** Real-time with Yup schema
2. **Error Display:** Below each field with red styling
3. **Loading States:** Disabled form during submission
4. **Auto-Complete:** Email and password hints
5. **Enter Key:** Submit form on Enter
6. **Redirect Logic:** Auto-redirect if authenticated
7. **Demo Credentials:** Shown in development

## Styling Features

1. **Responsive:** Works on all screen sizes
2. **Centered Layout:** Vertical and horizontal centering
3. **Card Design:** Elevated card with shadow
4. **Focus States:** Blue ring on focus
5. **Dark Mode:** Full support with transitions
6. **Loading Spinner:** Animated during submission

## File Structure After This Step
```
apps/ui/src/
├── shared/
│   └── components/
│       └── ui/
│           ├── Input.tsx          # New: Reusable input
│           └── Button.tsx         # New: Reusable button
└── routes/
    └── login.tsx                  # New: Login page
```

## Next Step
**Step 15: Frontend - Register Page** - Build registration form with username, email, password fields
