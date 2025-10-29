# Step 5: Setup Zustand Stores

## Goal
Create Zustand stores for state management: auth store (user, token), theme store (dark mode), and quiz store (quiz session). Set up the structure now, implement fully in later steps.

## Prerequisites
- Step 4 completed (API service ready)
- zustand installed

## Files to Create
- `apps/ui/src/shared/stores/authStore.ts` - Authentication state
- `apps/ui/src/shared/stores/themeStore.ts` - Dark mode state
- `apps/ui/src/shared/stores/quizStore.ts` - Quiz session state
- `apps/ui/src/shared/hooks/useAuth.ts` - Auth store hook
- `apps/ui/src/shared/hooks/useTheme.ts` - Theme store hook

## Implementation Details

### 1. Create Stores Directory
```bash
mkdir -p apps/ui/src/shared/stores
mkdir -p apps/ui/src/shared/hooks
```

### 2. Create Auth Store (`apps/ui/src/shared/stores/authStore.ts`)
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  checkAuth: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => {
        localStorage.setItem('auth_token', token)
        set({ user, token, isAuthenticated: true })
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      checkAuth: () => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Token exists, but we'll validate with backend in step 13
          set({ token, isAuthenticated: true })
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and token, not isAuthenticated
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
```

### 3. Create Theme Store (`apps/ui/src/shared/stores/themeStore.ts`)
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
}

interface ThemeActions {
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
  initTheme: () => void
}

type ThemeStore = ThemeState & ThemeActions

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isDark: false,

      // Actions
      toggleTheme: () => {
        const newIsDark = !get().isDark
        set({ isDark: newIsDark })
        applyTheme(newIsDark)
      },

      setTheme: (isDark) => {
        set({ isDark })
        applyTheme(isDark)
      },

      initTheme: () => {
        const stored = localStorage.getItem('theme-storage')
        if (stored) {
          // Use stored preference
          const { state } = JSON.parse(stored)
          const isDark = state?.isDark ?? false
          applyTheme(isDark)
        } else {
          // Use system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          set({ isDark: prefersDark })
          applyTheme(prefersDark)
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)

/**
 * Apply theme to document
 */
function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
```

### 4. Create Quiz Store (`apps/ui/src/shared/stores/quizStore.ts`)
```typescript
import { create } from 'zustand'

export interface QuizQuestion {
  id: string
  questionText: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  category: string
  questions: QuizQuestion[]
}

export interface UserAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
}

interface QuizState {
  currentQuiz: Quiz | null
  currentQuestionIndex: number
  userAnswers: UserAnswer[]
  isComplete: boolean
}

interface QuizActions {
  startQuiz: (quiz: Quiz) => void
  answerQuestion: (questionId: string, selectedAnswer: number) => void
  nextQuestion: () => void
  resetQuiz: () => void
  getScore: () => { correct: number; total: number; percentage: number }
}

type QuizStore = QuizState & QuizActions

export const useQuizStore = create<QuizStore>()((set, get) => ({
  // Initial state
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  isComplete: false,

  // Actions
  startQuiz: (quiz) => {
    set({
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      userAnswers: [],
      isComplete: false,
    })
  },

  answerQuestion: (questionId, selectedAnswer) => {
    const { currentQuiz, userAnswers } = get()
    if (!currentQuiz) return

    const question = currentQuiz.questions.find((q) => q.id === questionId)
    if (!question) return

    const isCorrect = selectedAnswer === question.correctAnswer

    // Update or add answer
    const existingIndex = userAnswers.findIndex((a) => a.questionId === questionId)
    if (existingIndex >= 0) {
      const newAnswers = [...userAnswers]
      newAnswers[existingIndex] = { questionId, selectedAnswer, isCorrect }
      set({ userAnswers: newAnswers })
    } else {
      set({ userAnswers: [...userAnswers, { questionId, selectedAnswer, isCorrect }] })
    }
  },

  nextQuestion: () => {
    const { currentQuiz, currentQuestionIndex } = get()
    if (!currentQuiz) return

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 })
    } else {
      set({ isComplete: true })
    }
  },

  resetQuiz: () => {
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      userAnswers: [],
      isComplete: false,
    })
  },

  getScore: () => {
    const { userAnswers } = get()
    const correct = userAnswers.filter((a) => a.isCorrect).length
    const total = userAnswers.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
    return { correct, total, percentage }
  },
}))
```

### 5. Create Hook Wrappers

**Auth Hook** (`apps/ui/src/shared/hooks/useAuth.ts`):
```typescript
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setAuth = useAuthStore((state) => state.setAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const checkAuth = useAuthStore((state) => state.checkAuth)

  return {
    user,
    isAuthenticated,
    login: setAuth,
    logout: clearAuth,
    checkAuth,
  }
}
```

**Theme Hook** (`apps/ui/src/shared/hooks/useTheme.ts`):
```typescript
import { useThemeStore } from '../stores/themeStore'

export function useTheme() {
  const isDark = useThemeStore((state) => state.isDark)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const initTheme = useThemeStore((state) => state.initTheme)

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
  }
}
```

### 6. Initialize Theme on App Mount

Update `apps/ui/src/main.tsx`:
```typescript
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { router } from './lib/router'
import { queryClient } from './lib/queryClient'
import { useThemeStore } from './shared/stores/themeStore'
import './index.css'

// Initialize theme before rendering
useThemeStore.getState().initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  </StrictMode>,
)
```

## Verification Steps

1. **Check file structure:**
   ```bash
   ls -la apps/ui/src/shared/stores/
   ls -la apps/ui/src/shared/hooks/
   ```

2. **Test imports in component:**
   Add to `apps/ui/src/routes/index.tsx`:
   ```typescript
   import { useAuth } from '../shared/hooks/useAuth'
   import { useTheme } from '../shared/hooks/useTheme'

   // In component
   const { isAuthenticated } = useAuth()
   const { isDark, toggleTheme } = useTheme()

   console.log('Auth:', isAuthenticated)
   console.log('Dark mode:', isDark)
   ```

3. **Start dev server:**
   ```bash
   pnpm dev:ui
   ```

4. **Check browser console:**
   - Should see auth and theme state logged
   - No Zustand errors

5. **Test theme toggle:**
   Add button to index.tsx:
   ```typescript
   <button onClick={toggleTheme}>Toggle Theme</button>
   ```
   - Click button
   - Should see dark class added/removed from html element

## Success Criteria
✅ All three stores created (auth, theme, quiz)
✅ Stores compile without TypeScript errors
✅ Theme store persists to localStorage
✅ Auth store persists user and token
✅ Hook wrappers work
✅ Theme initializes on mount
✅ Can toggle theme and see changes

## Troubleshooting

**Issue:** TypeScript errors with zustand
- **Fix:** Ensure zustand is installed: `pnpm --filter ui add zustand`
- Check version compatibility

**Issue:** Persist middleware not working
- **Fix:** Persist is built into zustand (no separate import needed)
- Check localStorage in DevTools

**Issue:** Theme not applying
- **Fix:** Ensure Tailwind dark mode is set to 'class' in config
- Check applyTheme() is called

**Issue:** Store state not updating
- **Fix:** Use Zustand DevTools for debugging
- Check selectors in components

## File Structure After This Step
```
apps/ui/src/
├── shared/
│   ├── stores/
│   │   ├── authStore.ts       # New: Auth state
│   │   ├── themeStore.ts      # New: Theme state
│   │   └── quizStore.ts       # New: Quiz state
│   └── hooks/
│       ├── useAuth.ts         # New: Auth hook
│       └── useTheme.ts        # New: Theme hook
└── main.tsx                   # Updated: Init theme
```

## Next Step
**Step 6: Create Layout Structure** - Build app layout with header, main content, and footer areas
