import React, { memo } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Check, SignalHigh, SignalLow, SignalMedium } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getPriorityColor } from '@/utils/task-helpers';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
}

/**
 * Individual task card component
 */
function TaskCardComponent({ task, onDelete, onView }: TaskCardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const colorScheme = useColorScheme();
  
  /**
   * Render status indicator circle based on task status
   */
  const renderStatusCircle = () => {
    switch (task.status) {
      case 'todo':
        return <View style={styles.statusCircleTodo} />;
      
      case 'in progress':
        return (
          <View style={styles.statusCircleInProgress}>
            <View style={[styles.statusCircleHalfFilled, { backgroundColor }]} />
          </View>
        );
      
      case 'done':
        return (
          <View style={styles.statusCircleDone}>
            <Check 
              size={12} 
              color={colorScheme === 'dark' ? '#151718' : '#fff'} 
              strokeWidth={3}
            />
          </View>
        );
      
      default:
        return <View style={styles.statusCircleTodo} />;
    }
  };

  return (
    <ThemedView style={styles.taskCard}>
      <View style={styles.taskHeader}>
        {/* Status indicator (visual only) */}
        <View style={styles.statusCircleContainer}>
          {renderStatusCircle()}
        </View>
        
        {/* Task title - tappable to view details */}
        <TouchableOpacity
          style={styles.taskContent}
          onPress={() => onView(task)}
          activeOpacity={0.7}
        >
          <ThemedText
            style={styles.taskTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {task.title}
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Priority indicator */}
      <View style={styles.taskActions}>
        {(() => {
          const PriorityIcon = task.priority === 'low' 
            ? SignalLow 
            : task.priority === 'medium' 
            ? SignalMedium 
            : SignalHigh;
          const priorityColor = getPriorityColor(task.priority);
          
          return (
            <View style={styles.priorityIconContainer}>
              <PriorityIcon size={18} color={priorityColor} />
            </View>
          );
        })()}
      </View>
    </ThemedView>
  );
}

export const TaskCard = memo(TaskCardComponent);

const styles = StyleSheet.create({
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  taskHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCircleContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircleTodo: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    backgroundColor: 'transparent',
  },
  statusCircleInProgress: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fbbf24',
    backgroundColor: '#fbbf24',
    overflow: 'hidden',
    position: 'relative',
  },
  statusCircleHalfFilled: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
  },
  statusCircleDone: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
    paddingVertical: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityIconContainer: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

