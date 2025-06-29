import { NextResponse } from 'next/server';
import path from 'path';
import { readJsonFile } from '@/utils/filesystem';

export async function GET() {
   try {
      // Read state.json to get current tag context
      const statePath = path.join(process.cwd(), '.taskmaster', 'state.json');
      const result = await readJsonFile(statePath);

      if (!result.success) {
         return NextResponse.json(
            {
               success: false,
               error: result.error || 'Failed to read state.json',
               path: statePath,
               timestamp: new Date().toISOString(),
            },
            { status: 404 }
         );
      }

      return NextResponse.json({
         success: true,
         data: {
            currentTag: result.data?.currentTag || 'master',
            state: result.data,
         },
         timestamp: new Date().toISOString(),
      });
   } catch (error) {
      console.error('Error in current tag route:', error);
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
