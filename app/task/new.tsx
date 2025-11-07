import { FormInput } from '@/components/forms/form-input';
import { PrioritySelector } from '@/components/tasks/priority-selector';
import { StatusSelector } from '@/components/tasks/status-selector';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SaveButton } from '@/components/ui/save-button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { TaskFormData } from '@/types/task';
import { getInputBackgroundColor, sharedStyles } from '@/utils/shared-styles';
import { executeOnCreate } from '@/utils/task-callbacks';
import { validateTaskForm } from '@/utils/validation-helpers';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

/**
 * New Task Creation Screen
 */
export default function NewTaskScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBackgroundColor = getInputBackgroundColor(colorScheme);

  // Form state
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
  });

  // Error state
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [showErrors, setShowErrors] = useState(false);

  /**
   * Handle save - pass data back via callback
   */
  const handleSave = () => {
    // Validate form data
    const validation = validateTaskForm(formData.title, formData.description);
    
    if (!validation.isValid) {
      // Set errors and show them
      const newErrors: { title?: string; description?: string } = {};
      
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      } else if (formData.title.trim().length < 3) {
        newErrors.title = 'Title must be at least 3 characters';
      }
      
      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description must be less than 500 characters';
      }
      
      setErrors(newErrors);
      setShowErrors(true);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setShowErrors(false);

    // Execute create callback
    executeOnCreate({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      completed: formData.status === 'done',
    });

    // Navigate back to preserve the parent screen's state
    router.back();
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    router.back();
  };

  return (
    <ThemedView style={[sharedStyles.container, { backgroundColor }]}>
      {/* Header with Back Button Only */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleCancel}
          style={[
            styles.backButton,
            { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
          ]}
        >
          <ArrowLeft size={24} color={textColor} />
        </TouchableOpacity>
        
        <ThemedText type="title" style={styles.headerTitle}>
          New Task
        </ThemedText>
        
        {/* Empty spacer for alignment */}
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={sharedStyles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={sharedStyles.content}>
          {/* Title Input */}
          <FormInput
            label="Title"
            value={formData.title}
            onChangeText={(text) => {
              setFormData({ ...formData, title: text });
              // Clear error when user starts typing
              if (showErrors && errors.title) {
                setErrors({ ...errors, title: undefined });
              }
            }}
            placeholder="Enter task title"
            required
            autoFocus
            textColor={textColor}
            inputBackgroundColor={inputBackgroundColor}
            error={errors.title}
            showError={showErrors}
          />

          {/* Description Input */}
          <FormInput
            label="Description"
            value={formData.description}
            onChangeText={(text) => {
              setFormData({ ...formData, description: text });
              // Clear error when user starts typing
              if (showErrors && errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            placeholder="Enter task description (optional)"
            multiline
            numberOfLines={4}
            textColor={textColor}
            inputBackgroundColor={inputBackgroundColor}
            error={errors.description}
            showError={showErrors}
          />

          {/* Status Selection */}
          <StatusSelector
            value={formData.status}
            onChange={(status) => setFormData({ ...formData, status })}
            textColor={textColor}
          />

          {/* Priority Selection */}
          <PrioritySelector
            value={formData.priority}
            onChange={(priority) => setFormData({ ...formData, priority })}
            textColor={textColor}
          />
        </View>
      </ScrollView>

      {/* Sticky Save Button at Bottom */}
      <SaveButton onPress={handleSave} label="Save Task" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for sticky button
  },
});