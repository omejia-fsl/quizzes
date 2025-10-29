# Quizzes

A full-stack application built with NestJS and React in a pnpm monorepo workspace.

## Technologies

### Backend (API)
- **NestJS** v11 - Progressive Node.js framework
- **TypeScript** 5.9 - Type-safe JavaScript
- **Jest** v30 - Testing framework
- **RxJS** v7 - Reactive programming

### Frontend (UI)
- **React** v19 - UI library
- **Vite** v7 - Build tool and dev server
- **SWC** - Fast TypeScript/JavaScript compiler
- **TypeScript** 5.9 - Type-safe JavaScript

### Development Tools
- **pnpm** v10.10.0 - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Project Structure

```
quizzes/
├── apps/
│   ├── api/          # NestJS backend application
│   └── ui/           # React frontend application
├── packages/         # Shared packages (if any)
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** v10.10.0

If you don't have pnpm installed:
```bash
npm install -g pnpm@10.10.0
```

## Installation

Install all dependencies for both applications:

```bash
pnpm install
```

## Running the Project

### Quick Start (Root Commands)

From the root directory, you can use these convenient commands:

**Development:**
```bash
pnpm dev:api        # Start API in watch mode
pnpm dev:ui         # Start UI dev server with HMR
```

**Build:**
```bash
pnpm build:api      # Build API for production
pnpm build:ui       # Build UI for production
```

### Development Mode

**Start the API (Backend):**
```bash
pnpm dev:api
# or from root: pnpm --filter api start:dev
```
The API will run on `http://localhost:3000` by default.

**Start the UI (Frontend):**
```bash
pnpm dev:ui
# or from root: pnpm --filter ui dev
```
The UI development server will start with hot module replacement (HMR).

### Production Build

**Build the API:**
```bash
pnpm build:api
# or: pnpm --filter api build
pnpm --filter api start:prod
```

**Build the UI:**
```bash
pnpm build:ui
# or: pnpm --filter ui build
pnpm --filter ui preview
```

## Available Commands

### Root Commands
```bash
pnpm dev:api                    # Start API in development mode
pnpm dev:ui                     # Start UI in development mode
pnpm build:api                  # Build API for production
pnpm build:ui                   # Build UI for production
```

### API Commands
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

### UI Commands
```bash
pnpm --filter ui dev                # Start dev server with HMR
pnpm --filter ui build              # Type-check and build for production
pnpm --filter ui preview            # Preview production build
pnpm --filter ui lint               # Lint with ESLint
```

## Configuration

### API Configuration
The API runs on port 3000 by default. You can change this by setting the `PORT` environment variable.

### Monorepo Management
This project uses pnpm workspaces. All workspace packages are defined in `pnpm-workspace.yaml`.

## License

UNLICENSED