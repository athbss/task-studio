import { useQuery } from '@tanstack/react-query';
import { fetchTags, fetchTasksByTag } from '@/lib/api/taskmaster';
import { TaskmasterTask } from '@/types/taskmaster';
import { taskmasterKeys } from './use-taskmaster-queries';

// Extended task type that includes tag information
export interface TaskWithTag extends TaskmasterTask {
   tagName: string;
   tagMetadata?: {
      created?: string;
      updated?: string;
      description?: string;
   };
}

// Hook to fetch all tasks from all tags
export function useAllTasks() {
   return useQuery({
      queryKey: [...taskmasterKeys.all, 'allTasks'],
      queryFn: async () => {
         // First, fetch all tags
         const tagsResult = await fetchTags();
         if (!tagsResult.success) {
            throw new Error(tagsResult.error || 'Failed to fetch tags');
         }

         // Then, fetch tasks for each tag
         const allTasks: TaskWithTag[] = [];
         const tasksByTag: Record<string, TaskWithTag[]> = {};
         const metadataByTag: Record<string, any> = {};

         for (const tag of tagsResult.data || []) {
            const tasksResult = await fetchTasksByTag(tag.name);
            if (tasksResult.success && tasksResult.data?.tasks) {
               // Add tag information and metadata to each task
               const tasksWithTag = tasksResult.data.tasks.map((task) => ({
                  ...task,
                  tagName: tag.name, // Add tag name to task for reference
                  tagMetadata: tasksResult.data?.metadata, // Add tag metadata
               }));
               allTasks.push(...tasksWithTag);
               tasksByTag[tag.name] = tasksWithTag;
               metadataByTag[tag.name] = tasksResult.data?.metadata;
            }
         }

         return {
            allTasks,
            tasksByTag,
            tags: tagsResult.data || [],
            metadataByTag,
         };
      },
   });
}
