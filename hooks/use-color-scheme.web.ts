import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

/**
 * Web-specific implementation of useColorScheme that supports static rendering
 * and client-side hydration.
 * 
 * This version handles the web-specific concern of server-side rendering (SSR)
 * where the theme context might not be available initially.
 * 
 * @returns 'light' | 'dark' - The effective theme to use
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);

  /**
   * Track when the component has hydrated on the client side
   */
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  try {
    const { effectiveTheme } = useTheme();
    // Only use theme context after hydration to avoid SSR mismatches
    if (hasHydrated) {
      return effectiveTheme;
    }
  } catch {
    // Fallback during SSR or if context is not available
  }

  // Use system preference during initial render and hydration
  const systemScheme = useRNColorScheme();
  return systemScheme === 'dark' ? 'dark' : 'light';
}
