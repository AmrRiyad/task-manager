/**
 * Date formatting utility functions
 */

/**
 * Format a date string or Date object to a human-readable format
 * @param dateString - Date string or Date object
 * @returns Formatted date string or 'Unknown date' if invalid
 */
export function formatDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown date';
  }
}
