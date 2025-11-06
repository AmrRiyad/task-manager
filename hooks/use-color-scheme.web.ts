import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

/**
 * Web-specific implementation that supports static rendering.
 * Re-calculates on the client side for web and uses theme context.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  try {
    const { effectiveTheme } = useTheme();
    if (hasHydrated) {
      return effectiveTheme;
    }
  } catch {
    // Fallback during SSR or if context not available
  }

  // Fallback to system preference during hydration
  const systemScheme = useRNColorScheme();
  return systemScheme === 'dark' ? 'dark' : 'light';
}
