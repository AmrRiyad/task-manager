import type { Task } from '@/types/task';

/**
 * Task callback management utilities
 * Handles global callback storage for task operations across screens
 */

export interface TaskCallbacks {
  onCreate?: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onDelete?: (id: string) => void;
}

/**
 * Set task callbacks in global storage
 * @param callbacks - Callback functions for task operations
 */
export function setTaskCallbacks(callbacks: TaskCallbacks): void {
  (global as any).__taskCallbacks = callbacks;
}

/**
 * Get task callbacks from global storage
 * @returns Task callbacks or null if not set
 */
export function getTaskCallbacks(): TaskCallbacks | null {
  return (global as any).__taskCallbacks || null;
}

/**
 * Clear task callbacks from global storage
 */
export function clearTaskCallbacks(): void {
  (global as any).__taskCallbacks = null;
}

/**
 * Execute onCreate callback if available
 * @param taskData - Task data to create
 * @returns True if callback was executed
 */
export function executeOnCreate(taskData: Omit<Task, 'id' | 'createdAt'>): boolean {
  const callbacks = getTaskCallbacks();
  if (callbacks?.onCreate) {
    callbacks.onCreate(taskData);
    return true;
  }
  return false;
}

/**
 * Execute onUpdate callback if available
 * @param id - Task ID to update
 * @param updates - Partial task data to update
 * @returns True if callback was executed
 */
export function executeOnUpdate(id: string, updates: Partial<Task>): boolean {
  const callbacks = getTaskCallbacks();
  if (callbacks?.onUpdate) {
    callbacks.onUpdate(id, updates);
    return true;
  }
  return false;
}

/**
 * Execute onDelete callback if available
 * @param id - Task ID to delete
 * @returns True if callback was executed
 */
export function executeOnDelete(id: string): boolean {
  const callbacks = getTaskCallbacks();
  if (callbacks?.onDelete) {
    callbacks.onDelete(id);
    return true;
  }
  return false;
}

