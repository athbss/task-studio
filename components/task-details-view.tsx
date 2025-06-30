'use client';

import * as React from 'react';
import { TaskmasterTask } from '@/types/taskmaster';
import { TaskWithTag } from '@/hooks/use-all-tasks';
import { TASKMASTER_STATUS_MAP } from '@/lib/taskmaster-constants';
import { priorities } from '@/mock-data/priorities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SubtaskProgress } from '@/components/common/issues/subtask-progress';
import { PrioritySelector } from '@/components/common/issues/priority-selector';
import { StatusSelector } from '@/components/common/issues/status-selector';
import { AssigneeUser } from '@/components/common/issues/assignee-user';
import { countSubtasks } from '@/lib/subtask-utils';
import { Status } from '@/mock-data/status';
import { Priority } from '@/mock-data/priorities';
import { User } from '@/mock-data/users';
import { Plus, ChevronRight, Triangle } from 'lucide-react';

interface TaskDetailsViewProps {
   task: TaskmasterTask | TaskWithTag;
}

export function TaskDetailsView({ task }: TaskDetailsViewProps) {
   const [isSubtasksExpanded, setIsSubtasksExpanded] = React.useState(true);

   const statusInfo =
      TASKMASTER_STATUS_MAP[task.status as keyof typeof TASKMASTER_STATUS_MAP] ||
      TASKMASTER_STATUS_MAP.pending;
   const priority = priorities.find((p) => p.id === task.priority) || priorities[3];

   // Count subtasks
   const subtaskCount = task.subtasks
      ? countSubtasks({ subtasks: task.subtasks } as any)
      : { completed: 0, total: 0 };

   // Get tag name if available
   const tagName = 'tagName' in task ? task.tagName : 'master';

   // Convert to Status and Priority interfaces for selectors
   const statusObject: Status = {
      id: task.status === 'in-progress' ? 'in_progress' : task.status,
      name: statusInfo.name,
      color: statusInfo.color,
      icon: statusInfo.icon,
   };

   const priorityObject: Priority = {
      id: task.priority,
      name: priority.name,
      icon: priority.icon,
   };

   // Convert assignee to User interface
   const assigneeUser: User | null = task.assignee
      ? {
           id: task.assignee,
           name: task.assignee,
           email: `${task.assignee}@example.com`,
           avatarUrl: `https://api.dicebear.com/9.x/glass/svg?seed=${task.assignee}`,
           status: 'online' as const,
           role: 'Member' as const,
           joinedDate: new Date().toISOString(),
           teamIds: [],
        }
      : null;

   // Create a unique issue ID for the selectors
   const issueId = 'tagName' in task ? `${task.tagName}-${task.id}` : task.id.toString();

   return (
      <div className="flex flex-1 overflow-hidden">
         {/* Main Content */}
         <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl">
               <h1 className="text-2xl font-semibold mb-4">{task.title}</h1>

               <p className="text-muted-foreground mb-8">
                  {task.description || 'Add description...'}
               </p>

               {/* Details Section */}
               {task.details && (
                  <div className="mb-8">
                     <h3 className="text-sm font-medium mb-3">Implementation Details</h3>
                     <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-md p-4">
                        {task.details}
                     </div>
                  </div>
               )}

               {/* Test Strategy Section */}
               {task.testStrategy && (
                  <div className="mb-8">
                     <h3 className="text-sm font-medium mb-3">Test Strategy</h3>
                     <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-md p-4">
                        {task.testStrategy}
                     </div>
                  </div>
               )}

               {/* Subtasks */}
               {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mb-8">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setIsSubtasksExpanded(!isSubtasksExpanded)}
                           >
                              <ChevronRight
                                 className={cn(
                                    'h-4 w-4 transition-transform',
                                    isSubtasksExpanded && 'rotate-90'
                                 )}
                              />
                           </Button>
                           <span className="font-medium">Sub-tasks</span>
                           <SubtaskProgress
                              completed={subtaskCount.completed}
                              total={subtaskCount.total}
                              className="ml-2"
                           />
                        </div>
                        <div className="flex items-center gap-2">
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Plus className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>

                     {isSubtasksExpanded && (
                        <div className="space-y-1">
                           {task.subtasks.map((subtask) => {
                              const subtaskStatus =
                                 TASKMASTER_STATUS_MAP[
                                    subtask.status as keyof typeof TASKMASTER_STATUS_MAP
                                 ] || TASKMASTER_STATUS_MAP.pending;

                              const subtaskStatusObject: Status = {
                                 id:
                                    subtask.status === 'in-progress'
                                       ? 'in_progress'
                                       : subtask.status,
                                 name: subtaskStatus.name,
                                 color: subtaskStatus.color,
                                 icon: subtaskStatus.icon,
                              };

                              const subtaskId = `${issueId}-subtask-${subtask.id}`;

                              return (
                                 <div
                                    key={subtask.id}
                                    className="flex items-center gap-3 py-2 px-2 hover:bg-muted/50 rounded-md"
                                 >
                                    <StatusSelector
                                       status={subtaskStatusObject}
                                       issueId={subtaskId}
                                    />
                                    <span
                                       className={cn(
                                          'flex-1 text-sm',
                                          subtask.status === 'done' &&
                                             'line-through text-muted-foreground'
                                       )}
                                    >
                                       {subtask.title}
                                    </span>
                                    {subtask.priority && (
                                       <Badge variant="secondary" className="text-xs">
                                          {subtask.priority}
                                       </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground font-mono">
                                       {task.id}.{subtask.id}
                                    </span>
                                 </div>
                              );
                           })}
                        </div>
                     )}
                  </div>
               )}

               {/* Dependencies */}
               {task.dependencies && task.dependencies.length > 0 && (
                  <div className="mb-8">
                     <h3 className="text-sm font-medium mb-3">Dependencies</h3>
                     <div className="flex flex-wrap gap-2">
                        {task.dependencies.map((dep) => (
                           <Badge key={dep} variant="outline" className="text-xs">
                              Task #{dep}
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </main>

         {/* Properties Sidebar */}
         <aside className="w-80 border-l p-6 overflow-y-auto">
            <div className="space-y-6">
               {/* Status */}
               <div>
                  <span className="text-xs font-medium text-muted-foreground">Status</span>
                  <div className="mt-2">
                     <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 h-9 px-2"
                     >
                        <div className="h-4 w-4" style={{ color: statusInfo.color }}>
                           <statusInfo.icon />
                        </div>
                        <span className="text-sm font-medium">{statusInfo.name}</span>
                     </Button>
                  </div>
               </div>

               {/* Priority */}
               <div>
                  <span className="text-xs font-medium text-muted-foreground">Priority</span>
                  <div className="mt-2">
                     <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 h-9 px-2"
                     >
                        <priority.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{priority.name}</span>
                     </Button>
                  </div>
               </div>

               {/* Assignee */}
               <div>
                  <span className="text-xs font-medium text-muted-foreground">Assignee</span>
                  <div className="mt-2 flex items-center gap-3">
                     <AssigneeUser user={assigneeUser} />
                     <span className="text-sm">{assigneeUser?.name || 'Unassigned'}</span>
                  </div>
               </div>

               {/* Estimate */}
               <div className="flex items-center gap-3 text-muted-foreground">
                  <Triangle className="h-4 w-4" />
                  <span>Set estimate</span>
               </div>

               {/* Labels */}
               {task.labels && task.labels.length > 0 && (
                  <div>
                     <h3 className="font-medium mb-3">Labels</h3>
                     <div className="flex flex-wrap gap-2">
                        {task.labels.map((label) => (
                           <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}

               {/* Project/Tag */}
               <div>
                  <h3 className="font-medium mb-3">Tag</h3>
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-background rounded-full" />
                     </div>
                     <span>{tagName}</span>
                  </div>
               </div>
            </div>
         </aside>
      </div>
   );
}
