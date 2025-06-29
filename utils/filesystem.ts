import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

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
   basePath: string = process.cwd()
): Promise<FileSystemResult<TaskmasterDirectory[]>> {
   try {
      const directories: TaskmasterDirectory[] = [];

      // Check current directory
      const currentTaskmaster = path.join(basePath, TASKMASTER_DIR);
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
