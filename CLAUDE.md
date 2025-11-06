# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Development Quiz App — an educational platform for testing knowledge of AI software development concepts including agent design, prompt engineering, and model selection. See `PRD.md` for complete product requirements.

## Project Structure

This is a pnpm monorepo workspace with the following structure:

**Applications:**
- `apps/api`: NestJS backend API (TypeScript) — handles quiz data, user progress, and scoring
- `apps/ui`: React + Vite frontend (TypeScript, SWC, Tailwind CSS) — quiz interface and user dashboard

**Shared Packages:**
- `packages/shared-models`: Zod schemas and type definitions for data models (auth, user, etc.)
- `packages/shared-types`: Shared TypeScript types and query keys for React Query
- `packages/shared-utils`: Shared utility functions and helpers

**Build Output:**
All compiled code outputs to a centralized `/dist` folder at the root:
- `/dist/api` - NestJS compiled output
- `/dist/ui` - Vite production build
- `/dist/shared-*` - Compiled shared packages

The workspace is managed using pnpm workspaces defined in `pnpm-workspace.yaml`. Dependencies are shared at the root level where possible.

## Development Commands

### Quick Start (Recommended)
```bash
pnpm install                        # Install all dependencies
pnpm dev:api                        # Start API in watch mode (port 3000)
pnpm dev:ui                         # Start UI dev server with HMR
pnpm test                           # Run all tests with Vitest
```

### API (NestJS Backend)
Run from root:
```bash
pnpm --filter api start:dev        # Start in watch mode
pnpm --filter api build             # Build for production
pnpm --filter api start:prod        # Run production build
pnpm --filter api test              # Run unit tests
pnpm --filter api test:watch        # Run tests in watch mode
pnpm --filter api test:e2e          # Run e2e tests
pnpm --filter api test:cov          # Run tests with coverage
pnpm --filter api lint              # Lint and fix TypeScript files
pnpm --filter api format            # Format with Prettier
```

The API runs on port 3000 by default (configurable via `PORT` environment variable).

### UI (React Frontend)
Run from root:
```bash
pnpm --filter ui dev                # Start dev server with HMR
pnpm --filter ui build              # Type-check and build for production
pnpm --filter ui preview            # Preview production build
pnpm --filter ui lint               # Lint with ESLint
```

### Testing

This project uses Vitest with a workspace/projects configuration for the monorepo.

**Test Structure:**
- Root `vitest.config.ts` defines projects and global settings (coverage, reporters)
- Each app/package has its own `vitest.config.ts`:
  - `apps/ui`: React tests, jsdom environment, `.test.{ts,tsx}` files
  - `apps/api`: NestJS tests, node environment, `.spec.{ts,tsx}` files
  - `packages/shared-models`: Node environment, `.test.{ts,tsx}` files
  - `packages/shared-types`: Node environment, `.test.{ts,tsx}` files
  - `packages/shared-utils`: Node environment, `.test.{ts,tsx}` files

**Running Tests:**

From root directory:
```bash
pnpm test                           # Run all tests in all projects
pnpm test:watch                     # Run all tests in watch mode
pnpm test:ui                        # Run only UI tests
pnpm test:ui:watch                  # Run UI tests in watch mode
pnpm test:api                       # Run only API tests
pnpm test:api:watch                 # Run API tests in watch mode
pnpm test:packages                  # Run all package tests (shared-*)
pnpm test:packages:watch            # Run package tests in watch mode
pnpm test:coverage                  # Run all tests with unified coverage report
pnpm test:vitest-ui                 # Open Vitest UI for all projects
```

**Project Filtering:**

The root vitest config uses glob patterns for projects: `./apps/*` and `./packages/*`. You can filter tests by project name:
```bash
vitest --project ui                 # Run only UI tests
vitest --project api                # Run only API tests
vitest --project shared-models      # Run only shared-models tests
```

### Linting and Formatting

**Linting:**
```bash
pnpm lint                           # Lint all TS/TSX files
pnpm lint:fix                       # Lint and auto-fix issues
```

ESLint is configured in `eslint.config.js` (ESLint v9 flat config) with TypeScript, React Hooks, and Prettier integration. The configuration:
- Uses TypeScript ESLint parser with project service
- Enforces React Hooks rules
- Integrates with Prettier for formatting rules
- Ignores `dist` folder

**Formatting:**
```bash
pnpm format                         # Format all TS, TSX, JSON, CSS, HTML files
pnpm format:check                   # Check formatting without modifying files
```

Prettier is configured in `.prettierrc` with single quotes, trailing commas, and semicolons. The `.prettierignore` excludes `node_modules`, `dist`, and other build artifacts.

### Building for Production
```bash
pnpm build:api                      # Build API to /dist/api
pnpm build:ui                       # Build UI to /dist/ui (includes TypeScript check)
```

## Architecture

### Backend (NestJS)
- Standard NestJS module-based architecture
- Entry point: `apps/api/src/main.ts`
- Root module: `apps/api/src/app.module.ts`
- Vitest configured for testing (Jest configuration still present but Vitest is preferred)
- Test files use `.spec.ts` suffix
- Outputs to `/dist/api` (configured in tsconfig.json and nest-cli.json)
- Data persistence will store quiz content, user scores, and attempt history

### Frontend (React + Vite)
- Vite with SWC for fast compilation and HMR
- React 19 with StrictMode enabled
- Tailwind CSS v4 for styling (configured via `@tailwindcss/vite` plugin)
- Entry point: `apps/ui/src/main.tsx`
- Uses TypeScript with separate tsconfigs:
  - `tsconfig.app.json` for application code (bundler mode)
  - `tsconfig.node.json` for Vite config
- Vitest for testing with `@testing-library/react`
- Test setup: `apps/ui/vitest.setup.ts`
- Test files use `.test.tsx` or `.test.ts` suffix
- Outputs to `/dist/ui` (configured in vite.config.ts)

### Shared Packages Architecture
- **Type Safety**: All packages use TypeScript with strict mode enabled
- **Path Aliases**: Packages can be imported using `@quiz-app/shared-*` aliases (configured in root tsconfig.json)
- **Compilation**: Each package has its own tsconfig.json that extends the root config
- **Module System**: Packages use NodeNext module resolution for compatibility

### Application Flow
- Users select quiz categories from the home page
- Quiz experience shows questions sequentially with immediate feedback
- Progress indicator tracks completion (e.g., "Question 3 of 10")
- Results page displays score, performance feedback, and allows retakes
- User progress and scores persist across sessions

## Package Management
- Uses pnpm as the package manager (version 10.10.0)
- Always use `pnpm` commands, not `npm` or `yarn`
- Use `--filter <package-name>` to run commands in specific workspaces from root
- Workspace packages defined in `pnpm-workspace.yaml`: `apps/*` and `packages/**/*`

## Feature Development Process
The `features/` folder contains structured feature documentation with step-by-step implementation guides. Each feature folder includes:
- Step files (e.g., `step-0-shared-packages-setup.md`)
- README.md with feature overview
- QUICK-START.md and UPDATES.md for context

**Custom Commands:**
- `/execute-feature-step <feature-folder-path> <step-number>` - Execute a specific feature step
- `/ui-component <name> <folder-path> <specifications>` - Create a reusable React component with tests

Use these commands to follow the structured development workflow defined in feature documentation.

## Project Conventions
- In the app the created components should be arrow function components, not function or class components