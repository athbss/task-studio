import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {
   findTaskInTag,
   updateTaskInPlace,
   cloneTasks,
   validateTaskUpdate,
} from '@/lib/taskmaster-service';
import { TagContext } from '@/types/taskmaster';
import { UpdateTaskResponse, updateTaskSchema } from '@/types/taskmaster-api';

export async function POST(request: NextRequest) {
   try {
      // Parse and validate request body
      const body = await request.json();
      const validationResult = updateTaskSchema.safeParse(body);

      if (!validationResult.success) {
         return NextResponse.json<UpdateTaskResponse>(
            {
               success: false,
               error: validationResult.error.errors[0].message,
               timestamp: new Date().toISOString(),
            },
            { status: 400 }
         );
      }

      const { tag, taskId, updates } = validationResult.data;

      // Read current tasks file
      const tasksPath = path.join(process.cwd(), '.taskmaster/tasks/tasks.json');

      let tasksData: Record<string, TagContext>;
      try {
         const fileContent = await fs.readFile(tasksPath, 'utf-8');
         tasksData = JSON.parse(fileContent);
      } catch {
         return NextResponse.json<UpdateTaskResponse>(
            {
               success: false,
               error: 'Failed to read tasks file',
               timestamp: new Date().toISOString(),
            },
            { status: 500 }
         );
      }

      // Check if tag exists
      if (!tasksData[tag]) {
         return NextResponse.json<UpdateTaskResponse>(
            {
               success: false,
               error: `Tag '${tag}' not found`,
               timestamp: new Date().toISOString(),
            },
            { status: 404 }
         );
      }

      // Find the task in the specified tag
      const currentTask = findTaskInTag(tasksData[tag].tasks, taskId);
      if (!currentTask) {
         return NextResponse.json<UpdateTaskResponse>(
            {
               success: false,
               error: `Task '${taskId}' not found in tag '${tag}'`,
               timestamp: new Date().toISOString(),
            },
            { status: 404 }
         );
      }

      // Validate the update
      const validationErrors = validateTaskUpdate(currentTask, updates);
      if (validationErrors.length > 0) {
         return NextResponse.json<UpdateTaskResponse>(
            {
               success: false,
               error: validationErrors.join('; '),
               timestamp: new Date().toISOString(),
            },
            { status: 400 }
         );
      }

      // Clone tasks to avoid mutation
      const updatedTasks = cloneTasks(tasksData[tag].tasks);

      // Apply the update
      const updateSuccess = updateTaskInPlace(updatedTasks, taskId, updates);
      if (!updateSuccess) {
         return NextResponse.json<UpdateTaskResponse>(
            {
               success: false,
               error: 'Failed to update task',
               timestamp: new Date().toISOString(),
            },
            { status: 500 }
         );
      }

      // Update the tag's tasks
      tasksData[tag].tasks = updatedTasks;

      // Update the tag's metadata
      if (tasksData[tag].metadata) {
         tasksData[tag].metadata.updatedAt = new Date().toISOString();
      }

      // Write back to file atomically
      try {
         const tempPath = `${tasksPath}.tmp`;
         await fs.writeFile(tempPath, JSON.stringify(tasksData, null, 2));
         await fs.rename(tempPath, tasksPath);
      } catch {
         return NextResponse.json<UpdateTaskResponse>(
            {
               success: false,
               error: 'Failed to save updated tasks',
               timestamp: new Date().toISOString(),
            },
            { status: 500 }
         );
      }

      // Find the updated task to return
      const updatedTask = findTaskInTag(updatedTasks, taskId);
      if (!updatedTask) {
         return NextResponse.json<UpdateTaskResponse>(
            {
               success: false,
               error: 'Task updated but could not retrieve updated data',
               timestamp: new Date().toISOString(),
            },
            { status: 500 }
         );
      }

      return NextResponse.json<UpdateTaskResponse>(
         {
            success: true,
            data: updatedTask,
            timestamp: new Date().toISOString(),
         },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error in update task API:', error);
      return NextResponse.json<UpdateTaskResponse>(
         {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
            timestamp: new Date().toISOString(),
         },
         { status: 500 }
      );
   }
}
