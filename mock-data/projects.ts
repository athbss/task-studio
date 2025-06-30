import { Status, status } from './status';
import {
   Blocks,
   Bomb,
   FormInput,
   Globe,
   HelpCircle,
   LayoutDashboard,
   Lock,
   LucideIcon,
   Play,
   Settings,
   Tag,
   GitBranch,
   Package,
} from 'lucide-react';
import { RemixiconComponentType } from '@remixicon/react';
import { User, users } from './users';
import { Priority, priorities } from './priorities';

export interface Project {
   id: string;
   name: string;
   status: Status;
   icon: LucideIcon | RemixiconComponentType;
   percentComplete: number;
   startDate: string;
   lead: User;
   priority: Priority;
   health: Health;
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

// Helper function to get icon for tag name
function getIconForTag(tagName: string): LucideIcon {
   const iconMap: Record<string, LucideIcon> = {
      'master': GitBranch,
      'main': GitBranch,
      'issue-viewer': FormInput,
      'feature': Package,
      'bug': Bomb,
      'docs': HelpCircle,
      'test': Play,
      'ui': Blocks,
      'api': Globe,
      'auth': Lock,
      'dashboard': LayoutDashboard,
      'settings': Settings,
   };

   // Check if tag name contains any of the keywords
   const tagLower = tagName.toLowerCase();
   for (const [keyword, icon] of Object.entries(iconMap)) {
      if (tagLower.includes(keyword)) {
         return icon;
      }
   }

   // Default icon
   return Tag;
}

// Function to create project from Taskmaster tag data
export function createProjectFromTag(
   tagName: string,
   taskCount: number,
   metadata?: any,
   index: number = 0
): Project {
   // Calculate completion percentage based on task statuses (if available)
   // For now, using a mock calculation
   const percentComplete = Math.floor(Math.random() * 100);

   // Select status based on some logic (could be based on task completion)
   const projectStatus =
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
   const projectHealth =
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
            ? 'General'
            : tagName
                 .split('-')
                 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                 .join(' '),
      status: projectStatus,
      icon: getIconForTag(tagName),
      percentComplete,
      startDate: metadata?.created || new Date().toISOString().split('T')[0],
      lead: users[0], // Default to first user
      priority: priorities[index % priorities.length],
      health: projectHealth,
   };
}

// Export a function that can be used to get projects from actual tags
export function getProjectsFromTags(
   tags: Array<{ name: string; taskCount: number; metadata?: any }>
): Project[] {
   return tags.map((tag, index) =>
      createProjectFromTag(tag.name, tag.taskCount, tag.metadata, index)
   );
}

// Default mock projects for fallback/demo purposes
export const projects: Project[] = [
   createProjectFromTag('master', 8, { created: '2025-03-01' }, 0),
   createProjectFromTag('issue-viewer', 10, { created: '2025-03-08' }, 1),
];
