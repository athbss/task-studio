import path from 'path';

/**
 * Gets the target directory for Taskmaster files
 * Uses TASKMASTER_DIR environment variable if set,
 * otherwise defaults to current directory
 */
export function getTaskmasterTargetDir(): string {
   // If TASKMASTER_DIR is set, it's already the full path to .taskmaster
   if (process.env.TASKMASTER_DIR) {
      return process.env.TASKMASTER_DIR;
   }

   // Check if we have the USER_CWD from the CLI - this is the user's project directory
   if (process.env.USER_CWD) {
      return process.env.USER_CWD;
   }

   // Default to current working directory
   return process.cwd();
}

/**
 * Gets the full path to the .taskmaster directory
 */
export function getTaskmasterPath(): string {
   // If TASKMASTER_DIR is set, use it directly (it should already point to .taskmaster)
   if (process.env.TASKMASTER_DIR) {
      return process.env.TASKMASTER_DIR;
   }

   // If we have USER_CWD, that's the project root, so append .taskmaster
   if (process.env.USER_CWD) {
      return path.join(process.env.USER_CWD, '.taskmaster');
   }

   // This should never happen when running via CLI, but fallback just in case
   return path.join(process.cwd(), '.taskmaster');
}

/**
 * Gets the path to a specific file within the .taskmaster directory
 */
export function getTaskmasterFilePath(...pathSegments: string[]): string {
   return path.join(getTaskmasterPath(), ...pathSegments);
}

/**
 * Gets common Taskmaster file paths
 */
export const TaskmasterPaths = {
   tasks: () => getTaskmasterFilePath('tasks', 'tasks.json'),
   state: () => getTaskmasterFilePath('state.json'),
   config: () => getTaskmasterFilePath('config.json'),
   reports: () => getTaskmasterFilePath('reports'),
   docs: () => getTaskmasterFilePath('docs'),
} as const;
