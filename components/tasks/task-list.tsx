import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TaskCard } from './task-card';
import type { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
}

/**
 * Simple task list component
 */
function TaskListComponent({ tasks, onDelete, onView }: TaskListProps) {
  return (
    <View style={styles.section}>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </View>
  );
}

export const TaskList = memo(TaskListComponent);

const styles = StyleSheet.create({
  section: {
    marginBottom: 0,
  },
});

