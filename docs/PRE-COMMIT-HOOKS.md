# Pre-Commit Hooks Documentation

## Overview

This project uses Husky and lint-staged to enforce code quality standards before commits. The pre-commit hooks run automatically when you attempt to commit changes, ensuring that only properly formatted and linted code makes it into the repository.

## What Gets Checked

When you run `git commit`, the following checks are performed **only on staged files**:

### For TypeScript/TSX Files (*.ts, *.tsx)
1. **ESLint** - Fixes linting issues automatically and fails on warnings
2. **Prettier** - Formats code according to project standards
3. **TypeScript Compilation** - Verifies there are no type errors in the entire project

### For JavaScript Files (*.js, *.jsx)
1. **ESLint** - Fixes linting issues automatically
2. **Prettier** - Formats code

### For Other Files (*.json, *.css, *.html, *.md)
1. **Prettier** - Formats files according to project standards

## Setup Instructions

The pre-commit hooks are automatically set up when you run:

```bash
pnpm install
```

This triggers the `prepare` script which initializes Husky.

## Manual Testing

To test what the pre-commit hook will do without actually committing:

```bash
# Run lint-staged manually
pnpm exec lint-staged

# Or use the npm script
pnpm pre-commit
```

## Bypassing Hooks (Emergency Use Only)

If you absolutely need to commit without running hooks (not recommended):

```bash
git commit --no-verify -m "Your message"
```

⚠️ **Warning**: Only use this in emergencies. Code that bypasses checks may break CI/CD pipelines.

## Troubleshooting

### Hook Not Running

If the pre-commit hook isn't running:

1. Ensure Husky is installed:
   ```bash
   pnpm install
   ```

2. Reinitialize Husky:
   ```bash
   rm -rf .husky
   pnpm exec husky init
   pnpm prepare
   ```

### Hook Running Too Slowly

The hooks are optimized to run only on staged files. If they're still slow:

1. Check if you have many staged files:
   ```bash
   git status
   ```

2. Consider staging files in smaller batches

3. The TypeScript check runs on the entire project for safety. If this is too slow, you can comment it out in `.lintstagedrc.js`, but ensure CI catches type errors.

### ESLint or Prettier Conflicts

If you encounter formatting conflicts:

1. Run format and lint fix on the entire codebase:
   ```bash
   pnpm format
   pnpm lint:fix
   ```

2. Commit these changes separately before your feature changes

## Configuration Files

- **`.husky/pre-commit`** - The actual git hook that runs lint-staged
- **`.husky/post-merge`** - Automatically installs dependencies when pnpm-lock.yaml changes
- **`.lintstagedrc.js`** - Configuration for what commands to run on which files
- **`.eslintrc.config.js`** - ESLint rules (already configured)
- **`.prettierrc`** - Prettier formatting rules (already configured)

## Performance Optimization

The pre-commit hooks are designed to be fast:

- **Incremental Checks**: Only staged files are checked (except TypeScript compilation)
- **Parallel Processing**: Multiple files are processed in batches
- **Auto-fixing**: Issues are fixed automatically where possible
- **Type Checking**: Uses TypeScript's incremental compilation for speed

Expected execution time: **5-15 seconds** for typical commits

## Additional Hooks

### Post-Merge Hook

Automatically runs `pnpm install` when `pnpm-lock.yaml` changes after a git pull or merge. This ensures your dependencies are always up to date.

## Integration with CI/CD

The same checks that run in pre-commit hooks should also run in CI/CD pipelines. This provides a safety net if hooks are bypassed. The pre-commit hooks help catch issues early, reducing CI/CD failures and saving GitHub Actions minutes.

## Benefits

1. **Consistent Code Style**: All code follows the same formatting rules
2. **Early Error Detection**: Type errors and linting issues caught before commit
3. **Faster PR Reviews**: No time wasted on style issues
4. **Reduced CI Failures**: Issues caught locally instead of in CI
5. **Better Developer Experience**: Auto-fixing reduces manual work

## Team Workflow

1. Make your changes
2. Stage files: `git add .`
3. Commit: `git commit -m "your message"`
4. Pre-commit hooks run automatically
5. If hooks pass, commit succeeds
6. If hooks fail, fix the issues and try again

The hooks are designed to be helpful, not hindrance. They catch real issues while auto-fixing minor problems.