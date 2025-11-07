import type { GroupedTasks, StatusFilter, Task } from '@/types/task';
import { useCallback, useMemo, useState } from 'react';

/**
 * Custom hook for managing task state and operations
 * Provides CRUD operations and filtering logic
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  /**
   * Add a new task to the list
   */
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  /**
   * Update an existing task with partial updates
   */
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
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
  }, []);

  /**
   * Delete a task by ID
   */
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  /**
   * Toggle task status through the cycle: todo -> in progress -> done -> todo
   */
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          let newStatus: Task['status'];
          if (task.status === 'todo') {
            newStatus = 'in progress';
          } else if (task.status === 'in progress') {
            newStatus = 'done';
          } else {
            newStatus = 'todo';
          }
          
          return {
            ...task,
            status: newStatus,
            completed: newStatus === 'done',
          };
        }
        return task;
      })
    );
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

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getFilteredTasks,
    getGroupedTasks,
  };
}
