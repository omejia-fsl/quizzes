import { defineProject } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineProject({
  plugins: [react()],
  test: {
    name: 'ui',
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/__tests__/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
