import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getIconButtonBackground, sharedStyles } from '@/utils/shared-styles';
import { ArrowLeft, Save } from 'lucide-react-native';
import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface FormHeaderProps {
  title: string;
  onBack: () => void;
  onSave: () => void;
  textColor: string;
  tintColor: string;
}

/**
 * Reusable form header component with back and save buttons
 */
export const FormHeader = memo<FormHeaderProps>(({
  title,
  onBack,
  onSave,
  textColor,
  tintColor,
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={sharedStyles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={[
          sharedStyles.iconButton,
          { backgroundColor: getIconButtonBackground(colorScheme) }
        ]}
      >
        <ArrowLeft size={24} color={textColor} />
      </TouchableOpacity>
      
      <ThemedText type="title" style={sharedStyles.headerTitle}>
        {title}
      </ThemedText>
      
      <TouchableOpacity
        onPress={onSave}
        style={[
          sharedStyles.iconButton,
          { backgroundColor: getIconButtonBackground(colorScheme, tintColor) }
        ]}
      >
        <Save size={24} color={tintColor} />
      </TouchableOpacity>
    </View>
  );
});

FormHeader.displayName = 'FormHeader';

