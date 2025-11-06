# Step 15: Frontend - Register Page

## Goal
Build a registration page with username, email, and password fields. Include password confirmation, validation, and integration with the auth store. Complete the authentication flow.

## Prerequisites
- Step 14 completed (Login page working)
- UI components (Input, Button) created

## ⚠️ Documentation Note
**File Path Discrepancy:** This documentation references files under `apps/ui/src/shared/`, but the actual project structure does not have a `shared/` folder. Adjust import paths accordingly:
- Import paths should use `../components/` and `../hooks/` not `../shared/components/` and `../shared/hooks/`

## Files to Create
- `apps/ui/src/routes/register.tsx` - Registration page route

## Implementation Details

### 1. Create Register Page (`apps/ui/src/routes/register.tsx`)

```typescript
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect } from 'react'
import { useRegisterMutation } from '../shared/hooks/queries/useAuthMutation'
import { useAuth } from '../shared/hooks/useAuth'
import { Input } from '../shared/components/ui/Input'
import { Button } from '../shared/components/ui/Button'
import { CheckCircle } from 'lucide-react'

// Form data interface
interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// Validation schema
const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
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
})

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const registerMutation = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: RegisterFormData) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...credentials } = data
    registerMutation.mutate(credentials)
  }

  // Watch password for validation feedback
  const password = watch('password')

  // Password strength indicator
  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    if (!pwd) return 'weak'
    if (pwd.length < 6) return 'weak'
    if (pwd.length < 10) return 'medium'
    return 'strong'
  }

  const passwordStrength = password ? getPasswordStrength(password) : null

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Join and start testing your AI knowledge
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <Input
              type="text"
              label="Username"
              placeholder="Choose a username"
              autoComplete="username"
              error={errors.username?.message}
              {...register('username')}
            />

            {/* Email Field */}
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password Field with Strength Indicator */}
            <div>
              <Input
                type="password"
                label="Password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Password Strength Meter */}
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
                        <span className="text-red-600 dark:text-red-400">Weak</span>
                      )}
                      {passwordStrength === 'medium' && (
                        <span className="text-yellow-600 dark:text-yellow-400">Medium</span>
                      )}
                      {passwordStrength === 'strong' && (
                        <span className="text-green-600 dark:text-green-400">Strong</span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Use at least 10 characters for a strong password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Requirements List */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs font-semibold mb-2">Password Requirements:</p>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className={`w-3 h-3 ${password?.length >= 6 ? 'text-green-500' : 'text-slate-400'}`} />
                  At least 6 characters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className={`w-3 h-3 ${password?.length >= 10 ? 'text-green-500' : 'text-slate-400'}`} />
                  10+ characters for strong password
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting || registerMutation.isPending}
            >
              {isSubmitting || registerMutation.isPending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
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

          {/* Terms Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300">
                Privacy Policy
              </a>
            </p>
          </div>
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

### 2. Generate Routes

```bash
pnpm --filter ui generate-routes
```

## Verification Steps

1. **Start both servers:**
   ```bash
   pnpm dev:api  # Terminal 1
   pnpm dev:ui   # Terminal 2
   ```

2. **Navigate to register page:**
   - Go to http://localhost:5173/register

3. **Test form validation:**
   - Try submitting empty form → All fields show required errors
   - Enter short username (< 3 chars) → Username error
   - Enter invalid username (special chars) → Username error
   - Enter invalid email → Email error
   - Enter short password (< 6 chars) → Password error
   - Enter non-matching passwords → Confirm password error

4. **Test password strength indicator:**
   - Type 1-5 chars → Weak (red bar, 1/3)
   - Type 6-9 chars → Medium (yellow bar, 2/3)
   - Type 10+ chars → Strong (green bar, full)

5. **Test password requirements checklist:**
   - Type < 6 chars → First checkbox gray
   - Type 6+ chars → First checkbox green
   - Type 10+ chars → Both checkboxes green

6. **Test successful registration:**
   - Fill all fields correctly
   - Submit form
   - Should see success toast
   - Should redirect to /dashboard
   - Should be logged in (navbar shows username)
   - Token should be in localStorage

7. **Test duplicate registration:**
   - Try registering with same email
   - Should show error: "Email already registered"

8. **Test redirect when authenticated:**
   - While logged in, navigate to /register
   - Should auto-redirect to /dashboard

9. **Test UI/UX:**
   - Password strength updates in real-time
   - Checkmarks update as you type
   - Dark mode styling works
   - Loading state during submission
   - Form disables during submission

10. **Test complete auth flow:**
    - Register new account → Success
    - Logout from navbar
    - Login with same credentials → Success
    - Check dashboard shows correct username

## Success Criteria
✅ Register page renders correctly
✅ Form validation works (username, email, password)
✅ Password confirmation validates
✅ Password strength indicator works
✅ Requirements checklist updates in real-time
✅ Registration API call succeeds
✅ Auto-login after registration
✅ Redirects to dashboard on success
✅ Error handling for duplicate accounts
✅ Link to login page works
✅ Dark mode fully supported
✅ Responsive design
✅ Loading states shown

## Troubleshooting

**Issue:** Password confirmation doesn't validate
- **Fix:** Check yup.ref('password') is correct
- Ensure oneOf validation configured

**Issue:** Password strength not updating
- **Fix:** Verify watch('password') is called
- Check getPasswordStrength function logic

**Issue:** Registration succeeds but doesn't redirect
- **Fix:** Check useRegisterMutation navigation
- Verify navigate function from TanStack Router

**Issue:** Duplicate email error not shown
- **Fix:** Check backend error handling
- Verify error message in toast

**Issue:** Username validation issues
- **Fix:** Check regex pattern in yup schema
- Test different username formats

## Form Features

1. **Username Validation:** 3-20 chars, alphanumeric + underscore
2. **Email Validation:** Standard email format
3. **Password Validation:** Min 6 chars, max 100
4. **Password Confirmation:** Must match password field
5. **Strength Indicator:** Visual feedback on password quality
6. **Requirements Checklist:** Shows what's needed
7. **Real-time Validation:** Errors show as you type
8. **Auto-login:** No need to login after registration

## Enhanced UX Features

1. **Password Strength Meter:** 3-level indicator (weak/medium/strong)
2. **Visual Checkmarks:** Green checkmarks for met requirements
3. **Inline Validation:** Errors under each field
4. **Loading States:** Button disabled during submission
5. **Terms Notice:** Legal compliance
6. **Easy Navigation:** Links to login and home
7. **Auto-redirect:** If already authenticated

## File Structure After This Step
```
apps/ui/src/
└── routes/
    ├── login.tsx              # Previous: Login page
    └── register.tsx           # New: Register page
```

## Completion of feature-init-app

🎉 **Congratulations!** You have completed all 15 steps of the **feature-init-app** phase.

### What We've Built:
✅ Full frontend infrastructure (Router, Query, Stores)
✅ Complete authentication system (backend + frontend)
✅ Dark mode with persistence
✅ Responsive navbar with navigation
✅ Professional UI components (Input, Button)
✅ User login and registration flows
✅ MongoDB database with User model
✅ JWT-based authentication
✅ Form validation with React Hook Form + Yup
✅ API service layer with type safety
✅ Toast notifications for user feedback

### The App Now:
- Users can register and create accounts
- Users can login and maintain sessions
- JWT tokens secure API requests
- Dark mode toggles and persists
- Professional, polished UI
- Fully functional authentication flow
- Database stores user data
- Ready for quiz features!

### Next Steps:
Move on to **feature-quiz-core** to build:
- Quiz listing page
- Quiz taking experience
- Question display with feedback
- Score calculation
- Results page

### Testing the Complete Auth Flow:
1. Start both servers (API + UI)
2. Navigate to home page
3. Click "Sign Up Free"
4. Create an account
5. Automatically logged in → Dashboard
6. Logout from navbar
7. Login again with credentials
8. Verify persistence (refresh page, still logged in)
9. Toggle dark mode, verify it persists

**The foundation is complete!** 🚀
