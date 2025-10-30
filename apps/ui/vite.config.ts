import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../dist/ui',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@quiz-app/shared-models/*': path.resolve(
        __dirname,
        '../../packages/shared-models/src',
      ),
      '@quiz-app/shared-types/*': path.resolve(
        __dirname,
        '../../packages/shared-types/src',
      ),
      '@quiz-app/shared-utils/*': path.resolve(
        __dirname,
        '../../packages/shared-utils/src',
      ),
    },
  },
});
