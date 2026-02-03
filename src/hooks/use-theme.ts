import { useColorScheme } from 'react-native';
import { useUIStore } from '../stores/uiStore';
import { Theme } from '../theme/types';
import light from '../theme/light';
import dark from '../theme/dark';

/**
 * Hook to get the current theme based on user preference and system settings.
 *
 * Priority:
 * 1. User override (if set to 'light' or 'dark')
 * 2. System preference
 * 3. Default to dark (gaming app default)
 */
export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const override = useUIStore((s) => s.theme);

  // Resolve theme mode
  const mode =
    override === 'system' || !override
      ? systemScheme || 'dark' // Default to dark for gaming aesthetic
      : override;

  return mode === 'light' ? light : dark;
}

/**
 * Hook to get the current theme mode setting
 */
export function useThemeMode() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  return { theme, setTheme };
}
