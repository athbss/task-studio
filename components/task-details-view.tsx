'use client';

import * as React from 'react';
import { TaskmasterTask } from '@/types/taskmaster';
import { TASKMASTER_STATUS_MAP } from '@/lib/taskmaster-constants';
import { priorities } from '@/mock-data/priorities';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskDetailsViewProps {
   task: TaskmasterTask;
}

export function TaskDetailsView({ task }: TaskDetailsViewProps) {
   const statusInfo =
      TASKMASTER_STATUS_MAP[task.status as keyof typeof TASKMASTER_STATUS_MAP] ||
      TASKMASTER_STATUS_MAP.pending;
   const priority = priorities.find((p) => p.id === task.priority) || priorities[3]; // Default to medium
   const StatusIcon = statusInfo.icon;
   const PriorityIcon = priority.icon;

   // Priority colors
   const priorityColors: Record<string, string> = {
      'urgent': '#EF4444',
      'high': '#F97316',
      'medium': '#F59E0B',
      'low': '#3B82F6',
      'no-priority': '#6B7280',
   };

   return (
      <div className="space-y-6">
         {/* Header with status and priority */}
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <div className="h-4 w-4" style={{ color: statusInfo.color }}>
                  <StatusIcon />
               </div>
               <span className="text-sm font-medium" style={{ color: statusInfo.color }}>
                  {statusInfo.name}
               </span>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-4 w-4" style={{ color: priorityColors[priority.id] || '#6B7280' }}>
                  <PriorityIcon />
               </div>
               <span
                  className="text-sm font-medium"
                  style={{ color: priorityColors[priority.id] || '#6B7280' }}
               >
                  {priority.name}
               </span>
            </div>
         </div>

         {/* Title */}
         <div>
            <h2 className="text-2xl font-semibold">{task.title}</h2>
         </div>

         {/* Description */}
         {task.description && (
            <div className="space-y-2">
               <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
               <p className="text-sm">{task.description}</p>
            </div>
         )}

         {/* Details */}
         {task.details && (
            <div className="space-y-2">
               <h3 className="text-sm font-medium text-muted-foreground">Implementation Details</h3>
               <p className="text-sm whitespace-pre-wrap">{task.details}</p>
            </div>
         )}

         {/* Test Strategy */}
         {task.testStrategy && (
            <div className="space-y-2">
               <h3 className="text-sm font-medium text-muted-foreground">Test Strategy</h3>
               <p className="text-sm whitespace-pre-wrap">{task.testStrategy}</p>
            </div>
         )}

         {/* Metadata */}
         <div className="space-y-3 border-t pt-4">
            {/* Assignee */}
            {task.assignee && (
               <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Assignee:</span>
                  <Badge variant="secondary" className="text-xs">
                     {task.assignee}
                  </Badge>
               </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
               <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <span className="text-sm">{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
               </div>
            )}

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
               <div className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground">Labels:</span>
                  <div className="flex flex-wrap gap-1">
                     {task.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                           {label}
                        </Badge>
                     ))}
                  </div>
               </div>
            )}

            {/* Dependencies */}
            {task.dependencies && task.dependencies.length > 0 && (
               <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Dependencies:</span>
                  <div className="flex gap-1">
                     {task.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline" className="text-xs">
                           Task #{dep}
                        </Badge>
                     ))}
                  </div>
               </div>
            )}

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
               <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                     Subtasks ({task.subtasks.filter((st) => st.status === 'done').length}/
                     {task.subtasks.length})
                  </span>
                  <div className="space-y-1 pl-4">
                     {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2">
                           <span
                              className={cn(
                                 'text-sm',
                                 subtask.status === 'done' && 'line-through text-muted-foreground'
                              )}
                           >
                              {subtask.title}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
