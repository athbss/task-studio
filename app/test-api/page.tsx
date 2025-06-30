'use client';

import { useState, useEffect } from 'react';
import {
   fetchTasks,
   fetchState,
   fetchDirectories,
   fetchTags,
   fetchTasksByTag,
   fetchCurrentTag,
} from '@/lib/api/taskmaster';

export default function TestApiPage() {
   const [tasks, setTasks] = useState<any>(null);
   const [state, setState] = useState<any>(null);
   const [directories, setDirectories] = useState<any>(null);
   const [, setDebug] = useState<any>(null);
   const [tags, setTags] = useState<any>(null);
   const [currentTag, setCurrentTag] = useState<any>(null);
   const [tagTasks, setTagTasks] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function testApi() {
         try {
            setLoading(true);

            // Debug endpoint first
            try {
               const debugResponse = await fetch('/api/taskmaster/debug');
               const debugData = await debugResponse.json();
               setDebug(debugData);
            } catch (e) {
               console.error('Debug error:', e);
            }

            // Test fetching tasks
            const tasksResult = await fetchTasks();
            if (tasksResult.success) {
               setTasks(tasksResult.data);
            } else {
               console.error('Tasks error:', tasksResult.error);
               setError(`Tasks: ${tasksResult.error}`);
            }

            // Test fetching state
            const stateResult = await fetchState();
            if (stateResult.success) {
               setState(stateResult.data);
            } else {
               console.error('State error:', stateResult.error);
               if (!error) setError(`State: ${stateResult.error}`);
            }

            // Test fetching directories
            const dirResult = await fetchDirectories();
            if (dirResult.success) {
               setDirectories(dirResult.data);
            } else {
               console.error('Directories error:', dirResult.error);
            }

            // Test fetching tags
            const tagsResult = await fetchTags();
            if (tagsResult.success) {
               setTags(tagsResult.data);

               // Test fetching tasks for first tag if available
               if (tagsResult.data && tagsResult.data.length > 0) {
                  const firstTag = tagsResult.data[0].name;
                  const tagTasksResult = await fetchTasksByTag(firstTag);
                  if (tagTasksResult.success) {
                     setTagTasks(tagTasksResult.data);
                  }
               }
            } else {
               console.error('Tags error:', tagsResult.error);
            }

            // Test fetching current tag
            const currentTagResult = await fetchCurrentTag();
            if (currentTagResult.success) {
               setCurrentTag(currentTagResult.data);
            } else {
               console.error('Current tag error:', currentTagResult.error);
            }
         } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
         } finally {
            setLoading(false);
         }
      }

      testApi();
   }, [error]);

   return (
      <div className="p-8 max-w-4xl mx-auto">
         <h1 className="text-2xl font-bold mb-6">Taskmaster API Test</h1>

         {loading && <p>Loading...</p>}
         {error && <p className="text-red-500">Error: {error}</p>}

         <div className="space-y-6">
            <section>
               <h2 className="text-xl font-semibold mb-2">Directories</h2>
               <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
                  {JSON.stringify(directories, null, 2)}
               </pre>
            </section>

            <section>
               <h2 className="text-xl font-semibold mb-2">Available Tags</h2>
               <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
                  {JSON.stringify(tags, null, 2)}
               </pre>
            </section>

            <section>
               <h2 className="text-xl font-semibold mb-2">Current Tag Context</h2>
               <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
                  {JSON.stringify(currentTag, null, 2)}
               </pre>
            </section>

            <section>
               <h2 className="text-xl font-semibold mb-2">Tag-Specific Tasks</h2>
               <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
                  {JSON.stringify(tagTasks, null, 2)}
               </pre>
            </section>

            <section>
               <h2 className="text-xl font-semibold mb-2">State</h2>
               <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
                  {JSON.stringify(state, null, 2)}
               </pre>
            </section>

            <section>
               <h2 className="text-xl font-semibold mb-2">All Tasks</h2>
               <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(tasks, null, 2)}
               </pre>
            </section>
         </div>
      </div>
   );
}
