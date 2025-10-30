# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Development Quiz App — an educational platform for testing knowledge of AI software development concepts including agent design, prompt engineering, and model selection. See `PRD.md` for complete product requirements.

## Project Structure

This is a pnpm monorepo workspace with two applications:

- `apps/api`: NestJS backend API (TypeScript) — handles quiz data, user progress, and scoring
- `apps/ui`: React + Vite frontend (TypeScript, SWC, Tailwind CSS) — quiz interface and user dashboard

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
- `apps/ui/vitest.config.ts`: UI project (React, jsdom environment, `.test.{ts,tsx}` files)
- `apps/api/vitest.config.ts`: API project (NestJS, node environment, `.spec.{ts,tsx}` files)

**Running Tests:**

From root directory:
```bash
pnpm test                           # Run all tests in all projects
pnpm test:watch                     # Run all tests in watch mode
pnpm test:ui                        # Run only UI tests
pnpm test:ui:watch                  # Run UI tests in watch mode
pnpm test:api                       # Run only API tests
pnpm test:api:watch                 # Run API tests in watch mode
pnpm test:coverage                  # Run all tests with unified coverage report
pnpm test:vitest-ui                 # Open Vitest UI for all projects
```

**Project Filtering:**

You can filter tests by project using the `--project` flag:
```bash
vitest --project ui                 # Run only UI tests
vitest --project api                # Run only API tests
vitest --project ui --project api   # Run both UI and API tests
```

**WebStorm/IDE Configuration:**

Configure Vitest to use the root config file:
1. Go to `Run → Edit Configurations → + → Vitest`
2. Set working directory to: `/Users/omejia/Documents/Claude Training/quizzes`
3. Set Vitest config: `vitest.config.ts`
4. (Optional) Use `--project <name>` in additional arguments to filter projects

Legacy Jest configuration remains in API for NestJS default tests (use `pnpm --filter api test:jest`).

### Building for Production
```bash
pnpm build:api                      # Build API
pnpm build:ui                       # Build UI (includes TypeScript check)
```

## Architecture

### Backend (NestJS)
- Standard NestJS module-based architecture
- Entry point: `apps/api/src/main.ts`
- Root module: `apps/api/src/app.module.ts`
- Vitest configured for testing (Jest still available via `test:jest` scripts)
- Test files use `.spec.ts` suffix
- Data persistence will store quiz content, user scores, and attempt history

### Frontend (React + Vite)
- Vite with SWC for fast compilation and HMR
- React 19 with StrictMode enabled
- Tailwind CSS v4 for styling (configured via `@tailwindcss/vite` plugin)
- Entry point: `apps/ui/src/main.tsx`
- Uses TypeScript with separate tsconfig for app and node code
- Vitest for testing with `@testing-library/react`
- Test setup: `apps/ui/src/test/setup.ts`
- Test files use `.test.tsx` or `.test.ts` suffix

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
- In the `features/` folder will be located the different planned features and how they will be executed or was executed for the project.