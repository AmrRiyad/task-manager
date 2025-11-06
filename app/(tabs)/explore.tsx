import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/contexts/theme-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ChevronRight, Monitor, Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Italian' | 'Portuguese' | 'Arabic' | 'Chinese' | 'Japanese';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { themeMode, setThemeMode, isSystemMode } = useTheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = colorScheme === 'dark' ? '#2a2a2a' : '#e5e5e5';
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');

  const handleThemeChange = async (mode: 'light' | 'dark' | 'system') => {
    await setThemeMode(mode);
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    // TODO: Implement language persistence and i18n
  };

  const ThemeOption = ({ mode, label, icon: Icon }: { mode: 'light' | 'dark' | 'system'; label: string; icon: any }) => {
    const isSelected = themeMode === mode;
    return (
      <TouchableOpacity
        style={[
          styles.themeOption,
          isSelected && { backgroundColor: tintColor + '20', borderColor: tintColor },
          { borderColor: borderColor }
        ]}
        onPress={() => handleThemeChange(mode)}
        activeOpacity={0.7}
      >
        <Icon size={24} color={isSelected ? tintColor : textColor} />
        <ThemedText style={[styles.themeOptionLabel, isSelected && { color: tintColor }]}>
          {label}
        </ThemedText>
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: tintColor }]}>
            <ThemedText style={styles.checkmarkText}>✓</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <ThemedView style={[styles.header, { borderBottomColor: borderColor }]}>
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
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: tintColor + '20' }]}>
              <Monitor size={18} color={tintColor} />
            </View>
            <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
          </View>
          
          <View style={styles.themeOptions}>
            <ThemeOption mode="light" label="Light" icon={Sun} />
            <ThemeOption mode="dark" label="Dark" icon={Moon} />
            <ThemeOption mode="system" label="System" icon={Monitor} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  themeOptionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  languageOptions: {
    gap: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  languageOptionText: {
    fontSize: 15,
    fontWeight: '400',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
