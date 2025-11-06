import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { router } from './routes/router.ts';
import { queryClient } from './api/queryClient.ts';
import { useThemeStore } from './stores/themeStore';
import { useAuthStore } from './stores/authStore';
import './index.css';

useThemeStore.getState().initTheme();
void useAuthStore.getState().checkAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-text)',
          },
        }}
      />
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  </StrictMode>,
);
