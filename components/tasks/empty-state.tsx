import { ThemedText } from '@/components/themed-text';
import type { StatusFilter } from '@/types/task';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

interface EmptyStateProps {
  statusFilter: StatusFilter;
  hasAnyTasks: boolean;
}

/**
 * Empty state component shown when no tasks match the filter
 */
function EmptyStateComponent({ statusFilter, hasAnyTasks }: EmptyStateProps) {
  const getEmptyMessage = () => {
    if (!hasAnyTasks) {
      return {
        title: 'No Tasks',
        subtitle: 'Tap the button to create your first task'
      };
    }
    
    const statusLabel = statusFilter === 'all' 
      ? '' 
      : statusFilter.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' ';
    
    return {
      title: `No ${statusLabel}Tasks`,
      subtitle: 'Try selecting a different filter'
    };
  };

  const { title, subtitle } = getEmptyMessage();

  return (
    <View style={styles.emptyState}>
      <ThemedText style={styles.emptyText}>{title}</ThemedText>
      <ThemedText style={styles.emptySubtext}>{subtitle}</ThemedText>
    </View>
  );
}

export const EmptyState = memo(EmptyStateComponent);

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    opacity: 0.4,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.3,
  },
});

