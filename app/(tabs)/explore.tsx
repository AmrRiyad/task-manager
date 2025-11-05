import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = colorScheme === 'dark' ? '#2a2a2a' : '#e5e5e5';
  const headerBg = colorScheme === 'dark' ? '#0a0a0a' : '#fafafa';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
        <ThemedText style={styles.headerTitle}>Projects</ThemedText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText style={styles.comingSoonIcon}>🚧</ThemedText>
        <ThemedText style={styles.comingSoonText}>Coming Soon</ThemedText>
        <ThemedText style={styles.comingSoonSubtext}>
          Projects view will be available in the next update
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 24,
    opacity: 0.3,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.5,
  },
  comingSoonSubtext: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.4,
  },
});