/**
 * Formats a task ID based on the tag name
 * @param taskId - The numeric task ID
 * @param tagName - The tag name (optional)
 * @returns Formatted task ID (e.g., "#1" for master, "1" for other tags)
 */
export function formatTaskId(taskId: number | string, tagName?: string): string {
   const id = taskId.toString();
   return tagName === 'master' ? `#${id}` : id;
}

/**
 * Formats a subtask ID based on the tag name
 * @param parentId - The parent task ID
 * @param subtaskId - The subtask ID
 * @param tagName - The tag name (optional)
 * @returns Formatted subtask ID (e.g., "#1.1" for master, "1.1" for other tags)
 */
export function formatSubtaskId(
   parentId: number | string,
   subtaskId: number | string,
   tagName?: string
): string {
   const parent = parentId.toString();
   const subtask = subtaskId.toString();
   return tagName === 'master' ? `#${parent}.${subtask}` : `${parent}.${subtask}`;
}

/**
 * Formats a full task identifier with tag prefix
 * @param taskId - The numeric task ID
 * @param tagName - The tag name
 * @param tagPrefix - The tag prefix (e.g., "UA" for "user-auth")
 * @returns Formatted identifier (e.g., "#1" for master, "UA-1" for user-auth)
 */
export function formatTaskIdentifier(
   taskId: number | string,
   tagName?: string,
   tagPrefix?: string
): string {
   if (!tagName || tagName === 'master') {
      return formatTaskId(taskId, 'master');
   }
   return tagPrefix ? `${tagPrefix}-${taskId}` : taskId.toString();
}

/**
 * Formats a full subtask identifier with tag prefix
 * @param parentId - The parent task ID
 * @param subtaskId - The subtask ID
 * @param tagName - The tag name
 * @param tagPrefix - The tag prefix
 * @returns Formatted identifier (e.g., "#1.1" for master, "UA-1.1" for user-auth)
 */
export function formatSubtaskIdentifier(
   parentId: number | string,
   subtaskId: number | string,
   tagName?: string,
   tagPrefix?: string
): string {
   if (!tagName || tagName === 'master') {
      return formatSubtaskId(parentId, subtaskId, 'master');
   }
   return tagPrefix ? `${tagPrefix}-${parentId}.${subtaskId}` : `${parentId}.${subtaskId}`;
}

/**
 * Extracts the numeric task ID from a prefixed task ID
 * @param prefixedId - The prefixed task ID (e.g., "taskmaster-update-api-9", "#1", "UA-1")
 * @returns The numeric task ID as a string (e.g., "9", "1", "1")
 */
export function extractTaskId(prefixedId: string): string {
   // Remove leading # if present
   const withoutHash = prefixedId.startsWith('#') ? prefixedId.slice(1) : prefixedId;

   // Check if it contains a hyphen (tag prefix)
   const lastHyphenIndex = withoutHash.lastIndexOf('-');
   if (lastHyphenIndex !== -1) {
      // Return everything after the last hyphen
      return withoutHash.slice(lastHyphenIndex + 1);
   }

   // If no hyphen, return as is
   return withoutHash;
}
