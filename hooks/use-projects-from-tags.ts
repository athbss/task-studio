import { useTags } from './use-taskmaster-queries';
import { getProjectsFromTags, Project } from '@/mock-data/projects';

export function useProjectsFromTags(): {
   projects: Project[];
   isLoading: boolean;
   error: Error | null;
} {
   const { data: tagsData, isLoading, error } = useTags();

   // Convert tags to projects
   const projects = tagsData ? getProjectsFromTags(tagsData) : [];

   return {
      projects,
      isLoading,
      error: error as Error | null,
   };
}
