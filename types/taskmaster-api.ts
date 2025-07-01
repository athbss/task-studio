import { z } from 'zod';
import { TaskmasterTask, TaskStatus, TaskPriority } from './taskmaster';

// Request types
export interface UpdateTaskRequest {
   tag: string;
   taskId: string;
   updates: {
      status?: TaskStatus;
      priority?: TaskPriority;
      assignee?: string;
   };
}

// Response types
export interface UpdateTaskResponse {
   success: boolean;
   data?: TaskmasterTask;
   error?: string;
   timestamp: string;
}

// Zod schemas for validation
export const updateTaskSchema = z.object({
   tag: z.string().min(1, 'Tag is required'),
   taskId: z.string().min(1, 'Task ID is required'),
   updates: z
      .object({
         status: z
            .enum(['pending', 'in_progress', 'in-progress', 'done', 'cancelled'] as const)
            .optional(),
         priority: z.enum(['low', 'medium', 'high', 'urgent'] as const).optional(),
         assignee: z.string().optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
         message: 'At least one field must be provided for update',
      }),
});

// Type inference from schema
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
