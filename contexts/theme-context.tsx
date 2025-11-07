import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

/**
 * Context for managing app-wide theme preferences
 */
interface ThemeContextType {
  themeMode: ThemeMode;
  effectiveTheme: EffectiveTheme;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isSystemMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// AsyncStorage key for persisting theme preference
const THEME_STORAGE_KEY = '@task_manager_theme_mode';

/**
 * ThemeProvider component that manages theme state and persistence
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * Calculate the effective theme based on user preference and system theme
   */
  const effectiveTheme: EffectiveTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  /**
   * Load saved theme preference from AsyncStorage on mount
   */
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
          setThemeModeState(stored as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadThemePreference();
  }, []);

  /**
   * Update theme mode and persist to AsyncStorage
   */
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
      // Still update state even if storage fails to maintain UX
      setThemeModeState(mode);
    }
  }, []);

  const value: ThemeContextType = useMemo(
    () => ({
    themeMode,
    effectiveTheme,
    setThemeMode,
    isSystemMode: themeMode === 'system',
    }),
    [themeMode, effectiveTheme, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Custom hook to access theme context
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
