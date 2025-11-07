import { EmptyState } from '@/components/tasks/empty-state';
import { GroupedTaskList } from '@/components/tasks/grouped-task-list';
import { TaskList } from '@/components/tasks/task-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CustomTabs } from '@/components/ui/tabs';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTasks } from '@/hooks/use-tasks';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { StatusFilter, Task, TaskStatus } from '@/types/task';
import { setTaskCallbacks } from '@/utils/task-callbacks';
import { useToastController } from '@tamagui/toast';
import { useRouter } from 'expo-router';
import { SquarePen } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

/**
 * Home screen displaying the task list with filtering and CRUD operations
 * Uses local component state for managing tasks
 */
export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const dividerColor = colorScheme === 'dark' ? '#2a2a2a' : '#e5e5e5';
  const toast = useToastController();
  const mutedTextColor = colorScheme === 'dark' ? '#a0a0a0' : '#8e8e93';
  // Task management hook
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask,
    getFilteredTasks,
    getGroupedTasks,
  } = useTasks();

  // UI state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  // Delete confirmation dialog state
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  /**
   * Navigate to new task creation screen
   */
  const handleCreateTask = useCallback(() => {
    setTaskCallbacks({
      onCreate: (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        addTask(taskData);
        toast.show('Task created successfully', {
          customData: { type: 'success' },
        });
      },
    });

    router.push('/task/new');
  }, [router, addTask, toast]);

  /**
   * Show delete confirmation dialog
   */
  const handleDeleteTask = useCallback((id: string) => {
    setTaskToDelete(id);
    setDeleteDialogVisible(true);
  }, []);

  /**
   * Delete task after confirmation
   */
  const handleDeleteConfirm = useCallback(() => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      toast.show('Task deleted successfully', {
        customData: { type: 'success' },
      });
    }
    setDeleteDialogVisible(false);
    setTaskToDelete(null);
  }, [taskToDelete, deleteTask, toast]);

  /**
   * Cancel delete operation
   */
  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogVisible(false);
    setTaskToDelete(null);
  }, []);

  /**
   * Navigate to task details screen with callback functions
   */
  const handleViewTask = useCallback((task: Task) => {
    setTaskCallbacks({
      onUpdate: (id: string, updates: Partial<Task>) => {
        updateTask(id, updates);
        toast.show('Task updated successfully', {
          customData: { type: 'success' },
        });
      },
      onDelete: (id: string) => {
        deleteTask(id);
        toast.show('Task deleted successfully', {
          customData: { type: 'success' },
        });
      },
    });

    router.push({
      pathname: '/task/[id]',
      params: {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        createdAt: task.createdAt.toISOString(),
      },
    });
  }, [router, updateTask, deleteTask, toast]);

  // Get filtered tasks based on current filter
  const filteredTasks = useMemo(
    () => getFilteredTasks(statusFilter),
    [getFilteredTasks, statusFilter]
  );

  // Get grouped tasks for 'all' view
  const groupedTasks = useMemo(
    () => statusFilter === 'all' ? getGroupedTasks : null,
    [statusFilter, getGroupedTasks]
  );

  // Status order for display
  const statusOrder: TaskStatus[] = useMemo(
    () => ['todo', 'in progress', 'done'],
    []
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        {/* Title and Add Button */}
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.headerTitle}>My Tasks</ThemedText>
          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : tintColor + '20',
                borderRadius: 12,
              }
            ]}
            onPress={handleCreateTask}
            activeOpacity={0.7}
          >
            <SquarePen size={24} color={tintColor} />
          </TouchableOpacity>
        </View>
        
        {/* Status Filter Tabs */}
        <View style={styles.filterContainer}>

        <CustomTabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          tabs={[
            { value: 'all', label: 'All Tasks' },
            { value: 'todo', label: 'Todo' },
            { value: 'in progress', label: 'In Progress' },
            { value: 'done', label: 'Done' },
          ]}
          variant="underline"
          activeColor={tintColor}
          inactiveColor={mutedTextColor}
          underlineColor={tintColor}
        />
        </View>
      </ThemedView>

      {/* Task List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={filteredTasks.length === 0 ? styles.scrollContentEmpty : styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.length === 0 ? (
          <EmptyState statusFilter={statusFilter} hasAnyTasks={tasks.length > 0} />
        ) : statusFilter === 'all' && groupedTasks ? (
            <GroupedTaskList
              groupedTasks={groupedTasks}
              statusOrder={statusOrder}
              dividerColor={dividerColor}
              onDelete={handleDeleteTask}
              onView={handleViewTask}
            />
        ) : (
            <TaskList
              tasks={filteredTasks}
              onDelete={handleDeleteTask}
              onView={handleViewTask}
            />
        )}
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    includeFontPadding: false,
  },
  headerButton: {
    padding: 8,
  },
  filterContainer: {
    marginTop: 16,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  scrollContentEmpty: {
    flexGrow: 1,
    padding: 20,
  },
});
