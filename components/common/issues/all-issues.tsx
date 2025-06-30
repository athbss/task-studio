'use client';

import { useCurrentTagWithTasks, useTasksByTag } from '@/hooks/use-taskmaster-queries';
import { useAllTasks } from '@/hooks/use-all-tasks';
import { TaskmasterTask } from '@/types/taskmaster';
import { createTagFromData } from '@/mock-data/tags';
import { useQueryState } from 'nuqs';
import { Priority } from '@/mock-data/priorities';
import { TASKMASTER_STATUSES, TASKMASTER_STATUS_MAP } from '@/lib/taskmaster-constants';
import { User } from '@/mock-data/users';
import { useSearchStore } from '@/store/search-store';
import { useFilterStore } from '@/store/filter-store';
import { FC, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupIssues } from './group-issues';
import { IssueWithSubtasks } from './issue-with-subtasks';
import { CustomDragLayer } from './issue-grid';
import { cn } from '@/lib/utils';
import { Issue } from '@/mock-data/issues';

// Generate tag prefix from tag name
function getTagPrefix(tagName: string): string {
   // Split by hyphens or spaces
   const words = tagName.split(/[-\s]+/);

   if (words.length > 1) {
      // Use first letter of each word
      return words.map((word) => word.charAt(0).toUpperCase()).join('');
   } else {
      // Single word: use first 2 letters
      return tagName.substring(0, 2).toUpperCase();
   }
}

// Convert Taskmaster task to Issue format for compatibility
function taskToIssue(task: TaskmasterTask & { tagName?: string }): Issue {
   const statusInfo =
      TASKMASTER_STATUS_MAP[task.status as keyof typeof TASKMASTER_STATUS_MAP] ||
      TASKMASTER_STATUS_MAP.pending; // Default to pending if not found

   return {
      id: task.tagName ? `${task.tagName}-${task.id}` : task.id.toString(),
      identifier:
         task.tagName && task.tagName !== 'master'
            ? `${getTagPrefix(task.tagName)}-${task.id}`
            : task.id.toString(),
      title: task.title,
      description: task.description,
      status: {
         id: task.status === 'in-progress' ? 'in_progress' : task.status, // Normalize to underscore version
         name: statusInfo.name,
         color: statusInfo.color,
         icon: statusInfo.icon,
      },
      priority: {
         id: task.priority,
         name: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
      } as Priority,
      assignee: task.assignee
         ? ({
              id: task.assignee,
              name: task.assignee,
              email: `${task.assignee}@example.com`,
           } as User)
         : null,
      labels:
         task.labels?.map((label) => ({
            id: label,
            name: label,
            color: '#8B5CF6',
         })) || [],
      tag: task.tagName ? createTagFromData(task.tagName, 0, undefined, 0) : undefined,
      createdAt: new Date().toISOString(),
      cycleId: '1',
      rank: task.id.toString(),
      subtasks: task.subtasks, // Pass through subtasks
   };
}

export default function AllIssues({
   showAllTags = false,
   tagName,
}: {
   showAllTags?: boolean;
   tagName?: string;
}) {
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { hasActiveFilters } = useFilterStore();
   const [viewType] = useQueryState('view', {
      defaultValue: 'list',
      parse: (value) => (value === 'board' || value === 'list' ? value : 'list'),
      history: 'push',
   });
   const [active] = useQueryState('active', {
      defaultValue: null,
      parse: (value) => (value === 'true' ? true : null),
      history: 'push',
   });
   const [issueFilter] = useQueryState('filter', {
      defaultValue: 'all',
      parse: (value) => (value === 'all' || value === 'active' ? value : 'all'),
      history: 'push',
   });

   // Use different hooks based on what we want to show
   const currentTagData = useCurrentTagWithTasks();
   const allTagsData = useAllTasks();
   const specificTagData = useTasksByTag(tagName || '');

   let isLoading: boolean;
   let error: any;
   let tasks: TaskmasterTask[];

   if (active) {
      // Show current tag when active=true
      isLoading = currentTagData.isLoading;
      error = currentTagData.error;
      const currentTag = currentTagData.currentTag;
      // Add tagName to each task for proper identifier generation
      tasks = currentTagData.tasks.map((task) => ({ ...task, tagName: currentTag }));
   } else if (showAllTags) {
      // Show all tags
      isLoading = allTagsData.isLoading;
      error = allTagsData.error;
      tasks = allTagsData.data?.allTasks || [];
   } else if (tagName) {
      // Show specific tag
      isLoading = specificTagData.isLoading;
      error = specificTagData.error;
      // Add tagName to each task for proper identifier generation
      tasks = (specificTagData.data?.tasks || []).map((task) => ({ ...task, tagName }));
   } else {
      // Show current tag
      isLoading = currentTagData.isLoading;
      error = currentTagData.error;
      const currentTag = currentTagData.currentTag;
      // Add tagName to each task for proper identifier generation
      tasks = currentTagData.tasks.map((task) => ({ ...task, tagName: currentTag }));
   }

   // Apply issue filter
   if (issueFilter === 'active') {
      tasks = tasks.filter((task) => task.status === 'in-progress' || task.status === 'pending');
   }

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeBoard = viewType === 'board';
   const isFiltering = hasActiveFilters();

   if (isLoading) {
      return <div className="w-full h-full flex items-center justify-center">Loading tasks...</div>;
   }

   if (error) {
      return (
         <div className="w-full h-full flex items-center justify-center text-red-500">
            Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
         </div>
      );
   }

   return (
      <div className={cn('w-full h-full', isViewTypeBoard && 'overflow-x-auto')}>
         {isSearching ? (
            <SearchIssuesView tasks={tasks} showAllTags={showAllTags} />
         ) : isFiltering ? (
            <FilteredIssuesView
               isViewTypeBoard={isViewTypeBoard}
               tasks={tasks}
               showAllTags={showAllTags}
            />
         ) : (
            <GroupIssuesListView
               isViewTypeBoard={isViewTypeBoard}
               tasks={tasks}
               showAllTags={showAllTags}
            />
         )}
      </div>
   );
}

const SearchIssuesView: FC<{ tasks: TaskmasterTask[]; showAllTags?: boolean }> = ({
   tasks,
   showAllTags,
}) => {
   const { searchQuery } = useSearchStore();

   const searchResults = useMemo(() => {
      const query = searchQuery.toLowerCase();
      return tasks.filter(
         (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.id.toString().includes(query)
      );
   }, [tasks, searchQuery]);

   const issues = searchResults.map(taskToIssue);

   return (
      <div className="px-6 mb-6">
         <div className="w-full">
            {searchQuery.trim() !== '' && (
               <div>
                  {issues.length > 0 ? (
                     <div className="border rounded-md mt-4">
                        <div className="py-2 px-4 border-b bg-muted/50">
                           <h3 className="text-sm font-medium">Results ({issues.length})</h3>
                        </div>
                        <div className="divide-y">
                           {issues.map((issue) => (
                              <IssueWithSubtasks
                                 key={issue.id}
                                 issue={issue}
                                 layoutId={false}
                                 showTagBadge={showAllTags}
                              />
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="text-center py-8 text-muted-foreground">
                        No results found for &quot;{searchQuery}&quot;
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
};

const FilteredIssuesView: FC<{
   isViewTypeBoard: boolean;
   tasks: TaskmasterTask[];
   showAllTags?: boolean;
}> = ({ isViewTypeBoard = false, tasks, showAllTags }) => {
   const { filters } = useFilterStore();

   // Apply filters to tasks
   const filteredTasks = useMemo(() => {
      let filtered = [...tasks];

      // Filter by status
      if (filters.status && filters.status.length > 0) {
         filtered = filtered.filter((task) => {
            // Normalize status for comparison
            const normalizedStatus = task.status === 'in-progress' ? 'in_progress' : task.status;
            return filters.status.includes(normalizedStatus);
         });
      }

      // Filter by priority
      if (filters.priority && filters.priority.length > 0) {
         filtered = filtered.filter((task) => filters.priority.includes(task.priority));
      }

      // Filter by assignee
      if (filters.assignee && filters.assignee.length > 0) {
         filtered = filtered.filter((task) => {
            if (filters.assignee.includes('unassigned')) {
               return !task.assignee;
            }
            return task.assignee && filters.assignee.includes(task.assignee);
         });
      }

      // Filter by labels
      if (filters.labels && filters.labels.length > 0) {
         filtered = filtered.filter((task) =>
            task.labels?.some((label: string) => filters.labels.includes(label))
         );
      }

      return filtered;
   }, [tasks, filters]);

   // Convert tasks to issues
   const filteredIssues = filteredTasks.map(taskToIssue);

   // Group filtered issues by status
   const filteredIssuesByStatus = useMemo(() => {
      const result: Record<string, Issue[]> = {};

      TASKMASTER_STATUSES.forEach((statusItem) => {
         result[statusItem.id] = filteredIssues.filter(
            (issue) => issue.status.id === statusItem.id
         );
      });

      return result;
   }, [filteredIssues]);

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeBoard && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {TASKMASTER_STATUSES.map((statusItem) => (
               <GroupIssues
                  key={statusItem.id}
                  status={statusItem}
                  issues={filteredIssuesByStatus[statusItem.id] || []}
                  count={filteredIssuesByStatus[statusItem.id]?.length || 0}
                  showTagBadge={showAllTags}
               />
            ))}
         </div>
      </DndProvider>
   );
};

const GroupIssuesListView: FC<{
   isViewTypeBoard: boolean;
   tasks: TaskmasterTask[];
   showAllTags?: boolean;
}> = ({ isViewTypeBoard = false, tasks, showAllTags }) => {
   // Convert tasks to issues and group by status
   const issuesByStatus = useMemo(() => {
      const issues = tasks.map(taskToIssue);
      const result: Record<string, Issue[]> = {};

      TASKMASTER_STATUSES.forEach((statusItem) => {
         result[statusItem.id] = issues.filter((issue) => issue.status.id === statusItem.id);
      });

      return result;
   }, [tasks]);

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeBoard && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {TASKMASTER_STATUSES.map((statusItem) => (
               <GroupIssues
                  key={statusItem.id}
                  status={statusItem}
                  issues={issuesByStatus[statusItem.id] || []}
                  count={issuesByStatus[statusItem.id]?.length || 0}
                  showTagBadge={showAllTags}
               />
            ))}
         </div>
      </DndProvider>
   );
};
