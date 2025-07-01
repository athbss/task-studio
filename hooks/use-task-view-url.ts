'use client';

import { useQueryState } from 'nuqs';
import { useEffect, useCallback } from 'react';
import { useTaskViewStore } from '@/store/task-view-store';
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
   const {
      openTask: openTaskStore,
      closeTask: closeTaskStore,
      selectedTaskId,
      isOpen,
   } = useTaskViewStore();

   // Sync from URL to store on mount and URL changes
   useEffect(() => {
      if (taskId) {
         // The selectedTaskId in store might have tag prefix, but taskId from URL is numeric
         const currentTaskId = selectedTaskId ? extractTaskId(selectedTaskId) : '';
         if (taskId !== currentTaskId) {
            // For now, just open with the numeric ID - the overlay will handle finding the right task
            openTaskStore(taskId);
         }
      } else if (!taskId && isOpen) {
         closeTaskStore();
      }
   }, [taskId, selectedTaskId, isOpen, openTaskStore, closeTaskStore]);

   // Enhanced open function that updates both store and URL
   const openTask = useCallback(
      (taskId: string) => {
         // Extract just the numeric task ID for the URL
         const numericTaskId = extractTaskId(taskId);
         openTaskStore(taskId);
         setTaskId(numericTaskId);
      },
      [openTaskStore, setTaskId]
   );

   // Enhanced close function that updates both store and URL
   const closeTask = useCallback(() => {
      closeTaskStore();
      setTaskId('');
   }, [closeTaskStore, setTaskId]);

   return {
      taskId,
      openTask,
      closeTask,
   };
}
