/**
 * Hook for accessing theme-aware colors throughout the application
 * 
 * This hook provides a convenient way to get colors that automatically
 * adapt to the current theme (light or dark mode).
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Get a color value that adapts to the current theme
 * 
 * @param props - Optional override colors for light and dark modes
 * @param colorName - The color key from the theme Colors object
 * @returns The appropriate color value based on the current theme
 * 
 * @example
 * ```tsx
 * // Get the default background color for current theme
 * const backgroundColor = useThemeColor({}, 'background');
 * 
 * // Override with custom colors
 * const customColor = useThemeColor(
 *   { light: '#fff', dark: '#000' },
 *   'background'
 * );
 * ```
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  // Use prop override if provided, otherwise use theme color
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
