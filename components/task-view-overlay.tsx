'use client';

import * as React from 'react';
import { useTaskViewStore } from '@/store/task-view-store';
import { useTaskViewUrl } from '@/hooks/use-task-view-url';
import { TaskDetailsView } from '@/components/task-details-view';
import { useAllTasks, TaskWithTag } from '@/hooks/use-all-tasks';
import { useCurrentTagWithTasks } from '@/hooks/use-taskmaster-queries';
import { parseTaskId, findTaskByPath, extractTaskId } from '@/lib/task-id-utils';

export function TaskViewOverlay() {
   const { isOpen, selectedTaskId } = useTaskViewStore();

   // Initialize URL sync
   useTaskViewUrl();

   // Get tasks from both sources to find the selected task
   const allTasksData = useAllTasks();
   const currentTagData = useCurrentTagWithTasks();

   // Find the task by ID
   const task = React.useMemo(() => {
      if (!selectedTaskId) return null;

      // Extract just the numeric ID (might include dots for subtasks)
      const numericTaskId = extractTaskId(selectedTaskId);
      const { taskId, subtaskPath } = parseTaskId(numericTaskId);

      if (isNaN(taskId)) return null;

      // Check if selectedTaskId includes tag name
      let tagName: string | null = null;
      if (selectedTaskId.includes('-') && !selectedTaskId.match(/^[\d.]+$/)) {
         const idParts = selectedTaskId.split('-');
         tagName = idParts.slice(0, -1).join('-');
      }

      // First try to find in all tasks (which includes tag information)
      const allTasks = allTasksData.data?.allTasks || [];
      let foundTask: TaskWithTag | undefined = allTasks.find((t) => {
         if (tagName && t.tagName) {
            return t.id === taskId && t.tagName === tagName;
         }
         return t.id === taskId;
      });

      // If not found, try current tag tasks (without tagName)
      if (!foundTask) {
         const currentTask = currentTagData.tasks.find((t) => t.id === taskId);
         if (currentTask) {
            // Add tagName from current tag for consistency
            foundTask = { ...currentTask, tagName: currentTagData.currentTag } as TaskWithTag;
         }
      }

      // If we found the main task and need a subtask, traverse the subtask tree
      if (foundTask && subtaskPath.length > 0) {
         const subtask = findTaskByPath(foundTask, subtaskPath);
         if (subtask) {
            // Return the subtask with parent task info and proper tagName
            const enhancedSubtask = {
               ...subtask,
               tagName: foundTask.tagName || currentTagData.currentTag,
               parentId: foundTask.id,
               _isSubtask: true,
            } as TaskWithTag;

            return enhancedSubtask;
         }
      }

      return foundTask;
   }, [selectedTaskId, allTasksData.data, currentTagData.tasks, currentTagData.currentTag]);

   if (!isOpen) return null;

   return (
      <div className="absolute inset-0 z-50 bg-background flex flex-col">
         {task ? (
            <TaskDetailsView task={task} />
         ) : selectedTaskId ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
               <div className="text-center">
                  <p className="text-lg font-medium">Task not found</p>
                  <p className="text-sm mt-2">The requested task could not be found.</p>
               </div>
            </div>
         ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
               <div className="text-center">
                  <p className="text-lg font-medium">No task selected</p>
                  <p className="text-sm mt-2">Please select a task to view its details.</p>
               </div>
            </div>
         )}
      </div>
   );
}
