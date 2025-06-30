import { Tag, tags as defaultTags } from './tags';
import { User, users } from './users';

export interface Team {
   id: string;
   name: string;
   icon: string;
   joined: boolean;
   color: string;
   members: User[];
   tags: Tag[];
}

// Function to create teams with dynamic tags
export function createTeamsWithTags(tags: Tag[]): Team[] {
   return [
      {
         id: 'TASKMASTER',
         name: 'Taskmaster',
         icon: '📋',
         joined: true,
         color: '#8B5CF6',
         members: users,
         tags: tags.length > 0 ? tags : defaultTags,
      },
   ];
}

// Default teams for fallback
export const teams: Team[] = createTeamsWithTags(defaultTags);
