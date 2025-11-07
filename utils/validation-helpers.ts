/**
 * Validation utility functions for forms and data
 */

/**
 * Validate if a string is not empty after trimming whitespace
 * @param value - String to validate
 * @returns True if string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate task title
 * @param title - Task title to validate
 * @returns Object with isValid flag and optional error message
 */
export function validateTaskTitle(title: string): { isValid: boolean; error?: string } {
  if (!isNotEmpty(title)) {
    return { isValid: false, error: 'Task title is required' };
  }
  
  if (title.trim().length > 200) {
    return { isValid: false, error: 'Task title must be less than 200 characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate task description
 * @param description - Task description to validate
 * @returns Object with isValid flag and optional error message
 */
export function validateTaskDescription(description: string): { isValid: boolean; error?: string } {
  if (description.trim().length > 2000) {
    return { isValid: false, error: 'Task description must be less than 2000 characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate entire task form data
 * @param title - Task title
 * @param description - Task description
 * @returns Object with isValid flag and optional error message
 */
export function validateTaskForm(
  title: string,
  description: string
): { isValid: boolean; error?: string } {
  const titleValidation = validateTaskTitle(title);
  if (!titleValidation.isValid) {
    return titleValidation;
  }
  
  const descriptionValidation = validateTaskDescription(description);
  if (!descriptionValidation.isValid) {
    return descriptionValidation;
  }
  
  return { isValid: true };
}

