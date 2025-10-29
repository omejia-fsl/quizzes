# Step 1: Install Dependencies

## Goal
Install all required npm packages for both frontend and backend without breaking the existing setup. This ensures we have all the tools needed for the entire init phase.

## Prerequisites
- pnpm installed (version 10.10.0)
- Node.js compatible with React 19 and NestJS
- Both apps/ui and apps/api are accessible

## Packages to Install

### Frontend (apps/ui)
```bash
pnpm --filter ui add @tanstack/react-router @tanstack/react-query zustand react-hook-form yup @hookform/resolvers react-hot-toast lucide-react
```

**Packages:**
- `@tanstack/react-router` - Type-safe routing with file-based structure
- `@tanstack/react-query` - Data fetching, caching, and synchronization
- `zustand` - Lightweight state management
- `react-hook-form` - Performant form validation
- `yup` - Schema validation for forms
- `@hookform/resolvers` - Bridges react-hook-form with yup
- `react-hot-toast` - Toast notifications
- `lucide-react` - Beautiful icon library

### Backend (apps/api)
```bash
pnpm --filter api add @nestjs/mongoose mongoose @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt nestjs-zod zod @nestjs/config
pnpm --filter api add -D @types/passport-jwt @types/bcrypt
```

**Packages:**
- `@nestjs/mongoose` + `mongoose` - MongoDB ODM for NestJS
- `@nestjs/jwt` + `@nestjs/passport` - JWT authentication
- `passport` + `passport-jwt` - Passport strategy for JWT
- `bcrypt` - Password hashing
- `nestjs-zod` + `zod` - Schema validation with Zod
- `@nestjs/config` - Environment configuration
- Dev: TypeScript types for passport-jwt and bcrypt

## Implementation Steps

### 1. Install Frontend Dependencies
```bash
cd /Users/omejia/Documents/Claude Training/quizzes
pnpm --filter ui add @tanstack/react-router @tanstack/react-query zustand react-hook-form yup @hookform/resolvers react-hot-toast lucide-react
```

### 2. Install Backend Dependencies
```bash
pnpm --filter api add @nestjs/mongoose mongoose @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt nestjs-zod zod @nestjs/config
pnpm --filter api add -D @types/passport-jwt @types/bcrypt
```

### 3. Verify Installations
Check that packages appear in respective `package.json` files:
- `apps/ui/package.json` should have all frontend deps
- `apps/api/package.json` should have all backend deps

## Verification Steps

1. **Check installation:**
   ```bash
   cd apps/ui && pnpm list | grep tanstack
   cd ../api && pnpm list | grep nestjs/mongoose
   ```

2. **Start frontend dev server:**
   ```bash
   pnpm dev:ui
   ```
   - Should start without errors
   - App should load in browser (http://localhost:5173 or similar)

3. **Start backend dev server:**
   ```bash
   pnpm dev:api
   ```
   - Should compile and start without errors
   - API should be running (http://localhost:3000)

4. **Check for peer dependency warnings:**
   - If any warnings appear, resolve them (usually auto-resolved by pnpm)

## Success Criteria
✅ All packages installed in respective workspaces
✅ No installation errors
✅ `pnpm dev:ui` starts successfully
✅ `pnpm dev:api` starts successfully
✅ No breaking changes to existing app
✅ Both apps/ui and apps/api package.json files updated

## Troubleshooting

**Issue:** Peer dependency conflicts
- **Fix:** Run `pnpm install` at root to resolve

**Issue:** API fails to start after adding packages
- **Fix:** Check NestJS version compatibility, may need to update @nestjs/core

**Issue:** Frontend won't compile
- **Fix:** Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`

## Expected Changes
- `apps/ui/package.json` - 8 new dependencies
- `apps/api/package.json` - 10 new dependencies + 2 devDependencies
- `pnpm-lock.yaml` - Updated with new package resolutions

## Next Step
**Step 2: Setup TanStack Router** - Configure file-based routing system with basic routes
