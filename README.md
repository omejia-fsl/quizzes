# Quizzes

An AI Development Quiz App — an educational platform for testing knowledge of AI software development concepts. Built with NestJS and React in a pnpm monorepo workspace.

## Technologies

### Backend (API)

- **NestJS** v11 - Progressive Node.js framework
- **TypeScript** 5.9 - Type-safe JavaScript
- **Vitest** v4 - Unit and integration testing
- **RxJS** v7 - Reactive programming

### Frontend (UI)

- **React** v19 - UI library
- **Vite** v7 - Build tool and dev server with HMR
- **SWC** - Fast TypeScript/JavaScript compiler
- **Tailwind CSS** v4 - Utility-first CSS framework
- **TypeScript** 5.9 - Type-safe JavaScript
- **Vitest** v4 - Component testing with React Testing Library

### Shared Packages

- **@quiz-app/shared-models** - Zod schemas and type definitions
- **@quiz-app/shared-types** - Shared TypeScript types
- **@quiz-app/shared-utils** - Shared utility functions

### Development Tools

- **pnpm** v10.10.0 - Fast, disk space efficient package manager
- **ESLint** v9 - Code linting with TypeScript and React support
- **Prettier** v3 - Code formatting
- **Vitest** - Unified testing across all projects

## Project Structure

```
quizzes/
├── apps/
│   ├── api/                    # NestJS backend application
│   └── ui/                     # React frontend application
├── packages/
│   ├── shared-models/          # Zod schemas and data models
│   ├── shared-types/           # Shared TypeScript types
│   └── shared-utils/           # Shared utility functions
├── dist/                       # Centralized build output
│   ├── api/                    # Compiled API code
│   ├── ui/                     # Production UI build
│   └── shared-*/               # Compiled shared packages
├── features/                   # Feature documentation and guides
├── .claude/commands/           # Custom Claude Code commands
├── pnpm-workspace.yaml         # Workspace configuration
└── package.json                # Root package configuration
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev:api        # API runs on http://localhost:3000
pnpm dev:ui         # UI runs with HMR

# Run tests
pnpm test           # Run all tests
pnpm test:watch     # Watch mode

# Lint and format
pnpm lint:fix       # Fix linting issues
pnpm format         # Format code
```

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** v10.10.0

If you don't have pnpm installed:

```bash
npm install -g pnpm@10.10.0
```

## Installation

Install all dependencies for all applications and packages:

```bash
pnpm install
```

## Development

### Start Development Servers

**API (Backend):**

```bash
pnpm dev:api
```

The API will run on `http://localhost:3000` by default.

**UI (Frontend):**

```bash
pnpm dev:ui
```

The UI development server will start with hot module replacement (HMR).

### Production Build

**Build all projects:**

```bash
pnpm build:api      # Outputs to /dist/api
pnpm build:ui       # Outputs to /dist/ui
```

**Run production build:**

```bash
pnpm --filter api start:prod    # Start production API
pnpm --filter ui preview        # Preview production UI
```

## Available Commands

### Development

```bash
pnpm dev:api                    # Start API in development mode (port 3000)
pnpm dev:ui                     # Start UI dev server with HMR
```

### Building

```bash
pnpm build:api                  # Build API to /dist/api
pnpm build:ui                   # Build UI to /dist/ui
```

### Testing

```bash
pnpm test                       # Run all tests in all projects
pnpm test:watch                 # Run all tests in watch mode
pnpm test:api                   # Run only API tests
pnpm test:ui                    # Run only UI tests
pnpm test:packages              # Run all shared package tests
pnpm test:coverage              # Run tests with coverage report
pnpm test:vitest-ui             # Open Vitest UI for all projects
```

### Linting and Formatting

```bash
pnpm lint                       # Lint all TS/TSX files
pnpm lint:fix                   # Lint and auto-fix issues
pnpm format                     # Format all files (TS, TSX, JSON, CSS, HTML)
pnpm format:check               # Check formatting without changes
```

### Workspace Commands

Run commands in specific workspaces using `--filter`:

**API Commands:**

```bash
pnpm --filter api start:dev        # Start in watch mode
pnpm --filter api build             # Build for production
pnpm --filter api start:prod        # Run production build
```

**UI Commands:**

```bash
pnpm --filter ui dev                # Start dev server with HMR
pnpm --filter ui build              # Type-check and build for production
pnpm --filter ui preview            # Preview production build
```

## Configuration

### API Configuration

The API runs on port 3000 by default. You can change this by setting the `PORT` environment variable.

### Testing Configuration

This project uses **Vitest** with a workspace configuration that covers all apps and packages:

- **Root config**: `vitest.config.ts` defines global settings and projects
- **Project configs**: Each app/package has its own `vitest.config.ts`
- **Coverage**: Unified coverage reports across all projects

### Monorepo Management

This project uses pnpm workspaces with:

- Workspace packages defined in `pnpm-workspace.yaml`
- Shared dependencies at root level
- Path aliases for shared packages (`@quiz-app/shared-*`)
- Centralized build output in `/dist`

## Documentation

- **CLAUDE.md** - Comprehensive development guide for Claude Code
- **PRD.md** - Product Requirements Document
- **features/** - Step-by-step feature implementation guides

## Custom Commands

This project includes custom Claude Code commands in `.claude/commands/`:

- `/ui-component` - Create reusable React UI components with tests
- `/execute-feature-step` - Execute feature development steps

## License

UNLICENSED
