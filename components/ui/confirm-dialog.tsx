import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AlertTriangle } from 'lucide-react-native';
import React, { memo } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * Reusable confirmation dialog component
 * Shows a modal dialog with confirm and cancel actions
 */
export const ConfirmDialog = memo<ConfirmDialogProps>(({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  // Get variant colors
  const variantColors = {
    danger: '#ef4444',
    warning: '#f59e0b',
    info: tintColor,
  };

  const variantColor = variantColors[variant];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable 
          style={styles.overlayTouchable} 
          onPress={onCancel}
        />
        
        <ThemedView 
          style={[
            styles.dialog,
            { backgroundColor },
            Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              },
              android: {
                elevation: 12,
              },
            }),
          ]}
        >
          {/* Icon */}
          <View 
            style={[
              styles.iconContainer,
              { backgroundColor: `${variantColor}15` }
            ]}
          >
            <AlertTriangle size={28} color={variantColor} strokeWidth={2} />
          </View>

          {/* Title */}
          <ThemedText style={styles.title}>
            {title}
          </ThemedText>

          {/* Message */}
          <ThemedText style={styles.message}>
            {message}
          </ThemedText>

          {/* Actions */}
          <View style={styles.actions}>
            {/* Cancel Button */}
            <Pressable
              onPress={onCancel}
              style={[
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: colorScheme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
              android_ripple={{ 
                color: colorScheme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(0, 0, 0, 0.1)' 
              }}
            >
              <ThemedText style={styles.cancelButtonText}>
                {cancelText}
              </ThemedText>
            </Pressable>

            {/* Confirm Button */}
            <Pressable
              onPress={onConfirm}
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: variantColor },
              ]}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
            >
              <ThemedText 
                style={styles.confirmButtonText}
                lightColor="#fff"
                darkColor="#fff"
              >
                {confirmText}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
});

ConfirmDialog.displayName = 'ConfirmDialog';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    // Background set dynamically
  },
  confirmButton: {
    // Background set dynamically
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

