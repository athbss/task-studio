import { useQuery } from '@tanstack/react-query';
import {
   fetchTags,
   fetchTasksByTag,
   fetchCurrentTag,
   fetchState,
   fetchConfig,
} from '@/lib/api/taskmaster';

// Query keys
export const taskmasterKeys = {
   all: ['taskmaster'] as const,
   tags: () => [...taskmasterKeys.all, 'tags'] as const,
   currentTag: () => [...taskmasterKeys.all, 'currentTag'] as const,
   tasksByTag: (tag: string) => [...taskmasterKeys.all, 'tasks', tag] as const,
   state: () => [...taskmasterKeys.all, 'state'] as const,
   config: () => [...taskmasterKeys.all, 'config'] as const,
};

// Hook to fetch all tags
export function useTags() {
   return useQuery({
      queryKey: taskmasterKeys.tags(),
      queryFn: async () => {
         const result = await fetchTags();
         if (!result.success) {
            throw new Error(result.error || 'Failed to fetch tags');
         }
         return result.data;
      },
   });
}

// Hook to fetch current tag context
export function useCurrentTag() {
   return useQuery({
      queryKey: taskmasterKeys.currentTag(),
      queryFn: async () => {
         const result = await fetchCurrentTag();
         if (!result.success) {
            throw new Error(result.error || 'Failed to fetch current tag');
         }
         return result.data;
      },
   });
}

// Hook to fetch tasks by tag
export function useTasksByTag(tagName: string) {
   return useQuery({
      queryKey: taskmasterKeys.tasksByTag(tagName),
      queryFn: async () => {
         const result = await fetchTasksByTag(tagName);
         if (!result.success) {
            throw new Error(result.error || 'Failed to fetch tasks');
         }
         return result.data;
      },
      enabled: !!tagName,
   });
}

// Hook to fetch state
export function useTaskmasterState() {
   return useQuery({
      queryKey: taskmasterKeys.state(),
      queryFn: async () => {
         const result = await fetchState();
         if (!result.success) {
            throw new Error(result.error || 'Failed to fetch state');
         }
         return result.data;
      },
   });
}

// Combined hook for current tag with its tasks
export function useCurrentTagWithTasks() {
   const { data: currentTagData, isLoading: isLoadingTag, error: tagError } = useCurrentTag();
   const currentTag = currentTagData?.currentTag || 'master';

   const {
      data: tasksData,
      isLoading: isLoadingTasks,
      error: tasksError,
   } = useTasksByTag(currentTag);

   return {
      currentTag,
      tasks: tasksData?.tasks || [],
      metadata: tasksData?.metadata,
      isLoading: isLoadingTag || isLoadingTasks,
      error: tagError || tasksError,
   };
}

// Hook to get filtered tasks
export function useFilteredTasks(filters: {
   status?: string[];
   priority?: string[];
   assignee?: string[];
   labels?: string[];
   search?: string;
}) {
   const { tasks } = useCurrentTagWithTasks();

   let filtered = [...tasks];

   // Filter by status
   if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((task) => filters.status!.includes(task.status));
   }

   // Filter by priority
   if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((task) => filters.priority!.includes(task.priority));
   }

   // Filter by assignee
   if (filters.assignee && filters.assignee.length > 0) {
      filtered = filtered.filter((task) => {
         if (filters.assignee!.includes('unassigned')) {
            return !task.assignee;
         }
         return task.assignee && filters.assignee!.includes(task.assignee);
      });
   }

   // Filter by labels
   if (filters.labels && filters.labels.length > 0) {
      filtered = filtered.filter((task) =>
         task.labels?.some((label: string) => filters.labels!.includes(label))
      );
   }

   // Search filter
   if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
         (task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower) ||
            task.details?.toLowerCase().includes(searchLower) ||
            task.id.toString().includes(searchLower)
      );
   }

   return filtered;
}

// Hook to fetch config
export function useConfig() {
   return useQuery({
      queryKey: taskmasterKeys.config(),
      queryFn: async () => {
         const result = await fetchConfig();
         if (!result.success) {
            throw new Error(result.error || 'Failed to fetch config');
         }
         return result.data;
      },
   });
}
