'use client';

import { useCurrentTagWithTasks } from '@/hooks/use-taskmaster-queries';
import { TaskmasterTask } from '@/types/taskmaster';
import { Status, ToDoIcon, InProgressIcon, CompletedIcon, PausedIcon } from '@/mock-data/status';
import { Priority } from '@/mock-data/priorities';
import { User } from '@/mock-data/users';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { useFilterStore } from '@/store/filter-store';
import { FC, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupIssues } from './group-issues';
import { IssueLine } from './issue-line';
import { CustomDragLayer } from './issue-grid';
import { cn } from '@/lib/utils';
import { Issue } from '@/mock-data/issues';

// Convert Taskmaster task to Issue format for compatibility
function taskToIssue(task: TaskmasterTask): Issue {
   const statusMap = {
      'pending': { name: 'To Do', color: '#6B7280', icon: ToDoIcon },
      'in_progress': { name: 'In Progress', color: '#3B82F6', icon: InProgressIcon },
      'in-progress': { name: 'In Progress', color: '#3B82F6', icon: InProgressIcon }, // Also handle hyphenated version
      'done': { name: 'Done', color: '#10B981', icon: CompletedIcon },
      'cancelled': { name: 'Cancelled', color: '#EF4444', icon: PausedIcon },
   };

   const statusInfo = statusMap[task.status as keyof typeof statusMap] || statusMap.pending; // Default to pending if not found

   return {
      id: task.id.toString(),
      identifier: `T-${task.id}`,
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
      project: undefined,
      createdAt: new Date().toISOString(),
      cycleId: '1',
      rank: task.id.toString(),
   };
}

// Taskmaster status definitions
const taskmasterStatuses: Status[] = [
   { id: 'pending', name: 'To Do', color: '#6B7280', icon: ToDoIcon },
   { id: 'in_progress', name: 'In Progress', color: '#3B82F6', icon: InProgressIcon },
   { id: 'in-progress', name: 'In Progress', color: '#3B82F6', icon: InProgressIcon },
   { id: 'done', name: 'Done', color: '#10B981', icon: CompletedIcon },
   { id: 'cancelled', name: 'Cancelled', color: '#EF4444', icon: PausedIcon },
];

export default function AllIssues() {
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();
   const { hasActiveFilters } = useFilterStore();
   const { tasks, isLoading, error } = useCurrentTagWithTasks();

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeGrid = viewType === 'grid';
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
      <div className={cn('w-full h-full', isViewTypeGrid && 'overflow-x-auto')}>
         {isSearching ? (
            <SearchIssuesView tasks={tasks} />
         ) : isFiltering ? (
            <FilteredIssuesView isViewTypeGrid={isViewTypeGrid} tasks={tasks} />
         ) : (
            <GroupIssuesListView isViewTypeGrid={isViewTypeGrid} tasks={tasks} />
         )}
      </div>
   );
}

const SearchIssuesView: FC<{ tasks: TaskmasterTask[] }> = ({ tasks }) => {
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
                              <IssueLine key={issue.id} issue={issue} layoutId={false} />
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
   isViewTypeGrid: boolean;
   tasks: TaskmasterTask[];
}> = ({ isViewTypeGrid = false, tasks }) => {
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

      taskmasterStatuses.forEach((statusItem) => {
         result[statusItem.id] = filteredIssues.filter(
            (issue) => issue.status.id === statusItem.id
         );
      });

      return result;
   }, [filteredIssues]);

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {taskmasterStatuses.map((statusItem) => (
               <GroupIssues
                  key={statusItem.id}
                  status={statusItem}
                  issues={filteredIssuesByStatus[statusItem.id] || []}
                  count={filteredIssuesByStatus[statusItem.id]?.length || 0}
               />
            ))}
         </div>
      </DndProvider>
   );
};

const GroupIssuesListView: FC<{
   isViewTypeGrid: boolean;
   tasks: TaskmasterTask[];
}> = ({ isViewTypeGrid = false, tasks }) => {
   // Convert tasks to issues and group by status
   const issuesByStatus = useMemo(() => {
      const issues = tasks.map(taskToIssue);
      const result: Record<string, Issue[]> = {};

      taskmasterStatuses.forEach((statusItem) => {
         result[statusItem.id] = issues.filter((issue) => issue.status.id === statusItem.id);
      });

      return result;
   }, [tasks]);

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {taskmasterStatuses.map((statusItem) => (
               <GroupIssues
                  key={statusItem.id}
                  status={statusItem}
                  issues={issuesByStatus[statusItem.id] || []}
                  count={issuesByStatus[statusItem.id]?.length || 0}
               />
            ))}
         </div>
      </DndProvider>
   );
};
