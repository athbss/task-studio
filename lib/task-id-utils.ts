/**
 * Utilities for handling task IDs
 */

/**
 * Extract numeric task ID from an Issue ID
 * Examples:
 * - "user-auth-1" -> "1"
 * - "mobile-app-1.2" -> "1.2"
 * - "1" -> "1"
 * - "1.2.3" -> "1.2.3"
 */
export function extractTaskId(issueId: string): string {
   // If it's already a numeric ID (with possible dots for subtasks), return as-is
   if (/^[\d.]+$/.test(issueId)) {
      return issueId;
   }

   // Otherwise, extract the numeric part after the last hyphen
   const parts = issueId.split('-');
   return parts[parts.length - 1] || issueId;
}

/**
 * Parse a task ID into main task ID and subtask path
 * Examples:
 * - "1" -> { taskId: 1, subtaskPath: [] }
 * - "1.2" -> { taskId: 1, subtaskPath: [2] }
 * - "1.2.3" -> { taskId: 1, subtaskPath: [2, 3] }
 */
export function parseTaskId(taskId: string): { taskId: number; subtaskPath: number[] } {
   const parts = taskId.split('.').map(Number);
   return {
      taskId: parts[0] || 0,
      subtaskPath: parts.slice(1),
   };
}

/**
 * Find a task or subtask by ID in a task tree
 */
export function findTaskByPath(
   task: { id: number; subtasks?: any[] },
   subtaskPath: number[]
): any | null {
   if (subtaskPath.length === 0) {
      return task;
   }

   if (!task.subtasks) {
      return null;
   }

   const [nextId, ...remainingPath] = subtaskPath;
   const subtask = task.subtasks.find((st) => st.id === nextId);

   if (!subtask) {
      return null;
   }

   return findTaskByPath(subtask, remainingPath);
}
