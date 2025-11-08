import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/ui/toast';
import { Colors } from '@/constants/theme';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Root layout content component with theme integration
 */
function RootLayoutContent() {
  const colorScheme = useColorScheme();
  
  // Get background color from theme
  const backgroundColor = Colors[colorScheme].background;

  // Custom navigation themes with our color scheme
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      card: Colors.dark.background,
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      card: Colors.light.background,
    },
  };

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
      <View style={{ flex: 1, backgroundColor }}>
        <ToastProvider>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="task/new" 
              options={{ 
                headerShown: false, 
                presentation: 'card',
                contentStyle: { backgroundColor },
                animation: 'slide_from_right',
              }} 
            />
            <Stack.Screen 
              name="task/[id]" 
              options={{ 
                headerShown: false, 
                presentation: 'card',
                contentStyle: { backgroundColor },
                animation: 'slide_from_right',
              }} 
            />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ToastProvider>
      </View>
    </NavigationThemeProvider>
  );
}

/**
 * Root layout component with providers
 * Note: Task state is managed locally in components, not globally
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
          <RootLayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
