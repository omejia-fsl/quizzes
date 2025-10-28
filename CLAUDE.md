# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a pnpm monorepo workspace with two applications:

- `apps/api`: NestJS backend API (TypeScript)
- `apps/ui`: React + Vite frontend (TypeScript, SWC)

The workspace is managed using pnpm workspaces defined in `pnpm-workspace.yaml`. Dependencies are shared at the root level where possible.

## Development Commands

### API (NestJS Backend)
Run from root or `apps/api` directory:

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
Run from root or `apps/ui` directory:

```bash
pnpm --filter ui dev                # Start dev server with HMR
pnpm --filter ui build              # Type-check and build for production
pnpm --filter ui preview            # Preview production build
pnpm --filter ui lint               # Lint with ESLint
```

### Root Commands
```bash
pnpm install                        # Install all dependencies
```

## Architecture

### Backend (NestJS)
- Standard NestJS module-based architecture
- Entry point: `apps/api/src/main.ts`
- Root module: `apps/api/src/app.module.ts`
- Jest configured for unit tests with ts-jest
- Test files use `.spec.ts` suffix

### Frontend (React + Vite)
- Vite with SWC for fast compilation and HMR
- React 19 with StrictMode enabled
- Entry point: `apps/ui/src/main.tsx`
- Uses TypeScript with separate tsconfig for app and node code

## Package Management
- Uses pnpm as the package manager (version 10.10.0)
- Always use `pnpm` commands, not `npm` or `yarn`
- Use `--filter <package-name>` to run commands in specific workspaces from root