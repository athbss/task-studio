export interface TaskmasterTask {
   id: number;
   title: string;
   description: string;
   status: 'pending' | 'in_progress' | 'in-progress' | 'done' | 'cancelled';
   priority: 'low' | 'medium' | 'high' | 'urgent';
   dependencies: number[];
   subtasks?: TaskmasterTask[];
   assignee?: string;
   labels?: string[];
   dueDate?: string;
   details?: string;
   testStrategy?: string;
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
