// API client for Taskmaster endpoints

export interface ApiResponse<T = any> {
   success: boolean;
   data?: T;
   error?: string;
   timestamp: string;
}

export interface TaskmasterTasks {
   [tagName: string]: {
      tasks: any[];
      metadata?: {
         created: string;
         updated: string;
         description: string;
      };
   };
}

export interface TaskmasterState {
   currentTag: string;
   currentTask?: number;
   [key: string]: any;
}

export interface TaskmasterConfig {
   global?: {
      projectName?: string;
      [key: string]: any;
   };
   [key: string]: any;
}

const API_BASE = '/api/taskmaster';

/**
 * Fetches all available tags
 */
export async function fetchTags(): Promise<
   ApiResponse<Array<{ name: string; taskCount: number; metadata: any }>>
> {
   try {
      const response = await fetch(`${API_BASE}/tags`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to fetch tags',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Fetches tasks for a specific tag
 */
export async function fetchTasksByTag(
   tagName: string
): Promise<ApiResponse<{ name: string; tasks: any[]; metadata: any }>> {
   try {
      const response = await fetch(`${API_BASE}/tags/${encodeURIComponent(tagName)}`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to fetch tasks by tag',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Fetches the current tag context
 */
export async function fetchCurrentTag(): Promise<ApiResponse<{ currentTag: string; state: any }>> {
   try {
      const response = await fetch(`${API_BASE}/current`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to fetch current tag',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Fetches the tasks.json file
 */
export async function fetchTasks(): Promise<ApiResponse<TaskmasterTasks>> {
   try {
      const response = await fetch(`${API_BASE}/tasks`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to fetch tasks',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Fetches the state.json file
 */
export async function fetchState(): Promise<ApiResponse<TaskmasterState>> {
   try {
      const response = await fetch(`${API_BASE}/state`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to fetch state',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Fetches available .taskmaster directories
 */
export async function fetchDirectories(): Promise<ApiResponse<any[]>> {
   try {
      const response = await fetch(`${API_BASE}/directories`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to fetch directories',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Fetches a specific file from the .taskmaster directory
 */
export async function fetchFile(filePath: string): Promise<ApiResponse<string>> {
   try {
      const response = await fetch(`${API_BASE}/${filePath}`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to fetch file',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Lists files in a directory
 */
export async function listFiles(dirPath: string): Promise<ApiResponse<string[]>> {
   try {
      const response = await fetch(`${API_BASE}/${dirPath}/list`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to list files',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Fetches the config.json file
 */
export async function fetchConfig(): Promise<ApiResponse<TaskmasterConfig>> {
   try {
      const response = await fetch(`${API_BASE}/config`);
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to fetch config',
         timestamp: new Date().toISOString(),
      };
   }
}

/**
 * Updates a task
 */
export async function updateTask(params: {
   tag: string;
   taskId: string;
   updates: {
      status?: string;
      priority?: string;
      assignee?: string;
   };
}): Promise<ApiResponse<any>> {
   try {
      const response = await fetch(`${API_BASE}/tasks/update`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(params),
      });
      const data = await response.json();
      return data;
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Failed to update task',
         timestamp: new Date().toISOString(),
      };
   }
}
