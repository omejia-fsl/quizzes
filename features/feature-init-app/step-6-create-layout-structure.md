# Step 6: Create Layout Structure

## Goal
Build the app layout component that wraps all pages with consistent structure: navbar area, main content area, and optional footer. This provides the skeleton for the entire app.

## Prerequisites
- Step 5 completed (Zustand stores ready)
- TanStack Router configured

## Files to Create
- `apps/ui/src/shared/components/layout/Layout.tsx` - Main layout wrapper
- `apps/ui/src/routes/__root.tsx` - Update with Layout

## Implementation Details

### 1. Create Layout Directory
```bash
mkdir -p apps/ui/src/shared/components/layout
```

### 2. Create Layout Component (`apps/ui/src/shared/components/layout/Layout.tsx`)
```typescript
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navbar will go here in step 7 */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800">
        {/* Placeholder for navbar */}
        <div className="container mx-auto px-4 h-full flex items-center">
          <span className="text-sm text-slate-500">Navbar placeholder</span>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Optional footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} AI Development Quiz App</p>
        </div>
      </footer>
    </div>
  )
}
```

### 3. Update Root Route (`apps/ui/src/routes/__root.tsx`)
```typescript
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Layout } from '../shared/components/layout/Layout'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
```

### 4. Update Index Route (Optional - Add Content)
Update `apps/ui/src/routes/index.tsx` to remove test code and show basic content:
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Development Quiz App
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
          Test your knowledge of AI agent design, prompt engineering, and model selection
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Browse Quizzes
          </button>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Test Your Skills</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Challenge yourself with quizzes on AI development fundamentals
          </p>
        </div>
        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor your improvement over time with detailed statistics
          </p>
        </div>
        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="text-3xl mb-3">🏆</div>
          <h3 className="text-lg font-semibold mb-2">Compete</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Join daily challenges and climb the leaderboard
          </p>
        </div>
      </div>
    </div>
  )
}
```

## Verification Steps

1. **Start dev server:**
   ```bash
   pnpm dev:ui
   ```

2. **Check browser:**
   - Navigate to http://localhost:5173
   - Should see layout with:
     - Header area (navbar placeholder)
     - Main content (home page)
     - Footer at bottom

3. **Check responsiveness:**
   - Resize browser window
   - Container should stay centered
   - Content should be readable on mobile

4. **Test dark mode:**
   - Toggle theme (if you added button in step 5)
   - Layout should transition smoothly
   - Border colors should change
   - Background should change

5. **Check spacing:**
   - Content should have proper padding
   - Not touching edges of screen
   - Footer should be at bottom

## Success Criteria
✅ Layout component created and working
✅ All pages wrapped in consistent layout
✅ Header area present (navbar placeholder)
✅ Main content area with proper spacing
✅ Footer at bottom
✅ Dark mode styles applied
✅ Responsive container (max-width, centered)
✅ Smooth color transitions

## Troubleshooting

**Issue:** Layout not showing
- **Fix:** Check __root.tsx imports Layout correctly
- Ensure Outlet is inside Layout

**Issue:** Dark mode not working
- **Fix:** Verify dark: classes in Tailwind
- Check theme initialized in main.tsx

**Issue:** Footer not at bottom on short pages
- **Fix:** Add flex column layout if needed (current version may need adjustment)
- Use `min-h-screen` on outer div

**Issue:** Content too wide or too narrow
- **Fix:** Adjust container max-width in Layout
- Check container classes

## Layout Features

1. **Responsive Container:** Max-width with padding
2. **Dark Mode Support:** All colors have dark: variants
3. **Smooth Transitions:** Color changes animated
4. **Semantic HTML:** header, main, footer tags
5. **Flexible Content:** Children rendered in main
6. **Consistent Spacing:** Padding and margins standardized

## Customization Options

You can customize the layout:
- **Header height:** Change `h-16` to desired height
- **Container max-width:** Add `max-w-7xl` to container classes
- **Padding:** Adjust `px-4` and `py-8` values
- **Footer:** Can be removed or expanded with links

## File Structure After This Step
```
apps/ui/src/
├── shared/
│   └── components/
│       └── layout/
│           └── Layout.tsx      # New: Main layout
├── routes/
│   ├── __root.tsx             # Updated: Uses Layout
│   └── index.tsx              # Updated: Better content
```

## Next Step
**Step 7: Implement Navbar** - Build functional navbar with navigation links and branding
