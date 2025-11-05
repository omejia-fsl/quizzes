import { useThemeStore } from '../stores/themeStore.ts';

export function useTheme() {
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const initTheme = useThemeStore((state) => state.initTheme);

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
  };
}
