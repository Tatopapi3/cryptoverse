import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>(() => ({
  isDark: false,
  toggle: () => {},
}));
