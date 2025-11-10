# GitHub Actions Workflow Architecture

## Overview

This repository uses a modular, DRY (Don't Repeat Yourself) approach to GitHub Actions workflows, utilizing composite actions and reusable workflows to eliminate duplication and improve maintainability.

## Architecture Components

### 🧩 Composite Actions

Located in `.github/actions/`, these are reusable action components for common tasks:

#### `setup-project`

**Path:** `.github/actions/setup-project/action.yml`

Handles the complete project setup including:

- Repository checkout
- pnpm installation and configuration
- Node.js setup
- Dependency caching (pnpm store + playwright cache)
- Dependency installation

**Usage:**

```yaml
- uses: ./.github/actions/setup-project
  with:
    node-version: '20' # default: '20'
    pnpm-version: '10.10.0' # default: '10.10.0'
    install-deps: true # default: true
    frozen-lockfile: true # default: true
    fetch-depth: 1 # default: 1
```

#### `validate-monorepo`

**Path:** `.github/actions/validate-monorepo/action.yml`

Validates the monorepo structure and ensures all required scripts exist:

- Checks for required directories (`apps/api`, `apps/ui`, `packages/`)
- Validates presence of essential config files
- Verifies availability of required npm scripts
- Lists all workspace packages

**Usage:**

```yaml
- uses: ./.github/actions/validate-monorepo
```

### 🔄 Reusable Workflows

Located in `.github/workflows/reusable/`, these are complete job definitions that can be called from other workflows:

#### `quality-checks.yml`

Runs code quality validations:

- ESLint checking
- Prettier format validation
- TypeScript type checking

**Usage:**

```yaml
jobs:
  quality:
    uses: ./.github/workflows/reusable/quality-checks.yml
    with:
      run-lint: true # default: true
      run-format: true # default: true
      run-typecheck: true # default: true
      continue-on-error: false # default: false
```

#### `build-test.yml`

Handles building and testing operations:

- API and UI builds
- Test execution
- Coverage generation and upload

**Usage:**

```yaml
jobs:
  build-test:
    uses: ./.github/workflows/reusable/build-test.yml
    with:
      build-api: true # default: true
      build-ui: true # default: true
      run-tests: true # default: true
      generate-coverage: true # default: true
      upload-coverage: true # default: true
```

### 📋 Main Workflows

#### `pr-validation.yml`

**Triggers:** PRs to `main` or `develop` branches

The primary validation workflow that:

1. **Quick Checks**: Validates monorepo structure
2. **Changed Files Detection**: Identifies what parts of the codebase changed
3. **Quality Checks**: Runs linting, formatting, and type checking
4. **Build & Test**: Builds applications and runs test suites
5. **Validation Status**: Aggregates results and provides summary

#### `pr-checks-lightweight.yml`

**Triggers:** PRs to feature/fix/chore branches

A faster, lightweight workflow for feature branches that:

- Detects changes and runs selective checks
- Quality checks with lenient error handling
- Selective builds based on what changed
- Skips full test suites for faster feedback

## Benefits of This Architecture

### 1. **Zero Duplication**

All setup logic is centralized in the `setup-project` composite action, eliminating the need to maintain the same steps across multiple jobs.

### 2. **Maintainability**

Changes to setup procedures only need to be made in one place. For example, updating the pnpm version requires changing only the default value in `setup-project/action.yml`.

### 3. **Modularity**

Each component has a single responsibility:

- Setup is handled by composite actions
- Quality checks are isolated in their own reusable workflow
- Build/test operations are separate from quality checks

### 4. **Flexibility**

All components accept parameters, making them adaptable to different use cases:

- Different Node.js versions for different branches
- Selective quality checks
- Conditional builds based on changes

### 5. **Performance**

- Efficient caching strategy reduces installation time
- Conditional execution based on changed files
- Parallel job execution where possible
- Concurrency controls prevent duplicate runs

## Configuration Management

### Version Management

All version numbers are centralized:

- **Node.js version**: Default `'20'` in composite actions
- **pnpm version**: Default `'10.10.0'` in composite actions

To update versions globally, modify the defaults in:

- `.github/actions/setup-project/action.yml`

### Cache Strategy

The workflow uses a multi-layer caching approach:

1. **pnpm store cache**: Caches downloaded packages
2. **Playwright cache**: Caches browser binaries
3. **Node modules cache**: Via pnpm's built-in caching

Cache keys include the lock file hash to ensure cache invalidation on dependency changes.

## Adding New Workflows

To create a new workflow using these components:

```yaml
name: My New Workflow

on:
  push:
    branches: [feature/xyz]

jobs:
  # Use composite action for setup
  setup-only:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup-project
        with:
          install-deps: true

  # Use reusable workflow for quality checks
  quality:
    uses: ./.github/workflows/reusable/quality-checks.yml
    with:
      run-lint: true
      run-format: false # Skip format check
      run-typecheck: true

  # Use reusable workflow for builds
  build:
    uses: ./.github/workflows/reusable/build-test.yml
    with:
      build-api: true
      build-ui: false # Skip UI build
      run-tests: false # Skip tests
```

## Troubleshooting

### Common Issues

1. **Composite action not found**
   - Ensure the path starts with `./`
   - Check that `action.yml` exists in the specified directory

2. **Reusable workflow fails**
   - Verify all required inputs are provided
   - Check that the workflow file exists in `.github/workflows/reusable/`

3. **Cache misses**
   - Ensure `pnpm-lock.yaml` hasn't changed
   - Check that cache keys match between jobs

### Debugging

Enable debug logging by setting repository secrets:

- `ACTIONS_RUNNER_DEBUG`: `true`
- `ACTIONS_STEP_DEBUG`: `true`

## Future Improvements

Potential enhancements to consider:

1. **Matrix builds**: Test against multiple Node.js versions
2. **Deployment workflows**: Reusable deployment components
3. **Performance metrics**: Track workflow execution times
4. **Conditional matrix**: Dynamic matrix based on changed files
5. **Self-hosted runners**: For improved performance and cost reduction
