import { TaskmasterTask } from '@/types/taskmaster';

export interface SubtaskCount {
   completed: number;
   total: number;
}

/**
 * Recursively count subtasks and their completion status
 */
export function countSubtasks(task: TaskmasterTask): SubtaskCount {
   if (!task.subtasks || task.subtasks.length === 0) {
      return { completed: 0, total: 0 };
   }

   let completed = 0;
   let total = 0;

   function countRecursive(subtasks: TaskmasterTask[]) {
      for (const subtask of subtasks) {
         total += 1;
         if (subtask.status === 'done') {
            completed += 1;
         }
         // Count nested subtasks recursively
         if (subtask.subtasks && subtask.subtasks.length > 0) {
            countRecursive(subtask.subtasks);
         }
      }
   }

   countRecursive(task.subtasks);
   return { completed, total };
}
