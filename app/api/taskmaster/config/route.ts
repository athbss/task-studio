import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

function getTaskmasterPath() {
   return path.join(process.cwd(), '.taskmaster');
}

export async function GET() {
   try {
      const taskmasterPath = getTaskmasterPath();
      const configPath = path.join(taskmasterPath, 'config.json');

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
