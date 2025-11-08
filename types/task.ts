/**
 * Task type definitions and interfaces
 */

/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Task status states
 */
export type TaskStatus = 'todo' | 'in progress' | 'done';

/**
 * Task status filter options
 */
export type StatusFilter = 'all' | 'todo' | 'in progress' | 'done';

/**
 * Task sort options
 */
export type SortOption = 'priority' | 'newest' | 'oldest';

/**
 * Task interface representing a single task item
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  completed: boolean;
  createdAt: Date;
}

/**
 * Form data structure for creating/editing tasks
 */
export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}

/**
 * Grouped tasks by status
 */
export type GroupedTasks = Record<string, Task[]>;

