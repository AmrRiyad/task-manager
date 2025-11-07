import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Save } from 'lucide-react-native';
import React, { memo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SaveButtonProps {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}

/**
 * Reusable save button component with icon
 * Sticky at the bottom of the screen
 */
export const SaveButton = memo<SaveButtonProps>(({ 
  onPress, 
  label = 'Save Task',
  disabled = false 
}) => {
  const colorScheme = useColorScheme();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  // Better button colors for dark mode
  const buttonBackgroundColor = colorScheme === 'dark' ? tintColor : tintColor;
  const iconColor = colorScheme === 'dark' ? '#000' : '#fff';

  // Calculate safe bottom padding
  const safeBottomPadding = Math.max(insets.bottom, 20);

  return (
    <View style={[styles.container, { backgroundColor, paddingBottom: safeBottomPadding }]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.button,
          { backgroundColor: buttonBackgroundColor },
          disabled && styles.buttonDisabled,
        ]}
        android_ripple={{ 
          color: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)' 
        }}
      >
        <Save size={20} color={iconColor} strokeWidth={2.5} />
        <ThemedText 
          style={styles.buttonText}
          lightColor="#fff"
          darkColor="#000"
        >
          {label}
        </ThemedText>
      </Pressable>
    </View>
  );
});

SaveButton.displayName = 'SaveButton';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    // paddingBottom is set dynamically using safe area insets
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

