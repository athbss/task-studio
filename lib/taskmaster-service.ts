import { TaskmasterTask } from '@/types/taskmaster';

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
