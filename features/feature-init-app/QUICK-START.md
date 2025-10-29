# Quick Start Guide - feature-init-app

## TL;DR - What You Need to Know

### 1. Start with Step 0
**CRITICAL:** Before doing anything, create the shared packages:
```bash
# Follow step-0-shared-packages-setup.md
mkdir -p packages/shared/src/{schemas,types}
```

This creates `@quiz-app/shared` for types used by both frontend and backend.

### 2. Code Standards

#### Always Use `type`, Not `interface`
```typescript
// ✅ Good
export type User = {
  id: string
  name: string
}

// ❌ Avoid
export interface User {
  id: string
  name: string
}
```

**Exception:** When extending HTML attributes:
```typescript
// ✅ OK to use interface here
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}
```

#### React Query Keys = Enums Only
```typescript
// ✅ Good
import { QueryKeys } from '@quiz-app/shared'
useQuery({
  queryKey: [QueryKeys.AUTH_PROFILE],
  queryFn: () => api.get('/auth/profile'),
})

// ❌ Never use strings
useQuery({
  queryKey: ['auth-profile'],  // NO!
  queryFn: () => api.get('/auth/profile'),
})
```

#### Zod Schemas Are Shared
```typescript
// ✅ Backend (NestJS)
import { RegisterSchema } from '@quiz-app/shared'
export class RegisterDto extends createZodDto(RegisterSchema) {}

// ✅ Frontend (React)
import { RegisterSchema, type RegisterCredentials } from '@quiz-app/shared'
const form = useForm<RegisterCredentials>({
  resolver: zodResolver(RegisterSchema),
})
```

### 3. Execution Order

```
Step 0: Shared Packages  ← DO THIS FIRST
  ↓
Step 1: Install deps
  ↓
Steps 2-9: Frontend setup
  ↓
Steps 10-12: Backend + Auth API
  ↓
Steps 13-15: Auth UI
```

### 4. Project Structure

```
quiz-app/
├── apps/
│   ├── api/                # Backend (NestJS)
│   └── ui/                 # Frontend (React)
├── packages/               # Shared code (no package.json needed)
│   ├── shared-models/      # Zod schemas ← YOU CREATE THIS
│   ├── shared-types/       # Enums, types ← YOU CREATE THIS
│   └── shared-utils/       # Utilities ← YOU CREATE THIS
├── features/               # Planning docs (you are here)
│   └── feature-init-app/
└── pnpm-workspace.yaml
```

### 5. Common Issues

#### "Cannot find module '@quiz-app/shared-models'"
```bash
# Solution 1: Check tsconfig.json has path aliases
"paths": {
  "@quiz-app/shared-models": ["./packages/shared-models"]
}

# Solution 2: Restart TypeScript server in IDE
# Solution 3: Check file exists in packages/shared-models/
```

#### "Property 'foo' does not exist on type..."
- Check you're importing from `@quiz-app/shared-models` or `@quiz-app/shared-types`
- Check you're using `type`, not `interface`
- Restart TypeScript server in IDE

#### "Query key must be an array"
```typescript
// ❌ Wrong
queryKey: QueryKeys.AUTH_PROFILE

// ✅ Right
queryKey: [QueryKeys.AUTH_PROFILE]
```

### 6. Key Files Reference

**Shared Packages:**
- `packages/shared-models/user.model.ts` - User Zod schema
- `packages/shared-models/auth.model.ts` - Auth Zod schemas
- `packages/shared-types/query-keys.ts` - React Query key enums

**Backend:**
- `apps/api/src/auth/dto/auth.dto.ts` - Uses shared schemas
- `apps/api/src/users/schemas/user.schema.ts` - Mongoose schema

**Frontend:**
- `apps/ui/src/shared/stores/authStore.ts` - Uses shared types
- `apps/ui/src/routes/login.tsx` - Uses shared LoginSchema
- `apps/ui/src/routes/register.tsx` - Uses shared RegisterSchema

### 7. Testing Your Setup

After Step 0, test imports work:

**Backend:**
```typescript
// In apps/api/src/test.ts
import { RegisterSchema } from '@quiz-app/shared-models'
import { QueryKeys } from '@quiz-app/shared-types'
console.log(RegisterSchema, QueryKeys.AUTH_PROFILE) // Should not error
```

**Frontend:**
```typescript
// In apps/ui/src/test.ts
import { RegisterSchema } from '@quiz-app/shared-models'
import { QueryKeys } from '@quiz-app/shared-types'
console.log(RegisterSchema, QueryKeys.AUTH_PROFILE) // Should not error
```

### 8. When to Use What

| Need | Use |
|------|-----|
| Define data structure | Zod schema in `packages/shared-models` |
| Create type | `z.infer<typeof Schema>` |
| Backend DTO | `createZodDto(SharedSchema)` |
| Frontend form validation | `zodResolver(SharedSchema)` |
| React Query key | `QueryKeys` enum from `shared-types` |
| Utility function | Add to `packages/shared-utils` |
| Local type (not shared) | `type` in local file |

### 9. Remember

- 🚫 NO string literals in query keys
- 🚫 NO `interface` (use `type`)
- 🚫 NO duplicate type definitions
- ✅ YES shared Zod schemas
- ✅ YES `z.infer<typeof Schema>` for types
- ✅ YES `QueryKeys` enum

### 10. Get Started

```bash
# 1. Open step 0
cat features/feature-init-app/step-0-shared-packages-setup.md

# 2. Create shared packages (NO package.json needed!)
mkdir -p packages/shared-models
mkdir -p packages/shared-types
mkdir -p packages/shared-utils

# 3. Follow step 0 completely

# 4. Continue to step 1

# 5. Execute steps 1-15 in order
```

## Need More Detail?

- Full guide: `README.md`
- Updates summary: `UPDATES.md`
- Individual steps: `step-0.md` through `step-15.md`

## Questions?

Common patterns:
- **Sharing types?** → Put Zod schema in `packages/shared-models`
- **Query key?** → Use `QueryKeys` enum from `shared-types`
- **Need a type?** → Use `type`, not `interface`
- **Backend validation?** → `createZodDto()` from shared schema
- **Frontend validation?** → `zodResolver()` with shared schema
- **Utility function?** → Add to `packages/shared-utils`

**Remember:** Packages don't need package.json, just create folders and files!

That's it! Now go build. 🚀
