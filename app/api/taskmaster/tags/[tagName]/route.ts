import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { readJsonFile } from '@/utils/filesystem';

interface RouteParams {
   params: Promise<{
      tagName: string;
   }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
   try {
      const { tagName } = await params;

      // Read tasks.json
      const tasksPath = path.join(process.cwd(), '.taskmaster', 'tasks', 'tasks.json');
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

      // Get tasks for specific tag
      const tagData = result.data?.[tagName];

      if (!tagData) {
         return NextResponse.json(
            {
               success: false,
               error: `Tag '${tagName}' not found`,
               timestamp: new Date().toISOString(),
            },
            { status: 404 }
         );
      }

      return NextResponse.json({
         success: true,
         data: {
            name: tagName,
            tasks: tagData.tasks || [],
            metadata: tagData.metadata || null,
         },
         timestamp: new Date().toISOString(),
      });
   } catch (error) {
      console.error('Error in tag-specific route:', error);
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
