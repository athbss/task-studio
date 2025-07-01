'use client';

import { useTasksStore } from '@/store/tasks-store';
import { useSearchStore } from '@/store/search-store';
import { useEffect, useState } from 'react';
import { TaskLine } from './task-line';

export function SearchTasks() {
   const [searchResults, setSearchResults] = useState<
      ReturnType<typeof useTasksStore.getState>['tasks']
   >([]);
   const { searchTasks } = useTasksStore();
   const { searchQuery, isSearchOpen } = useSearchStore();

   useEffect(() => {
      if (searchQuery.trim() === '') {
         setSearchResults([]);
         return;
      }

      const results = searchTasks(searchQuery);
      setSearchResults(results);
   }, [searchQuery, searchTasks]);

   if (!isSearchOpen) {
      return null;
   }

   return (
      <div className="w-full">
         {searchQuery.trim() !== '' && (
            <div>
               {searchResults.length > 0 ? (
                  <div className="border rounded-md mt-4">
                     <div className="py-2 px-4 border-b bg-muted/50">
                        <h3 className="text-sm font-medium">Results ({searchResults.length})</h3>
                     </div>
                     <div className="divide-y">
                        {searchResults.map((task) => (
                           <TaskLine key={task.id} task={task} layoutId={false} />
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
   );
}
