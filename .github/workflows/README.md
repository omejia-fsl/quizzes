# GitHub Actions Workflows

## Overview

This repository uses GitHub Actions for continuous integration to ensure code quality and prevent regressions. All workflows are optimized for cost-effectiveness and execution speed.

## Workflows

### 1. PR Validation (`pr-validation.yml`)
**Trigger:** Pull requests to main/dev branches

**Purpose:** Comprehensive validation of code changes including linting, formatting, type checking, building, and testing.

**Jobs:**
- **lint-format-build**: Main validation pipeline
  - ESLint checks
  - Prettier formatting verification
  - TypeScript type checking
  - API and UI builds
  - Test suite execution
  - Coverage report generation

- **quick-checks**: Fast preliminary checks
  - Package.json validation
  - Monorepo structure verification

- **changed-files**: Path-based change detection for conditional execution

- **validation-status**: Final status aggregation for PR checks

**Optimizations:**
- pnpm store caching
- Concurrent job execution
- Build artifact caching
- Coverage report retention (7 days)

### 2. PR Checks Lightweight (`pr-checks-lightweight.yml`)
**Trigger:** Pull requests with code changes only (ignores docs)

**Purpose:** Minimal, fast validation for routine PRs to save GitHub Actions minutes.

**Features:**
- Matrix strategy for parallel execution
- Fail-fast to stop on first error
- Path filtering to skip unnecessary runs
- 10-minute timeout
- Minimal artifact retention (1 day)

**Best for:** Regular development PRs where speed is priority

### 3. Claude Code Review (`claude-code-review.yml`)
**Trigger:** Pull requests (opened, synchronized)

**Purpose:** AI-powered code review using Claude to provide feedback on code quality, bugs, performance, and security.

### 4. Reusable Workflows

#### `reusable/pnpm-setup.yml`
Standardized pnpm environment setup that can be called from other workflows.

**Inputs:**
- `node-version` (default: '20')
- `pnpm-version` (default: '10.10.0')
- `install-deps` (default: true)

## Usage Guidelines

### For Contributors

1. **Before Creating a PR:**
   - Run `pnpm lint:fix` to fix linting issues
   - Run `pnpm format` to format code
   - Run `pnpm test` to ensure tests pass
   - Run `pnpm build:api` and `pnpm build:ui` to verify builds

2. **PR Checks:**
   - All PRs must pass the validation workflow
   - Check the GitHub Actions tab for detailed error logs
   - The status check at the bottom of the PR shows overall pass/fail

### For Maintainers

1. **Choosing the Right Workflow:**
   - Use `pr-validation.yml` for comprehensive checks on important PRs
   - Use `pr-checks-lightweight.yml` for routine development PRs
   - Both can run simultaneously if needed

2. **Cost Optimization:**
   - The lightweight workflow uses ~50% fewer Actions minutes
   - Matrix strategy enables parallel execution
   - Path filtering prevents unnecessary runs
   - Fail-fast stops execution on first failure

3. **Monitoring:**
   - Check the Actions tab for execution times
   - Review cache hit rates to ensure optimization
   - Adjust timeouts if jobs consistently take longer

## Caching Strategy

### What Gets Cached:
- pnpm store (~/.pnpm-store)
- node_modules (root and workspaces)
- Build artifacts (between jobs)

### Cache Keys:
```
Primary: pnpm-{os}-{hash of pnpm-lock.yaml}
Restore: pnpm-{os}-
```

### Cache Invalidation:
- Automatically on pnpm-lock.yaml changes
- Manually via GitHub Actions UI
- After 7 days (GitHub's cache expiration)

## Performance Benchmarks

Typical execution times (Ubuntu latest runner):
- Quick checks: ~1-2 minutes
- Lint & format: ~2-3 minutes
- Build (API + UI): ~3-4 minutes
- Tests: ~2-3 minutes
- Full validation: ~8-10 minutes
- Lightweight checks: ~4-5 minutes

## Troubleshooting

### Common Issues:

1. **Cache restoration fails:**
   - Clear cache from Actions settings
   - Check pnpm-lock.yaml is committed

2. **Build fails but works locally:**
   - Ensure all dependencies are in package.json
   - Check for case-sensitive file imports
   - Verify TypeScript strict mode compliance

3. **Tests fail in CI but pass locally:**
   - Check for timezone-dependent tests
   - Ensure test files don't depend on local state
   - Verify all test data is committed

4. **Workflow times out:**
   - Check for infinite loops in tests
   - Review build optimization
   - Consider increasing timeout limit

## Local Workflow Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or download from GitHub releases

# Test PR workflow
act pull_request -W .github/workflows/pr-validation.yml

# Test with specific event
act pull_request -e .github/test-events/pr-event.json
```

## Branch Protection Rules

Recommended settings for main branch:
- Require PR reviews (1-2 reviewers)
- Require status checks:
  - `PR Validation Status` (from pr-validation.yml)
  - OR `PR Status Check` (from pr-checks-lightweight.yml)
- Require branches to be up to date
- Include administrators in restrictions

## Future Improvements

- [ ] Add semantic-release for automated versioning
- [ ] Implement deployment workflows for staging/prod
- [ ] Add performance benchmarking
- [ ] Set up dependency update automation (Renovate/Dependabot)
- [ ] Add security scanning (CodeQL, Snyk)
- [ ] Implement visual regression testing for UI
- [ ] Add bundle size tracking

## Contributing to Workflows

When modifying workflows:
1. Test changes in a feature branch first
2. Use workflow_dispatch for manual testing
3. Monitor execution times and costs
4. Update this documentation
5. Consider backward compatibility

## Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [pnpm GitHub Action](https://github.com/pnpm/action-setup)
- [actions/cache Documentation](https://github.com/actions/cache)
- [Workflow Syntax Reference](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions)