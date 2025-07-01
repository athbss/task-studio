import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { TaskmasterPaths } from '@/lib/taskmaster-paths';

export async function GET() {
   try {
      const configPath = TaskmasterPaths.config();

      try {
         const configData = await fs.readFile(configPath, 'utf-8');
         const config = JSON.parse(configData);

         return NextResponse.json({
            success: true,
            data: config,
            timestamp: new Date().toISOString(),
         });
      } catch (error: any) {
         // If config doesn't exist, return empty config instead of error
         if (error.code === 'ENOENT') {
            return NextResponse.json({
               success: true,
               data: {
                  global: {
                     projectName: 'Task Studio',
                  },
               },
               timestamp: new Date().toISOString(),
            });
         }
         throw error;
      }
   } catch (error) {
      console.error('Error reading config:', error);
      return NextResponse.json(
         {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to read config',
            timestamp: new Date().toISOString(),
         },
         { status: 500 }
      );
   }
}
