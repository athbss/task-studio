import { NextResponse } from 'next/server';
import path from 'path';
import { readJsonFile } from '@/utils/filesystem';

export async function GET() {
   try {
      // Read tasks.json from the current .taskmaster directory
      const tasksPath = path.join(process.cwd(), '.taskmaster', 'tasks', 'tasks.json');
      console.log('Reading tasks from:', tasksPath);

      const result = await readJsonFile(tasksPath);
      console.log('Read result:', result);

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

      return NextResponse.json({
         success: true,
         data: result.data,
         timestamp: new Date().toISOString(),
      });
   } catch (error) {
      console.error('Error in tasks route:', error);
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
