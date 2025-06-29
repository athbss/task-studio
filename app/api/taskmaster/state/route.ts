import { NextResponse } from 'next/server';
import path from 'path';
import { readJsonFile } from '@/utils/filesystem';

export async function GET() {
   try {
      // Read state.json from the current .taskmaster directory
      const statePath = path.join(process.cwd(), '.taskmaster', 'state.json');
      const result = await readJsonFile(statePath);

      if (!result.success) {
         return NextResponse.json(
            {
               success: false,
               error: result.error || 'Failed to read state.json',
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
