import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'shared-types',
    environment: 'node',
    include: [
      'src/**/__tests__/**/*.test.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
      '**/*.test.{ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
