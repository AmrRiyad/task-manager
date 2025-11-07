import React, { memo } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SignalHigh, SignalLow, SignalMedium } from 'lucide-react-native';
import { ToastViewport } from '@tamagui/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPriorityColor, getStatusColor, getStatusLabel } from '@/utils/task-helpers';
import type { Task, TaskFormData } from '@/types/task';

interface TaskModalProps {
  visible: boolean;
  editingTask: Task | null;
  formData: TaskFormData;
  setFormData: (data: TaskFormData) => void;
  onClose: () => void;
  onSave: () => void;
  backgroundColor: string;
  textColor: string;
  tintColor: string;
}

/**
 * Toast viewport component positioned inside modal
 */
function ModalToastViewport() {
  const { bottom } = useSafeAreaInsets();
  return (
    <ToastViewport
      bottom={bottom + 20}
      left={0}
      right={0}
      alignItems="center"
      zIndex={10001}
      pointerEvents="box-none"
      position="absolute"
    />
  );
}

/**
 * Task creation/editing modal component
 */
function TaskModalComponent({
  visible,
  editingTask,
  formData,
  setFormData,
  onClose,
  onSave,
  backgroundColor,
  textColor,
  tintColor,
}: TaskModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ModalToastViewport />
        <ThemedView style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <ThemedText type="subtitle">
              {editingTask ? 'Edit Task' : 'New Task'}
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Modal Form */}
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Title</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: '#ddd' }]}
                placeholder="Enter task title"
                placeholderTextColor="#999"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Description</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea, { color: textColor, borderColor: '#ddd' }]}
                placeholder="Enter task description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
            </View>

            {/* Priority Selector */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Priority</ThemedText>
              <View style={styles.priorityButtons}>
                {(['low', 'medium', 'high'] as const).map((priority) => {
                  const priorityColor = getPriorityColor(priority);
                  const isSelected = formData.priority === priority;
                  const PriorityIcon = priority === 'low' ? SignalLow : priority === 'medium' ? SignalMedium : SignalHigh;
                  
                  return (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        {
                          borderColor: isSelected ? priorityColor : '#ddd',
                          borderWidth: isSelected ? 3 : 1,
                          backgroundColor: backgroundColor,
                        }
                      ]}
                      onPress={() => setFormData({ ...formData, priority })}
                    >
                      <PriorityIcon
                        size={24}
                        color={isSelected ? priorityColor : textColor}
                        strokeWidth={isSelected ? 2.5 : 2}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Status Selector */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Status</ThemedText>
              <View style={styles.statusButtons}>
                {(['todo', 'in progress', 'done'] as const).map((status) => {
                  const statusColor = getStatusColor(status);
                  const isSelected = formData.status === status;
                  
                  return (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        {
                          borderColor: isSelected ? statusColor : '#ddd',
                          borderWidth: isSelected ? 3 : 1,
                          backgroundColor: backgroundColor,
                        }
                      ]}
                      onPress={() => setFormData({ ...formData, status })}
                    >
                      <ThemedText
                        style={[
                          styles.statusText,
                          { 
                            color: isSelected ? statusColor : textColor,
                            fontWeight: isSelected ? '800' : '500',
                          }
                        ]}
                      >
                        {getStatusLabel(status)}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: tintColor }]}
                onPress={onSave}
              >
                <ThemedText 
                  style={styles.saveButtonText}
                  lightColor="#fff"
                  darkColor="#000"
                >
                  {editingTask ? 'Update' : 'Create'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}

export const TaskModal = memo(TaskModalComponent);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: '300',
    opacity: 0.6,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

