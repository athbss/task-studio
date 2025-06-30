'use client';

import { Issue } from '@/mock-data/issues';
import { TaskmasterTask } from '@/types/taskmaster';
import { IssueLine } from './issue-line';
import { TASKMASTER_STATUS_MAP } from '@/lib/taskmaster-constants';

interface IssueWithSubtasksProps {
   issue: Issue;
   layoutId?: boolean;
   showProjectBadge?: boolean;
   indentLevel?: number;
}

interface SubtaskIssue extends Issue {
   isSubtask?: boolean;
   parentId?: string;
}

// Helper function to convert subtask to Issue format
function subtaskToIssue(subtask: TaskmasterTask, parentIssue: Issue, index: number): SubtaskIssue {
   const statusInfo =
      TASKMASTER_STATUS_MAP[subtask.status as keyof typeof TASKMASTER_STATUS_MAP] ||
      TASKMASTER_STATUS_MAP.pending;
   // Convert Taskmaster status to UI status id
   const statusId = subtask.status === 'in-progress' ? 'in_progress' : subtask.status;

   return {
      id: `${parentIssue.id}-sub-${subtask.id}`,
      identifier: `${parentIssue.identifier}.${subtask.id}`,
      title: subtask.title,
      description: subtask.description || '',
      status: {
         id: statusId,
         name: statusInfo.name,
         color: statusInfo.color,
         icon: statusInfo.icon,
      },
      priority: {
         id: subtask.priority || 'medium',
         name:
            (subtask.priority || 'medium').charAt(0).toUpperCase() +
            (subtask.priority || 'medium').slice(1),
      } as any,
      assignee: null, // Simplified for now
      labels:
         subtask.labels?.map((label) => ({
            id: label,
            name: label,
            color: '#8B5CF6',
         })) || [],
      project: parentIssue.project,
      createdAt: parentIssue.createdAt,
      cycleId: parentIssue.cycleId,
      rank: `${parentIssue.rank}.${index}`,
      subtasks: subtask.subtasks,
      isSubtask: true,
      parentId: parentIssue.id,
   };
}

export function IssueWithSubtasks({
   issue,
   layoutId = false,
   showProjectBadge = true,
   indentLevel = 0,
}: IssueWithSubtasksProps) {
   const hasSubtasks = issue.subtasks && issue.subtasks.length > 0;

   return (
      <>
         {/* Parent issue */}
         <IssueLine issue={issue} layoutId={layoutId} showProjectBadge={showProjectBadge} />

         {/* Subtasks - no indentation, just visual indicators */}
         {hasSubtasks && (
            <>
               {issue.subtasks!.map((subtask, index) => {
                  const subtaskIssue = subtaskToIssue(subtask as TaskmasterTask, issue, index);

                  return (
                     <IssueWithSubtasks
                        key={subtaskIssue.id}
                        issue={subtaskIssue}
                        layoutId={false}
                        showProjectBadge={false}
                        indentLevel={indentLevel + 1}
                     />
                  );
               })}
            </>
         )}
      </>
   );
}
