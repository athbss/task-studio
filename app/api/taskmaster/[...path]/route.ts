import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import {
   safeReadFile,
   readJsonFile,
   listFiles,
   getTaskmasterDirectories,
   validateTaskmasterPath,
   sanitizePath,
} from '@/utils/filesystem';

// Type for API responses
interface ApiResponse<T = any> {
   success: boolean;
   data?: T;
   error?: string;
   timestamp: string;
}

// Helper to create standardized responses
function createResponse<T>(
   success: boolean,
   data?: T,
   error?: string,
   status: number = 200
): NextResponse {
   const response: ApiResponse<T> = {
      success,
      data,
      error,
      timestamp: new Date().toISOString(),
   };

   return NextResponse.json(response, { status });
}

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ path: string[] }> }
) {
   try {
      const pathSegments = (await params).path || [];
      const requestPath = pathSegments.join('/');

      // Handle different API endpoints

      // List available directories
      if (pathSegments.length === 0 || pathSegments[0] === 'directories') {
         const result = await getTaskmasterDirectories();
         return createResponse(
            result.success,
            result.data,
            result.error,
            result.success ? 200 : 500
         );
      }

      // Handle file requests
      if (pathSegments.length > 0) {
         // Construct the file path
         const filePath = path.join(process.cwd(), sanitizePath(requestPath));

         // Validate the path
         if (!validateTaskmasterPath(filePath)) {
            return createResponse(false, undefined, 'Invalid path', 400);
         }

         // Handle specific file types
         const fileName = pathSegments[pathSegments.length - 1];

         // JSON files
         if (fileName.endsWith('.json')) {
            const result = await readJsonFile(filePath);
            return createResponse(
               result.success,
               result.data,
               result.error,
               result.success ? 200 : 404
            );
         }

         // Markdown files
         if (fileName.endsWith('.md')) {
            const result = await safeReadFile(filePath);
            return createResponse(
               result.success,
               result.data,
               result.error,
               result.success ? 200 : 404
            );
         }

         // Directory listing
         if (pathSegments[pathSegments.length - 1] === 'list') {
            const dirPath = path.join(
               process.cwd(),
               sanitizePath(pathSegments.slice(0, -1).join('/'))
            );

            const result = await listFiles(dirPath, (file) => {
               return file.endsWith('.json') || file.endsWith('.md');
            });

            return createResponse(
               result.success,
               result.data,
               result.error,
               result.success ? 200 : 404
            );
         }

         // If no specific handler matched, try to read as text file
         const result = await safeReadFile(filePath);
         return createResponse(
            result.success,
            result.data,
            result.error,
            result.success ? 200 : 404
         );
      }

      // Default response
      return createResponse(false, undefined, 'Invalid endpoint', 400);
   } catch (error) {
      console.error('API Error:', error);
      return createResponse(
         false,
         undefined,
         error instanceof Error ? error.message : 'Internal server error',
         500
      );
   }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
   return new NextResponse(null, {
      status: 200,
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'GET, OPTIONS',
         'Access-Control-Allow-Headers': 'Content-Type',
      },
   });
}
