'use server';

import { promises as fs } from 'fs';
import path from 'path';

export interface TaskmasterConfig {
   models: {
      main: {
         provider: string;
         modelId: string;
         maxTokens: number;
         temperature: number;
      };
      research: {
         provider: string;
         modelId: string;
         maxTokens: number;
         temperature: number;
      };
      fallback: {
         provider: string;
         modelId: string;
         maxTokens: number;
         temperature: number;
      };
   };
   global: {
      logLevel: string;
      debug: boolean;
      defaultSubtasks: number;
      defaultPriority: string;
      projectName: string;
      ollamaBaseURL: string;
      bedrockBaseURL: string;
      userId: string;
      defaultTag: string;
   };
}

export async function getTaskmasterConfig(): Promise<TaskmasterConfig | null> {
   try {
      const configPath = path.join(process.cwd(), '.taskmaster', 'config.json');
      const configData = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(configData) as TaskmasterConfig;
   } catch (error) {
      console.error('Failed to read taskmaster config:', error);
      return null;
   }
}

export async function getProjectName(): Promise<string> {
   const config = await getTaskmasterConfig();
   return config?.global?.projectName || 'Taskmaster';
}
