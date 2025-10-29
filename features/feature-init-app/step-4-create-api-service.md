# Step 4: Create API Service Layer

## Goal
Build a reusable fetch wrapper that handles API requests with authentication, error handling, and type safety. This service layer will be used throughout the app for all backend communication.

## Prerequisites
- Step 3 completed (TanStack Query configured)
- Backend API base URL known (default: http://localhost:3000)

## Files to Create
- `apps/ui/src/shared/lib/api.ts` - Main API service
- `apps/ui/src/shared/types/api.ts` - API types
- `apps/ui/.env.local` - Environment variables (optional)

## Implementation Details

### 1. Create Shared Directories
```bash
mkdir -p apps/ui/src/shared/lib
mkdir -p apps/ui/src/shared/types
```

### 2. Create API Types (`apps/ui/src/shared/types/api.ts`)
```typescript
export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}
```

### 3. Create API Service (`apps/ui/src/shared/lib/api.ts`)
```typescript
import { ApiRequestError } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

/**
 * Type-safe API request wrapper with automatic auth headers
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, headers, ...restOptions } = options

  // Build headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Add auth token if not skipped
  if (!skipAuth) {
    const token = getAuthToken()
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  // Build full URL
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    })

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
        statusCode: response.status,
      }))

      throw new ApiRequestError(
        errorData.message || 'Request failed',
        response.status,
        errorData.error
      )
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    // Parse JSON response
    const data = await response.json()
    return data
  } catch (error) {
    // Re-throw ApiRequestError as-is
    if (error instanceof ApiRequestError) {
      throw error
    }

    // Network errors or other fetch errors
    if (error instanceof Error) {
      throw new ApiRequestError(
        error.message || 'Network error occurred',
        0,
        'NetworkError'
      )
    }

    throw new ApiRequestError('Unknown error occurred', 0)
  }
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem('auth_token')
    return token
  } catch {
    return null
  }
}

/**
 * Helper methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
}
```

### 4. Create Environment File (Optional) (`apps/ui/.env.local`)
```env
VITE_API_URL=http://localhost:3000
```

**Note:** Add `.env.local` to `.gitignore` if not already there.

### 5. Create Test API Hook (For Verification)
Create `apps/ui/src/hooks/useApiTest.ts`:
```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '../shared/lib/api'

export function useApiTest() {
  return useQuery({
    queryKey: ['api-test'],
    queryFn: async () => {
      // This will fail since backend isn't ready yet, but tests the API layer
      try {
        const data = await api.get<{ message: string }>('/health')
        return data
      } catch (error) {
        // Expected to fail at this point
        console.log('API test (expected to fail):', error)
        return { message: 'API service is configured (backend not ready yet)' }
      }
    },
  })
}
```

## Verification Steps

1. **Check file structure:**
   ```bash
   ls -la apps/ui/src/shared/lib/api.ts
   ls -la apps/ui/src/shared/types/api.ts
   ```

2. **Test import in a component:**
   Add to `apps/ui/src/routes/index.tsx`:
   ```typescript
   import { api } from '../shared/lib/api'

   // In component
   console.log('API service loaded:', !!api)
   ```

3. **Start dev server:**
   ```bash
   pnpm dev:ui
   ```
   - Should compile without TypeScript errors

4. **Check browser console:**
   - Should see "API service loaded: true"
   - No import errors

5. **Test API methods exist:**
   ```typescript
   console.log('API methods:', Object.keys(api)) // ['get', 'post', 'put', 'patch', 'delete']
   ```

## Success Criteria
✅ API service file created with type safety
✅ Helper methods (get, post, put, patch, delete) available
✅ Auto-attaches JWT token from localStorage
✅ Proper error handling with ApiRequestError
✅ TypeScript types defined
✅ No compilation errors
✅ Can import and use api service

## Troubleshooting

**Issue:** TypeScript errors with api imports
- **Fix:** Check paths are correct relative to file location
- Ensure types file is created

**Issue:** import.meta.env.VITE_API_URL is undefined
- **Fix:** Restart dev server after creating .env.local
- Check variable name starts with VITE_

**Issue:** CORS errors when testing API
- **Fix:** Expected at this point (backend not configured yet)
- Will be resolved in backend steps

## Features of This API Service

1. **Automatic Authentication:** Reads token from localStorage and adds to headers
2. **Skip Auth Option:** Can skip auth for public endpoints
3. **Type Safety:** Generic types for request/response
4. **Error Handling:** Custom ApiRequestError with status codes
5. **Helper Methods:** Convenient api.get(), api.post(), etc.
6. **Content Type:** Auto-sets JSON headers
7. **Base URL:** Configurable via environment variable

## Usage Examples

```typescript
// GET request
const quizzes = await api.get<Quiz[]>('/quizzes')

// POST request
const user = await api.post<User>('/auth/register', {
  username: 'john',
  email: 'john@example.com',
  password: 'password123',
})

// Skip auth for public endpoint
const data = await api.get('/public', { skipAuth: true })

// With TanStack Query
const { data } = useQuery({
  queryKey: ['quizzes'],
  queryFn: () => api.get<Quiz[]>('/quizzes'),
})
```

## File Structure After This Step
```
apps/ui/src/
├── shared/
│   ├── lib/
│   │   └── api.ts            # New: API service
│   └── types/
│       └── api.ts            # New: API types
└── .env.local                # New: Environment variables
```

## Next Step
**Step 5: Setup Zustand Stores** - Create state management stores for auth, theme, and quiz
