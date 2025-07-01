import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { writeFileSync, renameSync, existsSync } from 'fs';
import crypto from 'crypto';

// Type definitions for filesystem operations
export interface FileSystemResult<T = any> {
   success: boolean;
   data?: T;
   error?: string;
}

export interface TaskmasterDirectory {
   path: string;
   name: string;
   exists: boolean;
}

// Zod schemas for validation
const pathSchema = z.string().min(1).max(1000);

// Task update validation schema
export const taskUpdateSchema = z.object({
   id: z.union([z.string(), z.number()]),
   title: z.string().optional(),
   description: z.string().optional(),
   status: z.enum(['pending', 'in-progress', 'completed', 'done']).optional(),
   priority: z.enum(['low', 'medium', 'high']).optional(),
   dependencies: z.array(z.union([z.string(), z.number()])).optional(),
   details: z.string().optional(),
   testStrategy: z.string().optional(),
   subtasks: z.array(z.any()).optional(),
});

// Constants
const TASKMASTER_DIR = '.taskmaster';
const ALLOWED_EXTENSIONS = ['.json', '.md', '.txt'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates that a path is safe and within allowed boundaries
 * Prevents directory traversal attacks
 */
export function validateTaskmasterPath(inputPath: string): boolean {
   try {
      // Basic validation
      const parsed = pathSchema.parse(inputPath);

      // Normalize the path to resolve any ../ or ./ segments
      const normalizedPath = path.normalize(parsed);

      // Check for directory traversal attempts
      if (normalizedPath.includes('..')) {
         return false;
      }

      // Special case for npx/npm temporary directories
      // When running via npx, files might be in node_modules
      if (
         normalizedPath.includes('node_modules') &&
         (normalizedPath.includes('task-studio') || normalizedPath.includes('/.npm/_npx/'))
      ) {
         // Allow these paths - they're from npx execution
         return true;
      }

      // For absolute paths, ensure they contain .taskmaster
      if (path.isAbsolute(normalizedPath)) {
         if (!normalizedPath.includes(TASKMASTER_DIR)) {
            return false;
         }
      } else {
         // For relative paths, ensure they start with .taskmaster or are within it
         if (
            !normalizedPath.startsWith(TASKMASTER_DIR) &&
            !normalizedPath.includes(TASKMASTER_DIR)
         ) {
            return false;
         }
      }

      // Check for null bytes or other dangerous characters
      if (normalizedPath.includes('\0')) {
         return false;
      }

      return true;
   } catch {
      return false;
   }
}

/**
 * Sanitizes a file path to ensure it's safe to use
 */
export function sanitizePath(inputPath: string): string {
   // Remove any leading/trailing whitespace
   let sanitized = inputPath.trim();

   // Remove null bytes
   sanitized = sanitized.replace(/\0/g, '');

   // Normalize the path
   sanitized = path.normalize(sanitized);

   // Remove any leading slashes or drive letters
   sanitized = sanitized.replace(/^[a-zA-Z]:/, '').replace(/^\/+/, '');

   return sanitized;
}

/**
 * Safely reads a file with proper error handling and size limits
 */
export async function safeReadFile(
   filePath: string,
   encoding: BufferEncoding = 'utf-8'
): Promise<FileSystemResult<string>> {
   try {
      // Validate the path first
      if (!validateTaskmasterPath(filePath)) {
         return {
            success: false,
            error: 'Invalid file path',
         };
      }

      // Check file extension
      const ext = path.extname(filePath).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
         return {
            success: false,
            error: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
         };
      }

      // Check if file exists
      try {
         await fs.access(filePath);
      } catch {
         return {
            success: false,
            error: 'File not found',
         };
      }

      // Check file size
      const stats = await fs.stat(filePath);
      if (stats.size > MAX_FILE_SIZE) {
         return {
            success: false,
            error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
         };
      }

      // Read the file
      const content = await fs.readFile(filePath, encoding);

      return {
         success: true,
         data: content,
      };
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error reading file',
      };
   }
}

/**
 * Lists available .taskmaster directories in a given base path
 */
export async function getTaskmasterDirectories(
   basePath?: string
): Promise<FileSystemResult<TaskmasterDirectory[]>> {
   // Import here to avoid circular dependency
   const { getTaskmasterTargetDir } = await import('../lib/taskmaster-paths');
   const targetDir = basePath || getTaskmasterTargetDir();
   try {
      const directories: TaskmasterDirectory[] = [];

      // Check current directory
      const currentTaskmaster = path.join(targetDir, TASKMASTER_DIR);
      try {
         const stats = await fs.stat(currentTaskmaster);
         if (stats.isDirectory()) {
            directories.push({
               path: currentTaskmaster,
               name: 'Current Directory',
               exists: true,
            });
         }
      } catch {
         // Directory doesn't exist
         directories.push({
            path: currentTaskmaster,
            name: 'Current Directory',
            exists: false,
         });
      }

      // Could be extended to check parent directories or other locations

      return {
         success: true,
         data: directories,
      };
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Error listing directories',
      };
   }
}

/**
 * Reads and parses a JSON file safely
 */
export async function readJsonFile<T = any>(filePath: string): Promise<FileSystemResult<T>> {
   const result = await safeReadFile(filePath);

   if (!result.success) {
      return result as FileSystemResult<T>;
   }

   try {
      const parsed = JSON.parse(result.data!);
      return {
         success: true,
         data: parsed,
      };
   } catch (error) {
      return {
         success: false,
         error: 'Invalid JSON format',
      };
   }
}

/**
 * Gets the modification time of a file for caching purposes
 */
export async function getFileModTime(filePath: string): Promise<FileSystemResult<Date>> {
   try {
      if (!validateTaskmasterPath(filePath)) {
         return {
            success: false,
            error: 'Invalid file path',
         };
      }

      const stats = await fs.stat(filePath);
      return {
         success: true,
         data: stats.mtime,
      };
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Error getting file modification time',
      };
   }
}

/**
 * Lists files in a directory with optional filtering
 */
export async function listFiles(
   dirPath: string,
   filter?: (filename: string) => boolean
): Promise<FileSystemResult<string[]>> {
   try {
      if (!validateTaskmasterPath(dirPath)) {
         return {
            success: false,
            error: 'Invalid directory path',
         };
      }

      const files = await fs.readdir(dirPath);
      const filtered = filter ? files.filter(filter) : files;

      return {
         success: true,
         data: filtered,
      };
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Error listing files',
      };
   }
}

/**
 * Atomically writes JSON data to a file using a temporary file and rename
 * This ensures the file is either fully written or not written at all
 */
export async function writeJsonFile<T = any>(
   filePath: string,
   data: T,
   options?: { pretty?: boolean }
): Promise<FileSystemResult<void>> {
   try {
      // Validate the path
      if (!validateTaskmasterPath(filePath)) {
         return {
            success: false,
            error: 'Invalid file path',
         };
      }

      // Ensure the file extension is allowed
      const ext = path.extname(filePath).toLowerCase();
      if (ext !== '.json') {
         return {
            success: false,
            error: 'Only JSON files are allowed for writing',
         };
      }

      // Create a temporary file path
      const tempPath = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;

      try {
         // Ensure the directory exists
         const dir = path.dirname(filePath);
         if (!existsSync(dir)) {
            await fs.mkdir(dir, { recursive: true });
         }

         // Serialize the data
         const jsonString = options?.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);

         // Write to temporary file first
         await fs.writeFile(tempPath, jsonString, 'utf-8');

         // Atomically rename the temp file to the target file
         await fs.rename(tempPath, filePath);

         return {
            success: true,
         };
      } catch (error) {
         // Clean up temp file if it exists
         if (existsSync(tempPath)) {
            try {
               await fs.unlink(tempPath);
            } catch {
               // Ignore cleanup errors
            }
         }
         throw error;
      }
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Error writing JSON file',
      };
   }
}

/**
 * Simple file locking mechanism using last-write-wins approach
 * This is a basic implementation that doesn't provide true locking
 * but helps coordinate writes by checking modification times
 */
export async function acquireFileLock(
   filePath: string,
   timeout: number = 5000
): Promise<FileSystemResult<{ release: () => void; mtime?: Date }>> {
   try {
      if (!validateTaskmasterPath(filePath)) {
         return {
            success: false,
            error: 'Invalid file path',
         };
      }

      // Get current modification time if file exists
      let currentMtime: Date | undefined;
      try {
         const stats = await fs.stat(filePath);
         currentMtime = stats.mtime;
      } catch {
         // File doesn't exist yet, which is fine
      }

      // In a real implementation, we would create a lock file or use file locks
      // For now, we'll use a simple approach that checks modification time
      const lockId = crypto.randomBytes(16).toString('hex');
      const lockFile = `${filePath}.lock`;

      // Try to create a lock file
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
         try {
            // Try to create lock file exclusively
            await fs.writeFile(lockFile, lockId, { flag: 'wx' });

            // Success! Return the lock with a release function
            return {
               success: true,
               data: {
                  mtime: currentMtime,
                  release: async () => {
                     try {
                        // Verify we still own the lock
                        const lockContent = await fs.readFile(lockFile, 'utf-8');
                        if (lockContent === lockId) {
                           await fs.unlink(lockFile);
                        }
                     } catch {
                        // Ignore errors during release
                     }
                  },
               },
            };
         } catch (error: any) {
            if (error.code === 'EEXIST') {
               // Lock file exists, wait a bit and retry
               await new Promise((resolve) => setTimeout(resolve, 100));
            } else {
               throw error;
            }
         }
      }

      return {
         success: false,
         error: 'Failed to acquire lock: timeout',
      };
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Error acquiring file lock',
      };
   }
}

/**
 * Validates task update data using Zod schema
 */
export function validateTaskUpdate(
   data: unknown
): FileSystemResult<z.infer<typeof taskUpdateSchema>> {
   try {
      const validated = taskUpdateSchema.parse(data);
      return {
         success: true,
         data: validated,
      };
   } catch (error) {
      if (error instanceof z.ZodError) {
         return {
            success: false,
            error: `Validation error: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
         };
      }
      return {
         success: false,
         error: 'Unknown validation error',
      };
   }
}
