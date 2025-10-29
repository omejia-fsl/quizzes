# Step 2: Setup TanStack Router

## Goal
Configure TanStack Router with file-based routing structure. Create minimal routes that work and establish the routing foundation for the entire app.

## Prerequisites
- Step 1 completed (@tanstack/react-router installed)
- Frontend dev server can start

## Files to Create/Modify
- `apps/ui/src/routes/__root.tsx` - Root route layout
- `apps/ui/src/routes/index.tsx` - Home page route
- `apps/ui/src/lib/router.ts` - Router configuration
- `apps/ui/src/main.tsx` - Integrate RouterProvider

## Implementation Details

### 1. Create Routes Directory
```bash
mkdir -p apps/ui/src/routes
mkdir -p apps/ui/src/lib
```

### 2. Create Root Route (`apps/ui/src/routes/__root.tsx`)
```typescript
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Outlet />
    </div>
  )
}
```

### 3. Create Index Route (`apps/ui/src/routes/index.tsx`)
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Development Quiz App</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Welcome! Routing is working.
        </p>
      </div>
    </div>
  )
}
```

### 4. Create Router Configuration (`apps/ui/src/lib/router.ts`)
```typescript
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

### 5. Update Main Entry (`apps/ui/src/main.tsx`)
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './lib/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

### 6. Generate Route Tree
TanStack Router uses code generation. Add script to `apps/ui/package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "generate-routes": "tsr generate"
  }
}
```

Install TanStack Router CLI as dev dependency:
```bash
pnpm --filter ui add -D @tanstack/router-cli
```

Create route tree config (`apps/ui/tsr.config.json`):
```json
{
  "routesDirectory": "./src/routes",
  "generatedRouteTree": "./src/routeTree.gen.ts",
  "routeFileIgnorePrefix": "-",
  "quoteStyle": "single"
}
```

Generate routes:
```bash
pnpm --filter ui generate-routes
```

### 7. Update Vite Config for Auto Route Generation
Add TanStack Router plugin to `apps/ui/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite(), // Add this first
    react(),
    tailwindcss(),
  ],
})
```

Install the plugin:
```bash
pnpm --filter ui add -D @tanstack/router-plugin
```

## Verification Steps

1. **Generate route tree:**
   ```bash
   pnpm --filter ui generate-routes
   ```
   - Should create `apps/ui/src/routeTree.gen.ts`

2. **Start dev server:**
   ```bash
   pnpm dev:ui
   ```
   - No compilation errors
   - Routes auto-regenerate on changes

3. **Check browser:**
   - Navigate to http://localhost:5173
   - Should see "AI Development Quiz App" heading
   - Should see "Welcome! Routing is working." text

4. **Check DevTools:**
   - No router errors in console
   - Page renders correctly

5. **Test Hot Module Replacement:**
   - Change text in `index.tsx`
   - Should update without full page reload

## Success Criteria
✅ TanStack Router configured and working
✅ Root route (`__root.tsx`) renders
✅ Index route (`/`) shows welcome message
✅ Route tree generates automatically
✅ No TypeScript errors
✅ App loads in browser successfully
✅ HMR (Hot Module Replacement) works

## Troubleshooting

**Issue:** `routeTree.gen.ts` not found
- **Fix:** Run `pnpm --filter ui generate-routes` manually
- Add to dev script if needed

**Issue:** TypeScript errors about router types
- **Fix:** Ensure `declare module` in router.ts is present
- Restart TypeScript server in VSCode

**Issue:** Routes not updating
- **Fix:** Check Vite plugin is installed and first in plugins array
- Restart dev server

## File Structure After This Step
```
apps/ui/src/
├── routes/
│   ├── __root.tsx         # Root layout
│   └── index.tsx          # Home page
├── lib/
│   └── router.ts          # Router config
├── routeTree.gen.ts       # Auto-generated (git-ignore)
└── main.tsx               # Updated with RouterProvider
```

## Next Step
**Step 3: Setup TanStack Query** - Configure data fetching and caching system
