import { StyleSheet, View, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Moon, Sun, Monitor, Globe, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Italian' | 'Portuguese' | 'Arabic' | 'Chinese' | 'Japanese';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = colorScheme === 'dark' ? '#2a2a2a' : '#e5e5e5';
  
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    // TODO: Implement theme persistence and actual theme switching
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    // TODO: Implement language persistence and i18n
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    value 
  }: { 
    icon: any; 
    title: string; 
    subtitle?: string; 
    onPress: () => void; 
    value?: string;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: borderColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: tintColor + '20' }]}>
          <Icon size={20} color={tintColor} />
        </View>
        <View style={styles.settingItemText}>
          <ThemedText style={styles.settingItemTitle}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={styles.settingItemSubtitle}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
      {value && (
        <ThemedText style={styles.settingItemValue}>{value}</ThemedText>
      )}
      <ChevronRight size={20} color={textColor} opacity={0.4} />
    </TouchableOpacity>
  );

  const ThemeOption = ({ mode, label, icon: Icon }: { mode: ThemeMode; label: string; icon: any }) => {
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

  const LanguageOption = ({ language }: { language: Language }) => {
    const isSelected = selectedLanguage === language;
    return (
      <TouchableOpacity
        style={[
          styles.languageOption,
          isSelected && { backgroundColor: tintColor + '20', borderColor: tintColor },
          { borderColor: borderColor }
        ]}
        onPress={() => handleLanguageChange(language)}
        activeOpacity={0.7}
      >
        <ThemedText style={[styles.languageOptionText, isSelected && { color: tintColor, fontWeight: '600' }]}>
          {language}
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

        {/* Language Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: tintColor + '20' }]}>
              <Globe size={18} color={tintColor} />
            </View>
            <ThemedText style={styles.sectionTitle}>Language</ThemedText>
          </View>
          
          <View style={styles.languageOptions}>
            {(['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Arabic', 'Chinese', 'Japanese'] as Language[]).map((lang) => (
              <LanguageOption key={lang} language={lang} />
            ))}
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  settingItemValue: {
    fontSize: 14,
    opacity: 0.7,
    marginRight: 8,
  },
});
