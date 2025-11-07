import { ThemedText } from '@/components/themed-text';
import type { GroupedTasks, Task, TaskStatus } from '@/types/task';
import { getStatusLabel } from '@/utils/task-helpers';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TaskCard } from './task-card';

interface GroupedTaskListProps {
  groupedTasks: GroupedTasks;
  statusOrder: TaskStatus[];
  dividerColor: string;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
}

/**
 * Grouped task list component for showing tasks organized by status
 */
function GroupedTaskListComponent({ 
  groupedTasks, 
  statusOrder, 
  dividerColor,
  onDelete,
  onView 
}: GroupedTaskListProps) {
  // Track if we've rendered the first group with tasks
  let isFirstGroup = true;

  return (
    <View style={styles.section}>
      {statusOrder.map((status) => {
        const statusTasks = groupedTasks[status] || [];
        if (statusTasks.length === 0) return null;

        // Check if this is the first group being rendered
        const showDivider = !isFirstGroup;
        isFirstGroup = false;

        return (
          <View key={status} style={styles.statusGroup}>
            {/* Divider between groups (not before first group with tasks) */}
            {showDivider && (
              <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            )}

            <ThemedText style={styles.statusGroupTitle}>
              {getStatusLabel(status)}
            </ThemedText>

            {statusTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

export const GroupedTaskList = memo(GroupedTaskListComponent);

const styles = StyleSheet.create({
  section: {
    marginBottom: 0,
  },
  statusGroup: {
    marginBottom: 10,
  },
  statusGroupTitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.6,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
});

