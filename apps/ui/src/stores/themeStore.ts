import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
}

interface ThemeActions {
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  initTheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const newIsDark = !get().isDark;
        set({ isDark: newIsDark });
        applyTheme(newIsDark);
      },

      setTheme: (isDark) => {
        set({ isDark });
        applyTheme(isDark);
      },

      initTheme: () => {
        const stored = localStorage.getItem('theme-storage');
        if (stored) {
          const { state } = JSON.parse(stored) as {
            state?: { isDark?: boolean };
          };
          const isDark = state?.isDark ?? false;
          applyTheme(isDark);
        } else {
          const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
          ).matches;
          set({ isDark: prefersDark });
          applyTheme(prefersDark);
        }
      },
    }),
    {
      name: 'theme-storage',
    },
  ),
);

function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
