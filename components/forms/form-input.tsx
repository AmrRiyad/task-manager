import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getBorderColor, getPlaceholderColor, sharedStyles } from '@/utils/shared-styles';
import React, { memo } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface FormInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  required?: boolean;
  textColor: string;
  inputBackgroundColor?: string;
  error?: string;
  showError?: boolean;
}

/**
 * Reusable form input component with label
 */
export const FormInput = memo<FormInputProps>(({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines,
  required = false,
  textColor,
  inputBackgroundColor,
  error,
  showError = false,
  ...rest
}) => {
  const colorScheme = useColorScheme();
  const borderColor = getBorderColor(colorScheme);
  const placeholderColor = getPlaceholderColor(colorScheme);
  
  const hasError = showError && error;

  return (
    <View style={sharedStyles.section}>
      <ThemedText style={[sharedStyles.label, hasError && styles.labelError]}>
        {label}{required && ' *'}
      </ThemedText>
      <TextInput
        style={[
          sharedStyles.input,
          multiline && styles.multiline,
          {
            color: textColor,
            borderColor: hasError ? '#ef4444' : borderColor,
            backgroundColor: hasError 
              ? (colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)')
              : inputBackgroundColor,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...rest}
      />
      {hasError && (
        <ThemedText style={styles.errorText}>
          {error}
        </ThemedText>
      )}
    </View>
  );
});

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  multiline: {
    minHeight: 120,
    paddingTop: 16,
  },
  labelError: {
    color: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 6,
  },
});

