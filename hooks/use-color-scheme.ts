import { useColorScheme as useRNColorScheme } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

/**
 * Hook that returns the effective color scheme based on user's theme preference.
 * 
 * This hook respects the user's choice of 'light', 'dark', or 'system' mode.
 * When 'system' is selected, it uses the device's color scheme.
 * 
 * @returns 'light' | 'dark' - The effective theme to use throughout the app
 * 
 * @example
 * ```tsx
 * const colorScheme = useColorScheme();
 * const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
 * ```
 */
export function useColorScheme(): 'light' | 'dark' {
  try {
    const { effectiveTheme } = useTheme();
    return effectiveTheme;
  } catch {
    // Fallback to system if theme context is not available
    // This can happen during SSR or if used outside ThemeProvider
    const systemScheme = useRNColorScheme();
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
}
