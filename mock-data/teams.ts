import { Project, projects } from './projects';
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

export const teams: Team[] = [
   {
      id: 'CLAUDE',
      name: 'Claude',
      icon: '🤖',
      joined: true,
      color: '#8B5CF6',
      members: users,
      projects: projects,
   },
];
