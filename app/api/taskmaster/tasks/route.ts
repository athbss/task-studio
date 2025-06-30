import { NextResponse } from 'next/server';
import path from 'path';
import { readJsonFile } from '@/utils/filesystem';
import fs from 'fs/promises';

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

export async function GET() {
   try {
      // Read tasks.json from the current .taskmaster directory
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

      // Read all complexity reports
      const reportsPath = path.join(process.cwd(), '.taskmaster', 'reports');
      const complexityReports: Record<string, Record<number, ComplexityAnalysis>> = {};

      try {
         const files = await fs.readdir(reportsPath);
         const reportFiles = files.filter(
            (file) => file.startsWith('task-complexity-report_') && file.endsWith('.json')
         );

         // Load each complexity report
         for (const file of reportFiles) {
            const tagName = file.replace('task-complexity-report_', '').replace('.json', '');
            const reportPath = path.join(reportsPath, file);
            const reportResult = await readJsonFile(reportPath);

            if (reportResult.success && reportResult.data) {
               const report = reportResult.data as ComplexityReport;
               complexityReports[tagName] = {};

               // Index complexity analysis by task ID for easy lookup
               report.complexityAnalysis.forEach((analysis) => {
                  complexityReports[tagName][analysis.taskId] = analysis;
               });
            }
         }
      } catch {
         // Reports directory doesn't exist or error reading reports
      }

      // Merge complexity data into tasks
      const tasksData = result.data as Record<string, any>;
      const enrichedData = { ...tasksData };

      // Add complexity data to each task in each tag
      Object.keys(enrichedData).forEach((tagName) => {
         if (enrichedData[tagName]?.tasks && complexityReports[tagName]) {
            enrichedData[tagName].tasks = enrichedData[tagName].tasks.map((task: any) => {
               const complexityAnalysis = complexityReports[tagName][task.id];
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
      });

      return NextResponse.json({
         success: true,
         data: enrichedData,
         timestamp: new Date().toISOString(),
      });
   } catch (error) {
      console.error('Error in tasks route:', error);
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
