import { Project, projects as defaultProjects } from './projects';
import { User, users } from './users';

export interface Team {
   id: string;
   name: string;
   icon: string;
   joined: boolean;
   color: string;
   members: User[];
   projects: Project[];
}

// Function to create teams with dynamic projects
export function createTeamsWithProjects(projects: Project[]): Team[] {
   return [
      {
         id: 'TASKMASTER',
         name: 'Taskmaster',
         icon: '📋',
         joined: true,
         color: '#8B5CF6',
         members: users,
         projects: projects.length > 0 ? projects : defaultProjects,
      },
   ];
}

// Default teams for fallback
export const teams: Team[] = createTeamsWithProjects(defaultProjects);
