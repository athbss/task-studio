import { TaskmasterTask, TaskStatus, TaskPriority } from '@/types/taskmaster';

/**
 * Parses a task ID string into its components
 * Examples: "1" -> [1], "1.2" -> [1, 2], "1.2.3" -> [1, 2, 3]
 */
export function parseTaskId(taskId: string): number[] {
   return taskId
      .split('.')
      .map((id) => parseInt(id, 10))
      .filter((n) => !isNaN(n));
}

/**
 * Finds a task by ID within a specific tag context
 * Supports nested subtask IDs like '1.2.1'
 */
export function findTaskInTag(tasks: TaskmasterTask[], taskId: string): TaskmasterTask | null {
   const idParts = parseTaskId(taskId);

   if (idParts.length === 0) {
      return null;
   }

   // Find the main task
   const mainTaskId = idParts[0];
   const mainTask = tasks.find((task) => task.id === mainTaskId);

   if (!mainTask) {
      return null;
   }

   // If it's just a main task ID, return it
   if (idParts.length === 1) {
      return mainTask;
   }

   // Navigate through subtasks
   let currentTask: TaskmasterTask = mainTask;

   for (let i = 1; i < idParts.length; i++) {
      const subtaskId = idParts[i];

      if (!currentTask.subtasks || currentTask.subtasks.length === 0) {
         return null;
      }

      const subtask = currentTask.subtasks.find((st) => st.id === subtaskId);

      if (!subtask) {
         return null;
      }

      currentTask = subtask;
   }

   return currentTask;
}

/**
 * Updates a task in place while preserving the structure
 * Returns true if the task was found and updated, false otherwise
 */
export function updateTaskInPlace(
   tasks: TaskmasterTask[],
   taskId: string,
   updates: Partial<TaskmasterTask>
): boolean {
   const idParts = parseTaskId(taskId);

   if (idParts.length === 0) {
      return false;
   }

   // Find the main task
   const mainTaskId = idParts[0];
   const mainTaskIndex = tasks.findIndex((task) => task.id === mainTaskId);

   if (mainTaskIndex === -1) {
      return false;
   }

   // If it's just a main task ID, update it directly
   if (idParts.length === 1) {
      tasks[mainTaskIndex] = {
         ...tasks[mainTaskIndex],
         ...updates,
         // Preserve these fields that shouldn't be overwritten
         id: tasks[mainTaskIndex].id,
         subtasks: tasks[mainTaskIndex].subtasks,
      };
      return true;
   }

   // Navigate through subtasks
   let currentTaskArray: TaskmasterTask[] = tasks;
   let currentTaskIndex = mainTaskIndex;

   for (let i = 1; i < idParts.length; i++) {
      const subtaskId = idParts[i];
      const parentTask = currentTaskArray[currentTaskIndex];

      if (!parentTask.subtasks) {
         return false;
      }

      const subtaskIndex = parentTask.subtasks.findIndex((st) => st.id === subtaskId);

      if (subtaskIndex === -1) {
         return false;
      }

      // If this is the last ID part, update the subtask
      if (i === idParts.length - 1) {
         parentTask.subtasks[subtaskIndex] = {
            ...parentTask.subtasks[subtaskIndex],
            ...updates,
            // Preserve these fields that shouldn't be overwritten
            id: parentTask.subtasks[subtaskIndex].id,
            subtasks: parentTask.subtasks[subtaskIndex].subtasks,
         };
         return true;
      }

      // Otherwise, continue navigating
      currentTaskArray = parentTask.subtasks;
      currentTaskIndex = subtaskIndex;
   }

   return false;
}

/**
 * Creates a deep copy of tasks array to avoid mutations
 */
export function cloneTasks(tasks: TaskmasterTask[]): TaskmasterTask[] {
   return JSON.parse(JSON.stringify(tasks));
}

/**
 * Flattens a task tree into a single array with proper ID formatting
 * Useful for searching or listing all tasks
 */
export function flattenTasks(
   tasks: TaskmasterTask[],
   parentId: string = ''
): Array<{ task: TaskmasterTask; fullId: string }> {
   const result: Array<{ task: TaskmasterTask; fullId: string }> = [];

   tasks.forEach((task) => {
      const fullId = parentId ? `${parentId}.${task.id}` : `${task.id}`;
      result.push({ task, fullId });

      if (task.subtasks && task.subtasks.length > 0) {
         result.push(...flattenTasks(task.subtasks, fullId));
      }
   });

   return result;
}

/**
 * Checks if a task has incomplete subtasks
 * Returns true if any subtask is not in 'done' or 'cancelled' status
 */
export function hasIncompleteSubtasks(task: TaskmasterTask): boolean {
   if (!task.subtasks || task.subtasks.length === 0) {
      return false;
   }

   return task.subtasks.some((subtask) => {
      // Check if this subtask is incomplete
      if (subtask.status !== 'done' && subtask.status !== 'cancelled') {
         return true;
      }
      // Recursively check if this subtask has incomplete subtasks
      return hasIncompleteSubtasks(subtask);
   });
}

/**
 * Validates a status transition
 * Returns an error message if invalid, null if valid
 */
export function validateStatusTransition(
   currentStatus: TaskStatus,
   newStatus: TaskStatus
): string | null {
   // Any status can transition to cancelled
   if (newStatus === 'cancelled') {
      return null;
   }

   // Standard flow: pending → in_progress → done
   const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      'pending': ['in_progress', 'in-progress', 'done'],
      'in_progress': ['done', 'pending'],
      'in-progress': ['done', 'pending'], // Handle both formats
      'done': ['pending', 'in_progress', 'in-progress'], // Allow reopening tasks
      'cancelled': ['pending'], // Allow reactivating cancelled tasks
   };

   const allowedTransitions = validTransitions[currentStatus];
   if (!allowedTransitions.includes(newStatus)) {
      return `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ')}`;
   }

   return null;
}

/**
 * Validates a priority value
 * Returns an error message if invalid, null if valid
 */
export function validatePriority(priority: unknown): string | null {
   const validPriorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

   if (typeof priority !== 'string' || !validPriorities.includes(priority as TaskPriority)) {
      return `Invalid priority value '${priority}'. Must be one of: ${validPriorities.join(', ')}`;
   }

   return null;
}

/**
 * Validates an assignee value
 * Returns an error message if invalid, null if valid
 */
export function validateAssignee(assignee: unknown): string | null {
   if (
      assignee !== undefined &&
      assignee !== null &&
      assignee !== '' &&
      typeof assignee !== 'string'
   ) {
      return `Invalid assignee value. Must be a string or empty`;
   }

   return null;
}

/**
 * Validates task update data
 * Returns an array of error messages, empty if all valid
 */
export function validateTaskUpdate(
   currentTask: TaskmasterTask,
   updates: Partial<TaskmasterTask>
): string[] {
   const errors: string[] = [];

   // Validate status transition
   if (updates.status && updates.status !== currentTask.status) {
      // Check for incomplete subtasks if trying to mark as done
      if (updates.status === 'done' && hasIncompleteSubtasks(currentTask)) {
         errors.push('Cannot mark task as done while subtasks are incomplete');
      }

      const statusError = validateStatusTransition(currentTask.status, updates.status);
      if (statusError) {
         errors.push(statusError);
      }
   }

   // Validate priority
   if (updates.priority !== undefined) {
      const priorityError = validatePriority(updates.priority);
      if (priorityError) {
         errors.push(priorityError);
      }
   }

   // Validate assignee
   if ('assignee' in updates) {
      const assigneeError = validateAssignee(updates.assignee);
      if (assigneeError) {
         errors.push(assigneeError);
      }
   }

   return errors;
}
