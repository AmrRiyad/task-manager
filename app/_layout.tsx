import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';

import { AppToastProvider } from '@/components/ui/toast';
import { Colors } from '@/constants/theme';
import { TaskProvider } from '@/contexts/task-context';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import config from '@/tamagui.config';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { effectiveTheme } = useTheme();
  
  // Get background color from theme
  const backgroundColor = Colors[colorScheme].background;

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
    <TamaguiProvider 
      config={config} 
      defaultTheme={effectiveTheme === 'dark' ? 'dark' : 'light'}
      key={effectiveTheme}
    >
      <NavigationThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
        <View style={{ flex: 1, backgroundColor }}>
          <AppToastProvider>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor },
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen 
                name="task/[id]" 
                options={{ 
                  headerShown: false, 
                  presentation: 'card',
                  contentStyle: { backgroundColor },
                  animation: 'fade',
                }} 
              />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </AppToastProvider>
        </View>
      </NavigationThemeProvider>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TaskProvider>
          <RootLayoutContent />
        </TaskProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
