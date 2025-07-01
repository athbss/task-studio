export interface TaskComplexity {
   score: number;
   expansionPrompt: string;
   reasoning: string;
   recommendedSubtasks: number;
}

export type TaskStatus = 'pending' | 'in_progress' | 'in-progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskmasterTask {
   id: number;
   title: string;
   description: string;
   status: TaskStatus;
   priority: TaskPriority;
   dependencies: number[];
   subtasks?: TaskmasterTask[];
   assignee?: string;
   labels?: string[];
   dueDate?: string;
   details?: string;
   testStrategy?: string;
   complexity?: TaskComplexity;
}

export interface TagContext {
   name: string;
   tasks: TaskmasterTask[];
   metadata?: {
      description: string;
      createdAt: string;
      updatedAt?: string;
   };
}

export interface TaskmasterState {
   currentTag: string;
   currentTask?: number;
   [key: string]: any;
}

export interface UIState {
   currentTag: string;
   viewMode: 'board' | 'list';
   filters: {
      status?: string[];
      priority?: string[];
      assignee?: string[];
      labels?: string[];
      search?: string;
   };
   selectedTask: number | null;
}
