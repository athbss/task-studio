import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { TaskmasterPaths } from '@/lib/taskmaster-paths';

export async function GET() {
   try {
      const configPath = TaskmasterPaths.config();

      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);

      return NextResponse.json({
         success: true,
         data: config,
         timestamp: new Date().toISOString(),
      });
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
