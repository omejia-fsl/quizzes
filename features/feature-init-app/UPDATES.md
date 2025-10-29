# Updates to Implementation Steps

## Overview
This document outlines the key updates made to the feature-init-app planning to align with project best practices.

## Key Changes

### 1. Shared Packages Workspace (Step 0 - NEW)
- **Added:** `step-0-shared-packages-setup.md` as the first step
- **Purpose:** Create focused shared packages:
  - `packages/shared-models` - Zod schemas and types
  - `packages/shared-types` - Enums (QueryKeys) and TS types
  - `packages/shared-utils` - Common utilities
- **Key Points:**
  - ❌ No individual package.json files
  - ❌ No build step
  - ✅ Use root tsconfig with path aliases
  - ✅ Direct TypeScript imports
- **Benefits:**
  - Single source of truth for data structures
  - Type safety across frontend and backend
  - No duplicate DTOs/interfaces
  - Runtime validation with Zod
  - Fast development (no rebuild)

### 2. Use `type` Instead of `interface`
**Rationale:** Types are lighter weight; interfaces are designed for extension which we don't use.

**Files Affected:** All steps that define data structures

**Changes to Make When Implementing:**

Replace all `interface` declarations with `type`:

```typescript
// ❌ Old (interface)
export interface User {
  id: string
  username: string
}

// ✅ New (type)
export type User = {
  id: string
  username: string
}

// ✅ Best (inferred from Zod)
export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
})
export type User = z.infer<typeof UserSchema>
```

**Exceptions:**
- Extending HTMLAttributes (e.g., `InputProps extends InputHTMLAttributes`)
- These cases are fine to keep as `interface` since they use extension

### 3. React Query Keys as Enums
**Rationale:** Type-safe, refactorable, prevents typos

**Location:** `packages/shared/src/types/query-keys.ts`

**Changes to Make When Implementing:**

```typescript
// ❌ Old (string literals)
const { data } = useQuery({
  queryKey: ['auth-profile'],  // Typo-prone
  queryFn: () => api.get('/auth/profile'),
})

// ✅ New (enum)
import { QueryKeys } from '@quiz-app/shared'

const { data } = useQuery({
  queryKey: [QueryKeys.AUTH_PROFILE],  // Type-safe
  queryFn: () => api.get('/auth/profile'),
})
```

**Affected Steps:**
- Step 13: Auth store queries
- All future query hooks

### 4. Shared Zod Schemas

**Changes to Implementation:**

#### Step 11: User Schema
Instead of defining separate Mongoose schema and TypeScript interface:

```typescript
// ❌ Old approach (duplicated)
// Mongoose schema
@Schema()
export class User {
  @Prop() username: string
  @Prop() email: string
}

// Separate TypeScript type
export interface User {
  username: string
  email: string
}

// ✅ New approach (shared)
import { UserSchema, type User } from '@quiz-app/shared'

// Mongoose schema uses Zod for validation
@Schema()
export class UserModel {
  @Prop() username: string
  @Prop() email: string
}

// Use shared User type from Zod inference
```

#### Step 12: Auth Endpoints
Use shared DTOs instead of creating new ones:

```typescript
// ❌ Old (duplicate)
export class RegisterDto {
  username: string
  email: string
  password: string
}

// ✅ New (shared)
import { RegisterSchema, type RegisterCredentials } from '@quiz-app/shared'
import { createZodDto } from 'nestjs-zod'

export class RegisterDto extends createZodDto(RegisterSchema) {}
// Type is automatically RegisterCredentials from shared package
```

#### Step 13-15: Frontend Auth
Use shared types and schemas:

```typescript
// ❌ Old (duplicate)
interface LoginCredentials {
  email: string
  password: string
}

// ✅ New (shared)
import { LoginSchema, type LoginCredentials } from '@quiz-app/shared'

// Use in form validation
const { register, handleSubmit } = useForm<LoginCredentials>({
  resolver: zodResolver(LoginSchema),  // Shared validation rules
})
```

## Implementation Order (Updated)

**MUST START WITH STEP 0:**

```
Step 0: Shared Packages Setup     ← START HERE
  ↓
Step 1: Install Dependencies
  ↓
Steps 2-9: Frontend Foundation
  ↓
Step 10: MongoDB Setup
  ↓
Step 11: User Schema              ← Uses shared schemas
  ↓
Step 12: Auth Endpoints           ← Uses shared DTOs
  ↓
Step 13: Auth Store               ← Uses shared types + QueryKeys
  ↓
Steps 14-15: Login/Register       ← Uses shared validation schemas
```

## File Structure (Updated)

```
quiz-app/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── users/
│   │       │   ├── schemas/
│   │       │   │   └── user.schema.ts    # Mongoose (validation from shared Zod)
│   │       │   └── users.service.ts
│   │       └── auth/
│   │           ├── dto/
│   │           │   └── auth.dto.ts       # Uses shared Zod schemas
│   │           └── auth.service.ts
│   └── ui/
│       └── src/
│           ├── shared/
│           │   ├── stores/
│           │   │   └── authStore.ts      # Uses shared types
│           │   └── types/
│           │       └── api.ts            # Local types only
│           └── routes/
│               ├── login.tsx             # Uses shared LoginSchema
│               └── register.tsx          # Uses shared RegisterSchema
└── packages/                              # ← NEW (No package.json!)
    ├── shared-models/                     # Zod schemas
    │   ├── index.ts                       # Barrel export
    │   ├── user.model.ts                  # User schemas
    │   └── auth.model.ts                  # Auth schemas
    ├── shared-types/                      # TS types & enums
    │   ├── index.ts                       # Barrel export
    │   └── query-keys.ts                  # React Query keys
    └── shared-utils/                      # Utilities
        └── index.ts                       # Future utilities
```

## Benefits Summary

### Type Safety
- ✅ Frontend and backend use exact same types
- ✅ TypeScript catches mismatches at compile time
- ✅ Zod validates at runtime

### Maintainability
- ✅ Change schema once, updates everywhere
- ✅ No duplicate definitions to keep in sync
- ✅ Refactoring is easier and safer

### Developer Experience
- ✅ Autocomplete works across apps
- ✅ Enum-based query keys prevent typos
- ✅ Single source of truth for data structures

### Performance
- ✅ `type` is lighter than `interface`
- ✅ No runtime overhead for type annotations
- ✅ Enum-based keys are optimizable

## Migration Checklist

When implementing the steps, ensure:

- [ ] Step 0 completed before any other steps
- [ ] Packages folders created (shared-models, shared-types, shared-utils)
- [ ] Root tsconfig.json has path aliases configured
- [ ] All `interface` replaced with `type` (except HTML attribute extensions)
- [ ] All React Query keys use `QueryKeys` enum from `@quiz-app/shared-types`
- [ ] Backend DTOs use `createZodDto()` from `@quiz-app/shared-models`
- [ ] Frontend forms use shared Zod schemas with `zodResolver`
- [ ] Auth types imported from `@quiz-app/shared-models`
- [ ] No duplicate type definitions between frontend and backend
- [ ] NO package.json files in packages/ folders

## Example Imports

### Backend
```typescript
import { RegisterSchema, type RegisterCredentials } from '@quiz-app/shared-models'
import { LoginSchema, type LoginCredentials } from '@quiz-app/shared-models'
import { type User, type SafeUser } from '@quiz-app/shared-models'
```

### Frontend
```typescript
// Models
import {
  RegisterSchema,
  type RegisterCredentials,
  LoginSchema,
  type LoginCredentials,
  type AuthResponse
} from '@quiz-app/shared-models'

// Query keys
import { QueryKeys, createQueryKey } from '@quiz-app/shared-types'
```

## Notes

1. **Step 0 is Critical:** Without shared packages, later steps won't work correctly
2. **No Build Step:** Packages are source folders, TypeScript compiles them directly
3. **No package.json in Packages:** Use root config with path aliases
4. **Type Inference:** Prefer `z.infer<typeof Schema>` over manual type definitions
5. **Query Keys:** Always use enum, never string literals
6. **Validation:** Zod validates at runtime, TypeScript at compile time - both needed
7. **Package Organization:** Each package has focused purpose (models, types, utils)

## Questions During Implementation?

If you encounter issues:
1. Ensure Step 0 is completed (packages folders created)
2. Check tsconfig.json has path aliases configured
3. Check vite.config.ts has resolve.alias (frontend)
4. Restart TypeScript server in IDE
5. Check imports use correct package name (`@quiz-app/shared-models`, etc.)
6. Verify files exist in packages/ folders
