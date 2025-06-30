'use client';

import { useQueryState } from 'nuqs';
import { useEffect, useCallback } from 'react';
import { useIssueViewStore } from '@/store/issue-view-store';
import { extractTaskId } from '@/lib/task-id-utils';

export function useTaskViewUrl() {
   // Use nuqs to sync with URL - stores just the numeric task ID
   const [taskId, setTaskId] = useQueryState('task', {
      defaultValue: '',
      // Parse empty string as null
      parse: (value) => value || '',
      serialize: (value) => value || '',
      history: 'push',
   });

   // Get store actions
   const { openIssue, closeIssue, selectedIssueId, isOpen } = useIssueViewStore();

   // Sync from URL to store on mount and URL changes
   useEffect(() => {
      if (taskId) {
         // The selectedIssueId in store might have tag prefix, but taskId from URL is numeric
         const currentTaskId = selectedIssueId ? extractTaskId(selectedIssueId) : '';
         if (taskId !== currentTaskId) {
            // For now, just open with the numeric ID - the overlay will handle finding the right task
            openIssue(taskId);
         }
      } else if (!taskId && isOpen) {
         closeIssue();
      }
   }, [taskId, selectedIssueId, isOpen, openIssue, closeIssue]);

   // Enhanced open function that updates both store and URL
   const openTask = useCallback(
      (issueId: string) => {
         // Extract just the numeric task ID for the URL
         const numericTaskId = extractTaskId(issueId);
         openIssue(issueId);
         setTaskId(numericTaskId);
      },
      [openIssue, setTaskId]
   );

   // Enhanced close function that updates both store and URL
   const closeTask = useCallback(() => {
      closeIssue();
      setTaskId('');
   }, [closeIssue, setTaskId]);

   return {
      taskId,
      openTask,
      closeTask,
   };
}
