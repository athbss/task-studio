import { Status, status } from './status';
import { User, users } from './users';
import { Priority, priorities } from './priorities';

export interface Tag {
   id: string;
   name: string;
   status: Status;
   percentComplete: number;
   startDate: string;
   lead: User;
   priority: Priority;
   health: Health;
   taskCount?: number;
   statusCounts?: {
      pending: number;
      in_progress: number;
      done: number;
      cancelled: number;
   };
   totalTasks?: number;
}

interface Health {
   id: 'no-update' | 'off-track' | 'on-track' | 'at-risk';
   name: string;
   color: string;
   description: string;
}

export const health: Health[] = [
   {
      id: 'no-update',
      name: 'No Update',
      color: '#FF0000',
      description: 'The project has not been updated in the last 30 days.',
   },
   {
      id: 'off-track',
      name: 'Off Track',
      color: '#FF0000',
      description: 'The project is not on track and may be delayed.',
   },
   {
      id: 'on-track',
      name: 'On Track',
      color: '#00FF00',
      description: 'The project is on track and on schedule.',
   },
   {
      id: 'at-risk',
      name: 'At Risk',
      color: '#FF0000',
      description: 'The project is at risk and may be delayed.',
   },
];

// Function to create tag from Taskmaster tag data
export function createTagFromData(
   tagName: string,
   taskCount: number,
   metadata?: any,
   index: number = 0
): Tag {
   // Calculate completion percentage based on task statuses (if available)
   // For now, using a mock calculation
   const percentComplete = Math.floor(Math.random() * 100);

   // Select status based on some logic (could be based on task completion)
   const tagStatus =
      percentComplete === 100
         ? status[5]
         : percentComplete > 80
           ? status[4]
           : percentComplete > 60
             ? status[3]
             : percentComplete > 40
               ? status[2]
               : percentComplete > 20
                 ? status[1]
                 : status[0];

   // Determine health based on various factors
   const tagHealth =
      percentComplete > 70
         ? health[2] // on-track
         : percentComplete > 40
           ? health[3] // at-risk
           : percentComplete > 20
             ? health[1] // off-track
             : health[0]; // no-update

   return {
      id: tagName,
      name:
         tagName === 'master'
            ? 'Master'
            : tagName
                 .split('-')
                 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                 .join(' '),
      status: tagStatus,
      percentComplete,
      startDate: metadata?.created || new Date().toISOString().split('T')[0],
      lead: users[0], // Default to first user
      priority: priorities[index % priorities.length],
      health: tagHealth,
      taskCount,
   };
}

// Export a function that can be used to get tags from actual tag data
export function getTagsFromData(
   tagsData: Array<{ name: string; taskCount: number; metadata?: any }>
): Tag[] {
   return tagsData.map((tag, index) =>
      createTagFromData(tag.name, tag.taskCount, tag.metadata, index)
   );
}

// Default mock tags for fallback/demo purposes
export const tags: Tag[] = [
   createTagFromData('master', 8, { created: '2025-03-01' }, 0),
   createTagFromData('task-viewer', 10, { created: '2025-03-08' }, 1),
];
