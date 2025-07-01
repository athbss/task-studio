import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { readJsonFile } from '@/utils/filesystem';

interface ComplexityAnalysis {
   taskId: number;
   taskTitle: string;
   complexityScore: number;
   recommendedSubtasks: number;
   expansionPrompt: string;
   reasoning: string;
}

interface ComplexityReport {
   meta: {
      generatedAt: string;
      tasksAnalyzed: number;
      totalTasks: number;
      analysisCount: number;
      thresholdScore: number;
      projectName: string;
      usedResearch: boolean;
   };
   complexityAnalysis: ComplexityAnalysis[];
}

interface RouteParams {
   params: Promise<{
      tagName: string;
   }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
   try {
      const { tagName } = await params;

      // Read tasks.json
      const tasksPath = path.join(process.cwd(), '.taskmaster', 'tasks', 'tasks.json');
      const result = await readJsonFile(tasksPath);

      if (!result.success) {
         return NextResponse.json(
            {
               success: false,
               error: result.error || 'Failed to read tasks.json',
               path: tasksPath,
               timestamp: new Date().toISOString(),
            },
            { status: 404 }
         );
      }

      // Get tasks for specific tag
      const tagData = result.data?.[tagName];

      if (!tagData) {
         return NextResponse.json(
            {
               success: false,
               error: `Tag '${tagName}' not found`,
               timestamp: new Date().toISOString(),
            },
            { status: 404 }
         );
      }

      // Try to load complexity report for this tag
      let tasks = tagData.tasks || [];
      try {
         const reportPath = path.join(
            process.cwd(),
            '.taskmaster',
            'reports',
            `task-complexity-report_${tagName}.json`
         );
         const reportResult = await readJsonFile(reportPath);

         if (reportResult.success && reportResult.data) {
            const report = reportResult.data as ComplexityReport;
            const complexityMap: Record<number, ComplexityAnalysis> = {};

            // Index complexity analysis by task ID
            report.complexityAnalysis.forEach((analysis) => {
               complexityMap[analysis.taskId] = analysis;
            });

            // Merge complexity data into tasks
            tasks = tasks.map((task: any) => {
               const complexityAnalysis = complexityMap[task.id];
               if (complexityAnalysis) {
                  return {
                     ...task,
                     complexity: {
                        score: complexityAnalysis.complexityScore,
                        expansionPrompt: complexityAnalysis.expansionPrompt,
                        reasoning: complexityAnalysis.reasoning,
                        recommendedSubtasks: complexityAnalysis.recommendedSubtasks,
                     },
                  };
               }
               return task;
            });
         }
      } catch {
         // No complexity report found for this tag
      }

      return NextResponse.json(
         {
            success: true,
            data: {
               name: tagName,
               tasks,
               metadata: tagData.metadata || null,
            },
            timestamp: new Date().toISOString(),
         },
         {
            headers: {
               'Cache-Control': 'no-store, no-cache, must-revalidate',
               'Pragma': 'no-cache',
               'Expires': '0',
            },
         }
      );
   } catch (error) {
      console.error('Error in tag-specific route:', error);
      return NextResponse.json(
         {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
            timestamp: new Date().toISOString(),
         },
         { status: 500 }
      );
   }
}
