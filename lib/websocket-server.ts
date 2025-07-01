import { WebSocketServer } from 'ws';
import { watch } from 'chokidar';
import { readFileSync } from 'fs';
import { createServer } from 'http';
import path from 'path';
import { TaskmasterPaths } from './taskmaster-paths';

export function createTaskmasterWebSocketServer(port: number = 5566) {
   const server = createServer();
   const wss = new WebSocketServer({ server });

   // Watch the .taskmaster directory
   const watcher = watch(
      [
         TaskmasterPaths.tasks(),
         TaskmasterPaths.state(),
         TaskmasterPaths.config(),
         path.join(TaskmasterPaths.reports(), '**/*.json'),
      ],
      {
         persistent: true,
         ignoreInitial: true,
      }
   );

   // Debounce timer to handle rapid file changes
   let debounceTimer: NodeJS.Timeout | null = null;

   // Broadcast changes to all connected clients
   watcher.on('change', (filepath) => {
      console.log(`File changed: ${filepath}`);

      // Clear existing timer
      if (debounceTimer) {
         clearTimeout(debounceTimer);
      }

      // Debounce file reads to avoid reading incomplete writes
      debounceTimer = setTimeout(() => {
         try {
            const fileContent = readFileSync(filepath, 'utf-8');

            // Skip empty files
            if (!fileContent.trim()) {
               console.log('File is empty, skipping broadcast');
               return;
            }

            // Try to parse JSON
            let parsedContent;
            try {
               parsedContent = JSON.parse(fileContent);
            } catch (parseError) {
               console.error('Invalid JSON in file, skipping broadcast:', parseError);
               return;
            }

            const message = JSON.stringify({
               type: 'file-change',
               path: filepath,
               content: parsedContent,
               timestamp: new Date().toISOString(),
            });

            // Broadcast to all connected clients
            wss.clients.forEach((client) => {
               if (client.readyState === 1) {
                  // WebSocket.OPEN
                  client.send(message);
               }
            });
         } catch (error) {
            console.error('Error reading file:', error);
         }
      }, 100); // 100ms debounce
   });

   wss.on('connection', (ws) => {
      console.log('Client connected');

      // Send initial data
      try {
         const tasksPath = TaskmasterPaths.tasks();
         const statePath = TaskmasterPaths.state();
         const configPath = TaskmasterPaths.config();

         // Send tasks if file exists
         try {
            const tasks = JSON.parse(readFileSync(tasksPath, 'utf-8'));
            ws.send(
               JSON.stringify({
                  type: 'initial-tasks',
                  tasks,
                  timestamp: new Date().toISOString(),
               })
            );
         } catch {
            console.log('Tasks file not found or invalid');
         }

         // Send state if file exists
         try {
            const state = JSON.parse(readFileSync(statePath, 'utf-8'));
            ws.send(
               JSON.stringify({
                  type: 'initial-state',
                  state,
                  timestamp: new Date().toISOString(),
               })
            );
         } catch {
            console.log('State file not found or invalid');
         }

         // Send config if file exists
         try {
            const config = JSON.parse(readFileSync(configPath, 'utf-8'));
            ws.send(
               JSON.stringify({
                  type: 'initial-config',
                  config,
                  timestamp: new Date().toISOString(),
               })
            );
         } catch {
            console.log('Config file not found or invalid');
         }
      } catch (error) {
         console.error('Error sending initial data:', error);
      }

      ws.on('close', () => {
         console.log('Client disconnected');
      });
   });

   server.listen(port, () => {
      console.log(`WebSocket server listening on port ${port}`);
   });

   return { server, wss, watcher };
}
