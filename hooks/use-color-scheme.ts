import { useColorScheme as useRNColorScheme } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

/**
 * Hook that returns the effective color scheme based on user's theme preference.
 * Respects user's choice of 'light', 'dark', or 'system' mode.
 * 
 * @returns 'light' | 'dark' - The effective theme to use
 */
export function useColorScheme(): 'light' | 'dark' {
  try {
    const { effectiveTheme } = useTheme();
    return effectiveTheme;
  } catch {
    // Fallback to system if theme context is not available (during SSR or initial render)
    const systemScheme = useRNColorScheme();
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
}
