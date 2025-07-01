import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { validateTaskmasterPath } from '@/utils/filesystem';
import { TaskmasterPaths, getTaskmasterPath, getTaskmasterTargetDir } from '@/lib/taskmaster-paths';

export async function GET() {
   try {
      const cwd = process.cwd();
      const tasksPath = TaskmasterPaths.tasks();
      const statePath = TaskmasterPaths.state();

      // Debug info
      const debug: Record<string, any> = {
         cwd,
         tasksPath,
         statePath,
         tasksPathIsValid: validateTaskmasterPath(tasksPath),
         statePathIsValid: validateTaskmasterPath(statePath),
         tasksPathRelative: '.taskmaster/tasks/tasks.json',
         tasksPathRelativeIsValid: validateTaskmasterPath('.taskmaster/tasks/tasks.json'),
         env: {
            TASKMASTER_DIR: process.env.TASKMASTER_DIR,
            USER_CWD: process.env.USER_CWD,
            PWD: process.env.PWD,
            INIT_CWD: process.env.INIT_CWD,
         },
         targetDir: getTaskmasterTargetDir(),
         taskmasterPath: getTaskmasterPath(),
      };

      // Try to check if files exist
      try {
         const tasksStats = await fs.stat(tasksPath);
         debug.tasksFileExists = true;
         debug.tasksFileSize = tasksStats.size;
      } catch (e) {
         debug.tasksFileExists = false;
         debug.tasksError = e instanceof Error ? e.message : String(e);
      }

      try {
         const stateStats = await fs.stat(statePath);
         debug.stateFileExists = true;
         debug.stateFileSize = stateStats.size;
      } catch (e) {
         debug.stateFileExists = false;
         debug.stateError = e instanceof Error ? e.message : String(e);
      }

      // Try to read files directly
      try {
         const tasksContent = await fs.readFile(tasksPath, 'utf-8');
         debug.tasksContentLength = tasksContent.length;
         debug.tasksContentPreview = tasksContent.substring(0, 100);
      } catch (e) {
         debug.tasksReadError = e instanceof Error ? e.message : String(e);
      }

      return NextResponse.json({
         success: true,
         debug,
         timestamp: new Date().toISOString(),
      });
   } catch (error) {
      return NextResponse.json({
         success: false,
         error: error instanceof Error ? error.message : 'Debug error',
         timestamp: new Date().toISOString(),
      });
   }
}
