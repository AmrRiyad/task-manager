import { DropdownSelector } from '@/components/ui/dropdown-selector';
import type { ThemeMode } from '@/contexts/theme-context';
import { Monitor, Moon, Sun } from 'lucide-react-native';
import React, { memo, useMemo } from 'react';

interface ThemeSelectorProps {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  textColor: string;
}

/**
 * Get theme label for display
 */
function getThemeLabel(mode: ThemeMode): string {
  switch (mode) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    case 'system':
      return 'System';
    default:
      return 'System';
  }
}

/**
 * Get theme icon component
 */
function getThemeIcon(mode: ThemeMode) {
  switch (mode) {
    case 'light':
      return Sun;
    case 'dark':
      return Moon;
    case 'system':
      return Monitor;
    default:
      return Monitor;
  }
}

/**
 * Theme selector component for choosing app theme
 */
export const ThemeSelector = memo<ThemeSelectorProps>(({ value, onChange, textColor }) => {
  const themes: ThemeMode[] = ['light', 'dark', 'system'];

  const options = useMemo(
    () =>
      themes.map((theme) => ({
        value: theme,
        label: getThemeLabel(theme),
        icon: getThemeIcon(theme),
      })),
    []
  );

  const ThemeIcon = getThemeIcon(value);

  return (
    <DropdownSelector
      icon={<ThemeIcon size={20} color={textColor} />}
      label="Theme"
      value={value}
      options={options}
      onChange={(newValue) => onChange(newValue as ThemeMode)}
    />
  );
});

ThemeSelector.displayName = 'ThemeSelector';

