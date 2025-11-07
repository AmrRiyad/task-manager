/**
 * Theme color definitions for light and dark modes
 * These colors provide a consistent visual experience across the app
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

/**
 * Color palette for the application
 * Each color is defined for both light and dark themes
 */
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
} as const;
