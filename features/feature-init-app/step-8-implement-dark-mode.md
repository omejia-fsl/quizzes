# Step 8: Implement Dark Mode Toggle

## Goal
Complete dark mode implementation by adding a toggle button to the navbar. The toggle should switch themes, persist preferences, and show an appropriate icon (sun/moon).

## Prerequisites
- Step 7 completed (Navbar implemented)
- Step 5 completed (Theme store ready)
- lucide-react installed

## Files to Modify
- `apps/ui/src/shared/components/layout/Navbar.tsx` - Add toggle button

## Implementation Details

### 1. Update Navbar with Dark Mode Toggle

Replace the placeholder section in `apps/ui/src/shared/components/layout/Navbar.tsx`:

```typescript
import { Link } from '@tanstack/react-router'
import { Menu, X, User, Moon, Sun } from 'lucide-react' // Add Moon, Sun
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme' // Add this import

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const { isDark, toggleTheme } = useTheme() // Add this

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

        {/* Right section: Dark mode toggle + Auth */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

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
            {/* Dark Mode Toggle in Mobile Menu */}
            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-medium">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>
            </div>

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

### 2. Ensure Tailwind Dark Mode is Configured

Check `apps/ui/tailwind.config.js` or `apps/ui/src/index.css` for dark mode setup.

Since we're using Tailwind v4, dark mode should work with the `dark` class automatically. Verify in `apps/ui/src/index.css`:

```css
@import "../../apps/ui/node_modules/tailwindcss";

/* Tailwind v4 handles dark mode via class by default */
```

If using Tailwind v3, ensure `tailwind.config.js` has:
```javascript
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}
```

## Verification Steps

1. **Start dev server:**
   ```bash
   pnpm dev:ui
   ```

2. **Check toggle button appears:**
   - Desktop: Moon icon should show in navbar (if light mode)
   - Click button
   - Should switch to Sun icon (yellow)
   - Background should change to dark

3. **Test persistence:**
   - Toggle to dark mode
   - Refresh page
   - Should stay in dark mode
   - Check localStorage in DevTools: key `theme-storage`

4. **Test all pages:**
   - Navigate to Home, Quizzes, Dashboard
   - All pages should respect dark mode
   - Colors should transition smoothly

5. **Test mobile toggle:**
   - Resize to mobile width
   - Open hamburger menu
   - Should see "Dark Mode" toggle at top
   - Click to toggle, UI should update

6. **Test system preference:**
   - Clear localStorage
   - Refresh page
   - Should default to system theme (check OS settings)

7. **Check transitions:**
   - Toggle should be smooth (not jarring)
   - All elements should transition colors

## Success Criteria
✅ Dark mode toggle button appears in navbar
✅ Shows Moon icon in light mode, Sun icon in dark mode
✅ Clicking toggle switches theme instantly
✅ Theme persists across page refreshes
✅ Works on all pages (Home, Quizzes, Dashboard)
✅ Mobile menu has toggle option
✅ Defaults to system preference if no stored preference
✅ Smooth color transitions (200ms duration)
✅ All UI elements adapt to theme

## Troubleshooting

**Issue:** Toggle button doesn't work
- **Fix:** Check useTheme hook is imported
- Verify toggleTheme function exists in store

**Issue:** Theme doesn't persist
- **Fix:** Check localStorage in DevTools
- Verify Zustand persist middleware is working
- Check theme-storage key exists

**Issue:** Some elements don't change color
- **Fix:** Ensure all elements have dark: variants in Tailwind
- Check dark class is on <html> element

**Issue:** Icon doesn't change
- **Fix:** Verify isDark state is updating
- Check conditional rendering: isDark ? Sun : Moon

**Issue:** Flash of wrong theme on load
- **Fix:** Theme initialization happens in main.tsx before render
- May need to move theme init earlier or add blocking script

## Testing Dark Mode Styles

Verify these elements adapt correctly:
- Navbar background and border
- Page background
- Text colors (headings, body, muted)
- Card backgrounds
- Button styles
- Link hover states
- Footer

All should have appropriate `dark:` classes.

## Accessibility Notes

- Toggle button has `aria-label="Toggle dark mode"`
- Clear visual indication (icon change)
- Sufficient color contrast in both modes
- Keyboard accessible (can tab to button, press Enter)

## File Structure After This Step
```
apps/ui/src/
└── shared/
    └── components/
        └── layout/
            └── Navbar.tsx       # Updated: Dark mode toggle added
```

## Next Step
**Step 9: Create Home Page** - Build comprehensive landing page with hero section and feature highlights
