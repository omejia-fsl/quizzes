# Step 3: Setup TanStack Query

## Goal
Configure TanStack Query (React Query) for data fetching, caching, and server state management. Set up the QueryClient and integrate it into the app with DevTools for debugging.

## Prerequisites
- Step 2 completed (TanStack Router working)
- @tanstack/react-query installed

## Files to Create/Modify
- `apps/ui/src/lib/queryClient.ts` - QueryClient configuration
- `apps/ui/src/main.tsx` - Add QueryClientProvider

## Implementation Details

### 1. Create QueryClient Configuration (`apps/ui/src/lib/queryClient.ts`)
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: data considered fresh for 1 minute
      staleTime: 1000 * 60,
      // Cache time: unused data stays in cache for 5 minutes
      gcTime: 1000 * 60 * 5,
      // Retry failed requests once
      retry: 1,
      // Refetch on window focus in production only
      refetchOnWindowFocus: import.meta.env.PROD,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
})
```

### 2. Update Main Entry with QueryClientProvider (`apps/ui/src/main.tsx`)
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { router } from './lib/router'
import { queryClient } from './lib/queryClient'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* DevTools only show in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  </StrictMode>,
)
```

### 3. Install React Query DevTools (if not already installed)
```bash
pnpm --filter ui add @tanstack/react-query-devtools
```

### 4. Create a Test Query Hook (Optional - for verification)
Create `apps/ui/src/hooks/useTestQuery.ts`:
```typescript
import { useQuery } from '@tanstack/react-query'

export function useTestQuery() {
  return useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return { message: 'TanStack Query is working!' }
    },
  })
}
```

### 5. Test Query in Home Component (Temporary)
Update `apps/ui/src/routes/index.tsx` to test:
```typescript
import { createFileRoute } from '@tanstack/react-router'
import { useTestQuery } from '../hooks/useTestQuery'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const { data, isLoading, error } = useTestQuery()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Development Quiz App</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
          Welcome! Routing is working.
        </p>

        {/* Test Query Display */}
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Query Test:</h2>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error occurred</p>}
          {data && <p className="text-green-600 dark:text-green-400">{data.message}</p>}
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
   - Should compile without errors

2. **Check browser:**
   - Navigate to http://localhost:5173
   - Should see the home page
   - Should see test query loading → success message

3. **Check React Query DevTools:**
   - Look for floating React Query icon in bottom-right corner
   - Click to open DevTools panel
   - Should see "test" query listed
   - Should show query status (success, loading, etc.)

4. **Test Caching:**
   - Navigate away (add temporary link) and back
   - Query should show "cached" data instantly

5. **Check Console:**
   - No errors
   - No warnings about QueryClient

## Success Criteria
✅ QueryClient created with sensible defaults
✅ QueryClientProvider wraps the app
✅ React Query DevTools appear in development
✅ Test query executes successfully
✅ DevTools show query state and data
✅ No console errors or warnings
✅ HMR still works

## Troubleshooting

**Issue:** DevTools don't appear
- **Fix:** Check DevTools only show in development (`import.meta.env.DEV`)
- Try toggling with button manually
- Ensure @tanstack/react-query-devtools is installed

**Issue:** Query doesn't execute
- **Fix:** Check QueryClientProvider wraps RouterProvider
- Verify queryClient is imported correctly

**Issue:** TypeScript errors with useQuery
- **Fix:** Ensure @tanstack/react-query is latest version
- Check TypeScript version compatibility

**Issue:** Infinite loop or constant refetching
- **Fix:** Check queryKey is stable (use array, not object)
- Adjust staleTime in queryClient config

## Configuration Explanation

### Default Options
- **staleTime: 1 minute** - Data stays fresh for 1 min, no refetch during this time
- **gcTime: 5 minutes** - Unused cached data removed after 5 min
- **retry: 1** - Retry failed requests once before showing error
- **refetchOnWindowFocus: prod only** - Only refetch on focus in production

These are sensible defaults; adjust per query as needed.

## Cleanup After Verification
Once verified, you can remove the test query:
- Delete `apps/ui/src/hooks/useTestQuery.ts`
- Remove test query display from `index.tsx`
- Keep QueryClient setup and DevTools

## File Structure After This Step
```
apps/ui/src/
├── lib/
│   ├── router.ts
│   └── queryClient.ts        # New: Query config
├── hooks/
│   └── useTestQuery.ts       # Temporary test
└── main.tsx                  # Updated with QueryClientProvider
```

## Next Step
**Step 4: Create API Service** - Build fetch wrapper with authentication support
