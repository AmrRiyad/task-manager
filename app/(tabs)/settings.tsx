import { ThemeSelector } from '@/components/settings/theme-selector';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/contexts/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

/**
 * Settings screen for app configuration
 */
export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { themeMode, setThemeMode } = useTheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  /**
   * Handle theme mode change
   */
  const handleThemeChange = async (mode: 'light' | 'dark' | 'system') => {
    await setThemeMode(mode);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
      </ThemedView>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section */}
        <View style={styles.section}>
          <ThemeSelector
            value={themeMode}
            onChange={handleThemeChange}
            textColor={textColor}
          />
        </View>
      </ScrollView>
    </View>
  );
}


/**
 * Styles
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
});
