import { useThemeStore } from '../store/useThemeStore';
import { darkColors, lightColors, darkCategoryColors, lightCategoryColors } from '../constants/theme';

export function useTheme() {
  const isDark = useThemeStore((s) => s.isDark);
  const toggle = useThemeStore((s) => s.toggle);
  return {
    isDark,
    toggle,
    colors: isDark ? darkColors : lightColors,
    categoryColors: isDark ? darkCategoryColors : lightCategoryColors,
  };
}
