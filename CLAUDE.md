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
- Jest configured for unit tests with ts-jest
- Test files use `.spec.ts` suffix
- Data persistence will store quiz content, user scores, and attempt history

### Frontend (React + Vite)
- Vite with SWC for fast compilation and HMR
- React 19 with StrictMode enabled
- Tailwind CSS v4 for styling (configured via `@tailwindcss/vite` plugin)
- Entry point: `apps/ui/src/main.tsx`
- Uses TypeScript with separate tsconfig for app and node code

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