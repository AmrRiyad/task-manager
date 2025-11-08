import type { GroupedTasks, StatusFilter, Task } from '@/types/task';
import { useCallback, useMemo, useState } from 'react';

/**
 * Custom hook for managing task state and operations
 * Provides CRUD operations and filtering logic with loading states
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Loading states for each CRUD operation
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Track which task is being updated/deleted (useful for showing loading on specific items)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  /**
   * Add a new task to the list
   */
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    setIsAdding(true);
    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      };
      setTasks((prev) => [newTask, ...prev]);
      
      // If you need to make API calls, add them here:
      // await saveTaskToAPI(newTask);
      
      return newTask;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    } finally {
      setIsAdding(false);
    }
  }, []);

  /**
   * Update an existing task with partial updates
   */
  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setUpdatingTaskId(id);
    setIsUpdating(true);
    try {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            const updatedTask = { ...task, ...updates };
            if (updates.status !== undefined) {
              updatedTask.completed = updates.status === 'done';
            }
            return updatedTask;
          }
          return task;
        })
      );
      
      // If you need to make API calls, add them here:
      // await updateTaskInAPI(id, updates);
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    } finally {
      setIsUpdating(false);
      setUpdatingTaskId(null);
    }
  }, []);

  /**
   * Delete a task by ID
   */
  const deleteTask = useCallback(async (id: string) => {
    setDeletingTaskId(id);
    setIsDeleting(true);
    try {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      
      // If you need to make API calls, add them here:
      // await deleteTaskFromAPI(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    } finally {
      setIsDeleting(false);
      setDeletingTaskId(null);
    }
  }, []);

  /**
   * Get filtered tasks based on status filter
   */
  const getFilteredTasks = useCallback((filter: StatusFilter): Task[] => {
    if (filter === 'all') {
      return tasks;
    }
    return tasks.filter(t => t.status === filter);
  }, [tasks]);

  /**
   * Get tasks grouped by status
   */
  const getGroupedTasks = useMemo((): GroupedTasks => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as GroupedTasks);
  }, [tasks]);

  // Computed: overall loading state
  const isLoading = isAdding || isUpdating || isDeleting;

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getFilteredTasks,
    getGroupedTasks,
    // Loading states
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    updatingTaskId,
    deletingTaskId,
  };
}
