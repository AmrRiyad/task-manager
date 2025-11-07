import { Platform, StyleSheet } from 'react-native';

/**
 * Shared styles for task forms and screens
 * Promotes consistency and reduces duplication
 */

export const sharedStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Content styles
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  
  // Form input styles
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  
  // Button styles
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Date section styles
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  dateText: {
    fontSize: 14,
    opacity: 0.7,
  },
});

/**
 * Get dynamic background color for icon button based on theme
 * @param colorScheme - Current color scheme
 * @param tintColor - Optional tint color for light theme
 * @returns Background color string
 */
export function getIconButtonBackground(
  colorScheme: 'light' | 'dark',
  tintColor?: string
): string {
  if (colorScheme === 'dark') {
    return 'rgba(255, 255, 255, 0.1)';
  }
  return tintColor ? `${tintColor}20` : 'rgba(0, 0, 0, 0.05)';
}

/**
 * Get dynamic border color based on theme
 * @param colorScheme - Current color scheme
 * @returns Border color string
 */
export function getBorderColor(colorScheme: 'light' | 'dark'): string {
  return colorScheme === 'dark' ? '#333' : '#ddd';
}

/**
 * Get dynamic placeholder color based on theme
 * @param colorScheme - Current color scheme
 * @returns Placeholder text color string
 */
export function getPlaceholderColor(colorScheme: 'light' | 'dark'): string {
  return colorScheme === 'dark' ? '#666' : '#999';
}

/**
 * Get dynamic input background color based on theme
 * @param colorScheme - Current color scheme
 * @returns Input background color string
 */
export function getInputBackgroundColor(colorScheme: 'light' | 'dark'): string {
  return colorScheme === 'dark' ? '#1a1a1a' : '#f8f8f8';
}
