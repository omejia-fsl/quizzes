# Step 13: Frontend - Complete Auth Store

## Goal
Complete the authentication store with full login, register, logout functionality. Integrate with backend API and add automatic token validation on app mount.

## Prerequisites
- Step 12 completed (Backend auth endpoints ready)
- Step 5 completed (Auth store structure exists)
- API service configured

## Files to Modify
- `apps/ui/src/shared/stores/authStore.ts` - Complete implementation
- `apps/ui/src/shared/hooks/useAuth.ts` - Add more actions
- `apps/ui/src/shared/types/index.ts` - Add auth types
- `apps/ui/src/main.tsx` - Auto-check auth on mount

## Implementation Details

### 1. Create Auth Types (`apps/ui/src/shared/types/index.ts`)

```typescript
export interface User {
  id: string
  username: string
  email: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}
```

### 2. Complete Auth Store (`apps/ui/src/shared/stores/authStore.ts`)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'
import type { User, AuthResponse, LoginCredentials, RegisterCredentials } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials, {
            skipAuth: true,
          })

          // Store token in localStorage (for API service)
          localStorage.setItem('auth_token', response.access_token)

          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          const message = error.message || 'Login failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post<AuthResponse>('/auth/register', credentials, {
            skipAuth: true,
          })

          // Store token in localStorage
          localStorage.setItem('auth_token', response.access_token)

          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          const message = error.message || 'Registration failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        // Validate token with backend
        set({ isLoading: true })
        try {
          const response = await api.get<{ user: User }>('/auth/profile')
          set({
            user: response.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Token invalid, clear auth
          localStorage.removeItem('auth_token')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
)
```

### 3. Update Auth Hook (`apps/ui/src/shared/hooks/useAuth.ts`)

```typescript
import { useAuthStore } from '../stores/authStore'
import type { LoginCredentials, RegisterCredentials } from '../types'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const logout = useAuthStore((state) => state.logout)
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const clearError = useAuthStore((state) => state.clearError)

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  }
}
```

### 4. Initialize Auth on App Mount (`apps/ui/src/main.tsx`)

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { router } from './lib/router'
import { queryClient } from './lib/queryClient'
import { useThemeStore } from './shared/stores/themeStore'
import { useAuthStore } from './shared/stores/authStore'
import './index.css'

// Initialize theme
useThemeStore.getState().initTheme()

// Check authentication on mount
useAuthStore.getState().checkAuth()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-text)',
          },
        }}
      />
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  </StrictMode>,
)
```

### 5. Add Toast CSS Variables (`apps/ui/src/index.css`)

```css
@import "../../apps/ui/node_modules/tailwindcss";

:root {
    --toast-bg: #ffffff;
    --toast-text: #0f172a;
}

.dark {
    --toast-bg: #1e293b;
    --toast-text: #f1f5f9;
}
```

### 6. Create Auth Query Hooks (Optional but Recommended)

Create `apps/ui/src/shared/hooks/queries/useAuthMutation.ts`:

```typescript
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../useAuth'
import toast from 'react-hot-toast'
import type { LoginCredentials, RegisterCredentials } from '../../types'

export function useLoginMutation() {
  const { login } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      toast.success('Welcome back!')
      navigate({ to: '/dashboard' })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed')
    },
  })
}

export function useRegisterMutation() {
  const { register } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => register(credentials),
    onSuccess: () => {
      toast.success('Account created successfully!')
      navigate({ to: '/dashboard' })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed')
    },
  })
}

export function useLogoutMutation() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => {
      logout()
      return Promise.resolve()
    },
    onSuccess: () => {
      toast.success('Logged out successfully')
      navigate({ to: '/' })
    },
  })
}
```

### 7. Add Logout to Navbar

Update `apps/ui/src/shared/components/layout/Navbar.tsx` to add logout button:

```typescript
// Add to imports
import { useLogoutMutation } from '../../hooks/queries/useAuthMutation'

// Inside Navbar component
const logoutMutation = useLogoutMutation()

// In authenticated user section (replace existing)
{isAuthenticated && (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
      <User className="w-4 h-4" />
      <span className="text-sm font-medium">{user?.username || 'User'}</span>
    </div>
    <button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
    >
      Logout
    </button>
  </div>
)}
```

## Verification Steps

1. **Start both servers:**
   ```bash
   # Terminal 1
   pnpm dev:api

   # Terminal 2
   pnpm dev:ui
   ```

2. **Open browser:**
   - Navigate to http://localhost:5173

3. **Test auth persistence:**
   - Check localStorage: should have `auth-storage` key
   - Check console for checkAuth call on mount

4. **Test error handling:**
   - Try login with invalid credentials
   - Should see toast error message
   - Store error state should update

5. **Test token in API calls:**
   - Login successfully
   - Token should be in localStorage as `auth_token`
   - API calls should include Authorization header

6. **Test logout:**
   - Click logout in navbar
   - Should redirect to home
   - Token should be removed from localStorage
   - Store should clear user

## Success Criteria
✅ Auth store has login, register, logout actions
✅ Token stored in localStorage
✅ Auto-check auth on app mount
✅ API integration working
✅ Error handling with toasts
✅ Loading states tracked
✅ Token validation with backend
✅ Logout clears all auth data

## Troubleshooting

**Issue:** Login doesn't work
- **Fix:** Check backend is running on port 3000
- Verify API_URL in frontend .env.local
- Check CORS is enabled in backend

**Issue:** Token not sent with requests
- **Fix:** Verify api.ts reads from localStorage
- Check Authorization header format

**Issue:** Auth persists after logout
- **Fix:** Ensure localStorage.removeItem is called
- Check auth store logout action

**Issue:** checkAuth fails silently
- **Fix:** Add error logging in catch block
- Verify /auth/profile endpoint works

**Issue:** Toast notifications not showing
- **Fix:** Ensure react-hot-toast installed
- Check Toaster component in main.tsx

## Security Notes

1. **Token Storage:** Using localStorage (XSS risk, but acceptable for this app)
2. **Token Validation:** Always validate on server, never trust client
3. **HTTPS:** Use HTTPS in production
4. **Token Expiry:** JWT expires after 7 days (configurable)
5. **Logout:** Always clear both localStorage and Zustand state

## File Structure After This Step
```
apps/ui/src/
├── shared/
│   ├── stores/
│   │   └── authStore.ts          # Updated: Full implementation
│   ├── hooks/
│   │   ├── useAuth.ts            # Updated: More actions
│   │   └── queries/
│   │       └── useAuthMutation.ts # New: TanStack mutations
│   ├── types/
│   │   └── index.ts              # New: Auth types
│   └── components/
│       └── layout/
│           └── Navbar.tsx        # Updated: Logout button
├── main.tsx                      # Updated: Init auth
└── index.css                     # Updated: Toast variables
```

## Next Step
**Step 14: Frontend - Login Page** - Build login form with React Hook Form and validation
