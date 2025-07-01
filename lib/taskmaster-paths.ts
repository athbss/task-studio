import path from 'path';

/**
 * Gets the target directory for Taskmaster files
 * Uses TASKMASTER_DIR environment variable if set,
 * otherwise defaults to current directory
 */
export function getTaskmasterTargetDir(): string {
   const targetDir = process.env.TASKMASTER_DIR;

   if (targetDir) {
      // If it's a relative path, resolve it relative to the current working directory
      return path.isAbsolute(targetDir) ? targetDir : path.resolve(process.cwd(), targetDir);
   }

   // Default to current working directory
   return process.cwd();
}

/**
 * Gets the full path to the .taskmaster directory
 */
export function getTaskmasterPath(): string {
   const targetDir = process.env.TASKMASTER_DIR;

   if (targetDir) {
      // If TASKMASTER_DIR is set, use it directly (it should point to .taskmaster)
      const resolved = path.isAbsolute(targetDir)
         ? targetDir
         : path.resolve(process.cwd(), targetDir);
      return resolved;
   }

   // Default: add .taskmaster to current directory
   const defaultPath = path.join(process.cwd(), '.taskmaster');
   return defaultPath;
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
