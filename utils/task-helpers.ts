/**
 * Task utility functions
 */

/**
 * Get color for task priority
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return '#ff6b6b';
    case 'medium': return '#ffa726';
    case 'low': return '#66bb6a';
    default: return '#999';
  }
}

/**
 * Get color for task status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'todo': return '#999';
    case 'in progress': return '#fbbf24';
    case 'done': return '#10b981';
    default: return '#999';
  }
}

/**
 * Get display label for task status
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'todo': return 'Todo';
    case 'in progress': return 'In Progress';
    case 'done': return 'Done';
    default: return status;
  }
}

/**
 * Get display label for task priority
 */
export function getPriorityLabel(priority: string): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

