# Step 7: Implement Navbar

## Goal
Build a functional navbar with branding, navigation links using TanStack Router, and a user menu area (dark mode toggle will be added in step 8). The navbar should be responsive and styled with Tailwind.

## Prerequisites
- Step 6 completed (Layout structure ready)
- TanStack Router configured
- lucide-react installed

## Files to Create/Modify
- `apps/ui/src/shared/components/layout/Navbar.tsx` - Navbar component
- `apps/ui/src/shared/components/layout/Layout.tsx` - Replace placeholder

## Implementation Details

### 1. Create Navbar Component (`apps/ui/src/shared/components/layout/Navbar.tsx`)
```typescript
import { Link } from '@tanstack/react-router'
import { Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/quizzes', label: 'Quizzes' },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ]

  return (
    <nav className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo/Brand */}
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          QuizAI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              activeProps={{
                className:
                  'text-blue-600 dark:text-blue-400 font-semibold',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right section: Dark mode toggle placeholder + Auth */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark mode toggle will go here in step 8 */}
          <div className="w-10 h-10 flex items-center justify-center">
            {/* Placeholder */}
          </div>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.username || 'User'}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                activeProps={{
                  className: 'text-blue-600 dark:text-blue-400 font-semibold',
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Links */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg font-medium text-center"
                >
                  Sign Up
                </Link>
              </>
            )}

            {isAuthenticated && (
              <div className="py-2 text-sm text-slate-600 dark:text-slate-400">
                Logged in as <span className="font-medium">{user?.username}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
```

### 2. Update Layout to Use Navbar (`apps/ui/src/shared/components/layout/Layout.tsx`)
```typescript
import { ReactNode } from 'react'
import { Navbar } from './Navbar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navbar */}
      <Navbar />

      {/* Main content area */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} AI Development Quiz App</p>
        </div>
      </footer>
    </div>
  )
}
```

### 3. Create Placeholder Routes (For Navigation Testing)

**Quizzes Route** (`apps/ui/src/routes/quizzes/index.tsx`):
```bash
mkdir -p apps/ui/src/routes/quizzes
```

```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quizzes/')({
  component: QuizzesComponent,
})

function QuizzesComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Quizzes</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Quiz list will be implemented in feature-quiz-core
      </p>
    </div>
  )
}
```

**Dashboard Route** (`apps/ui/src/routes/dashboard.tsx`):
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Dashboard will be implemented in feature-dashboard
      </p>
    </div>
  )
}
```

## Verification Steps

1. **Generate new routes:**
   ```bash
   pnpm --filter ui generate-routes
   ```

2. **Start dev server:**
   ```bash
   pnpm dev:ui
   ```

3. **Check navbar appears:**
   - Should see "QuizAI" logo on left
   - Navigation links: Home, Quizzes
   - Auth buttons: Login, Sign Up (since not authenticated)

4. **Test navigation:**
   - Click "Home" → should navigate to /
   - Click "Quizzes" → should navigate to /quizzes
   - Active link should be highlighted

5. **Test mobile menu:**
   - Resize browser to mobile width (<768px)
   - Should see hamburger menu icon
   - Click to open mobile menu
   - Should show all navigation links
   - Click link, menu should close

6. **Test dark mode appearance:**
   - Toggle dark mode (if implemented)
   - Navbar should change colors
   - Border should be visible in both modes

7. **Test auth state:**
   - Navbar shows "Login" and "Sign Up" when not authenticated
   - After auth (in step 14), should show username

## Success Criteria
✅ Navbar component created and rendering
✅ Logo/brand shows on left
✅ Navigation links work (Home, Quizzes)
✅ Active route highlighted
✅ Auth buttons show (Login, Sign Up)
✅ Mobile menu works (hamburger, open/close)
✅ Responsive design (desktop + mobile)
✅ Dark mode styling applied
✅ Smooth hover effects

## Troubleshooting

**Issue:** Links not navigating
- **Fix:** Ensure routes exist and routeTree regenerated
- Check Link component from @tanstack/react-router

**Issue:** Active link not highlighted
- **Fix:** Verify activeProps in Link component
- Check route matches exactly

**Issue:** Mobile menu not showing
- **Fix:** Check Tailwind breakpoints (md:hidden)
- Verify state management for mobileMenuOpen

**Issue:** Icons not showing
- **Fix:** Ensure lucide-react is installed
- Check imports from 'lucide-react'

## Navbar Features

1. **Responsive Design:** Desktop and mobile layouts
2. **Active Link Highlighting:** Shows current page
3. **Conditional Links:** Dashboard only shows when authenticated
4. **Mobile Menu:** Hamburger menu with overlay
5. **Auth State:** Different UI for logged in vs logged out
6. **Smooth Animations:** Hover effects and transitions
7. **Dark Mode Ready:** Full dark mode support

## File Structure After This Step
```
apps/ui/src/
├── shared/
│   └── components/
│       └── layout/
│           ├── Layout.tsx       # Updated: Uses Navbar
│           └── Navbar.tsx       # New: Navigation bar
└── routes/
    ├── quizzes/
    │   └── index.tsx           # New: Placeholder
    └── dashboard.tsx           # New: Placeholder
```

## Next Step
**Step 8: Implement Dark Mode** - Add dark mode toggle button to navbar with full functionality
