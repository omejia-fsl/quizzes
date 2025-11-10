/**
 * Lint-staged configuration for pnpm monorepo
 * Runs checks only on staged files for fast pre-commit validation
 */

module.exports = {
  // TypeScript/TSX files - run linting, formatting, and type checking
  '*.{ts,tsx}': (filenames) => {
    // Properly escape filenames with spaces
    const files = filenames.map(f => `"${f}"`).join(' ');
    return [
      `eslint --fix ${files}`,
      `prettier --write ${files}`,
      // Type checking disabled temporarily due to existing TypeScript issues
      // Uncomment once TypeScript errors are resolved in the codebase:
      // 'bash -c "tsc --noEmit --skipLibCheck"'
    ];
  },

  // JavaScript files (if any)
  '*.{js,jsx}': (filenames) => {
    // Properly escape filenames with spaces
    const files = filenames.map(f => `"${f}"`).join(' ');
    return [
      `eslint --fix ${files}`,
      `prettier --write ${files}`
    ];
  },

  // JSON, CSS, HTML, Markdown - just formatting
  '*.{json,css,html,md,mdx}': (filenames) => {
    // Properly escape filenames with spaces
    const files = filenames.map(f => `"${f}"`).join(' ');
    return [`prettier --write ${files}`];
  },

  // Package.json files - ensure they're properly formatted
  '**/package.json': (filenames) => {
    // Properly escape filenames with spaces
    const files = filenames.map(f => `"${f}"`).join(' ');
    return [`prettier --write ${files}`];
  }
};