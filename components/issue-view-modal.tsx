'use client';

import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useIssueViewStore } from '@/store/issue-view-store';
import { TaskDetailsView } from '@/components/task-details-view';
import { useAllTasks, TaskWithTag } from '@/hooks/use-all-tasks';
import { useCurrentTagWithTasks } from '@/hooks/use-taskmaster-queries';

export function IssueViewModal() {
   const { isOpen, closeIssue, selectedIssueId } = useIssueViewStore();

   // Get tasks from both sources to find the selected task
   const allTasksData = useAllTasks();
   const currentTagData = useCurrentTagWithTasks();

   // Find the task by ID
   const task = React.useMemo(() => {
      if (!selectedIssueId) return null;

      // Extract the tag name and numeric ID from the issue ID (format: "tagname-id" or just "id")
      const idParts = selectedIssueId.split('-');
      let tagName: string | null = null;
      let numericId: number;

      if (idParts.length > 1) {
         // Format: "tagname-id"
         tagName = idParts.slice(0, -1).join('-');
         numericId = parseInt(idParts[idParts.length - 1]);
      } else {
         // Format: just "id"
         numericId = parseInt(idParts[0]);
      }

      if (isNaN(numericId)) return null;

      // First try to find in all tasks (which includes tag information)
      const allTasks = allTasksData.data?.allTasks || [];
      let foundTask: TaskWithTag | undefined = allTasks.find((t) => {
         if (tagName && t.tagName) {
            return t.id === numericId && t.tagName === tagName;
         }
         return t.id === numericId;
      });

      // If not found, try current tag tasks (without tagName)
      if (!foundTask) {
         const currentTask = currentTagData.tasks.find((t) => t.id === numericId);
         if (currentTask) {
            // Add tagName from current tag for consistency
            foundTask = { ...currentTask, tagName: currentTagData.currentTag } as TaskWithTag;
         }
      }

      return foundTask;
   }, [selectedIssueId, allTasksData.data, currentTagData.tasks, currentTagData.currentTag]);

   return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeIssue()}>
         <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {task ? (
               <TaskDetailsView task={task} />
            ) : selectedIssueId ? (
               <div className="py-8 text-center text-muted-foreground">Task not found</div>
            ) : (
               <div className="py-8 text-center text-muted-foreground">No issue selected</div>
            )}
         </DialogContent>
      </Dialog>
   );
}
