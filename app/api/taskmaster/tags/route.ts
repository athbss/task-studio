import { NextResponse } from 'next/server';
import path from 'path';
import { readJsonFile } from '@/utils/filesystem';
import { TaskmasterPaths } from '@/lib/taskmaster-paths';

export async function GET() {
   try {
      // Read tasks.json to extract all available tags
      const tasksPath = TaskmasterPaths.tasks();
      const result = await readJsonFile(tasksPath);

      if (!result.success) {
         return NextResponse.json(
            {
               success: false,
               error: result.error || 'Failed to read tasks.json',
               path: tasksPath,
               timestamp: new Date().toISOString(),
            },
            { status: 404 }
         );
      }

      // Extract all tag names from the tasks data
      const tags = Object.keys(result.data || {}).map((tagName) => ({
         name: tagName,
         taskCount: Array.isArray(result.data[tagName]?.tasks)
            ? result.data[tagName].tasks.length
            : 0,
         metadata: result.data[tagName]?.metadata || null,
      }));

      return NextResponse.json({
         success: true,
         data: tags,
         timestamp: new Date().toISOString(),
      });
   } catch (error) {
      console.error('Error in tags route:', error);
      return NextResponse.json(
         {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
            timestamp: new Date().toISOString(),
         },
         { status: 500 }
      );
   }
}
