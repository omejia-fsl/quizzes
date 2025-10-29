# Feature: Init App

## Overview
This feature establishes the foundation for the entire Quiz App. It includes all the initial setup, core infrastructure, and authentication system needed before building specific features like quizzes, dashboard, etc.

**Location:** `features/feature-init-app/` (in project root)

## Goals
- Set up shared packages workspace for type safety across apps
- Set up routing, state management, and data fetching infrastructure
- Implement dark mode with navbar
- Build complete authentication system (frontend + backend)
- Create reusable layout and API service layer
- Ensure app is working and deployable after completion

## Steps Overview

### Shared Setup (Step 0) - **START HERE**
0. **Shared Packages Setup** - Create shared Zod schemas and types for both apps

### Frontend Foundation (Steps 1-9)
1. **Install Dependencies** - Add all required npm packages
2. **Setup TanStack Router** - Configure file-based routing
3. **Setup TanStack Query** - Configure data fetching and caching
4. **Create API Service** - Build fetch wrapper with auth support
5. **Setup Zustand Stores** - Initialize state management stores
6. **Create Layout Structure** - Build app layout wrapper
7. **Implement Navbar** - Build navigation with links
8. **Implement Dark Mode** - Add theme toggle with persistence
9. **Create Home Page** - Build welcoming landing page

### Backend Foundation (Steps 10-12)
10. **Setup MongoDB** - Configure database connection
11. **User Schema** - Create User model with Mongoose (uses shared Zod schemas)
12. **Auth Endpoints** - Build register/login/profile endpoints (uses shared DTOs)

### Authentication Flow (Steps 13-15)
13. **Auth Store** - Complete frontend auth state management (uses shared types)
14. **Login Page** - Build login form with validation (uses shared schemas)
15. **Register Page** - Build registration form (uses shared schemas)

## Tech Stack Used
- **Routing:** TanStack Router (file-based)
- **Data Fetching:** TanStack Query with enum-based keys
- **State Management:** Zustand
- **Forms:** React Hook Form + Yup (transitioning to Zod)
- **HTTP:** Native Fetch API (no axios)
- **Backend:** NestJS + MongoDB + Mongoose
- **Validation:** Zod (shared across frontend and backend)
- **Auth:** JWT with @nestjs/jwt
- **Styling:** Tailwind CSS v4
- **Shared Code:** packages/shared workspace

## Project Structure
```
quiz-app/
├── apps/
│   ├── api/                # NestJS backend
│   └── ui/                 # React frontend
├── packages/               # Shared code (NO package.json per package)
│   ├── shared-models/      # Zod schemas and inferred types
│   ├── shared-types/       # TypeScript types and enums
│   └── shared-utils/       # Common utilities
├── features/               # Feature planning and docs (THIS FOLDER)
│   └── feature-init-app/
│       ├── README.md
│       ├── QUICK-START.md
│       ├── UPDATES.md
│       ├── step-0-shared-packages-setup.md
│       ├── step-1-install-dependencies.md
│       └── ... (all step files)
└── pnpm-workspace.yaml
```

## Code Standards

### Use `type` Instead of `interface`
- Types are lighter weight than interfaces
- Interfaces are designed for extension (which we don't use)
- Consistency across codebase

```typescript
// ✅ Good
export type User = z.infer<typeof UserSchema>

// ❌ Avoid
export interface User {
  id: string
}
```

### React Query Keys as Enums
- Use centralized enum in `packages/shared-types/query-keys.ts`
- No string literals in query keys
- Type-safe and refactorable

```typescript
// ✅ Good
import { QueryKeys } from '@quiz-app/shared-types'
const { data } = useQuery({
  queryKey: [QueryKeys.QUIZZES],
  queryFn: () => api.get('/quizzes'),
})

// ❌ Avoid
const { data } = useQuery({
  queryKey: ['quizzes'],  // String literal
  queryFn: () => api.get('/quizzes'),
})
```

## Success Criteria
After completing all steps in this feature:
- ✅ App has working routing between pages
- ✅ Dark mode toggle works and persists across sessions
- ✅ Users can register new accounts
- ✅ Users can login and maintain authenticated session
- ✅ Protected routes redirect to login when unauthenticated
- ✅ Navbar shows user status and navigation links
- ✅ API endpoints are secured with JWT
- ✅ App is fully functional and ready for quiz features

## Execution Instructions

### Sequential Execution
**IMPORTANT:** Execute steps in order (0 → 1 → 2 → 3 ... → 15). Each step builds on the previous one.

**Start with Step 0** to create the shared packages structure before any other steps.

### After Each Step
1. Read the step markdown file completely
2. Implement the changes described
3. Run the verification steps
4. Ensure all success criteria are met
5. Test that the app still works
6. Commit changes (optional but recommended)
7. Move to next step

### Running the App During Development
```bash
# Terminal 1 - Backend
pnpm dev:api

# Terminal 2 - Frontend
pnpm dev:ui
```

## Next Feature
After completing `feature-init-app`, move on to:
- **feature-quiz-core** - Implement quiz taking experience

## Notes
- Each step is designed to be atomic and non-breaking
- App should remain functional after each step
- If a step fails verification, debug before proceeding
- Keep both backend and frontend dev servers running during implementation
