#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

const program = new Command();

// Get the real CWD - when running via npx, we need to look at PWD or INIT_CWD
const getRealCwd = () => {
   // INIT_CWD is set by npm/npx to the original directory
   if (process.env.INIT_CWD) {
      return process.env.INIT_CWD;
   }
   // PWD is usually available in Unix-like systems
   if (process.env.PWD) {
      return process.env.PWD;
   }
   // Fallback to process.cwd()
   return process.cwd();
};

program
   .name('task-studio')
   .description('Web-based UI for Taskmaster task management system')
   .version('0.1.0', '-v, --version', 'display the version number')
   .option('-p, --port <port>', 'Port to run the server on', '5565')
   .option('--ws-port <port>', 'Port for WebSocket server', '5566')
   .option('--ws-url <url>', 'Full WebSocket URL (overrides --ws-port)')
   .option('-d, --dir <dir>', 'Path to .taskmaster directory', '.taskmaster')
   .option('--no-open', 'Do not open browser automatically')
   .action(async (options) => {
      const port = options.port;
      const wsPort = options.wsPort;
      // Always resolve to absolute path from the real CWD
      const taskmasterPath = path.resolve(getRealCwd(), options.dir);

      // Check if directory exists
      if (!fs.existsSync(taskmasterPath)) {
         console.error(`Error: Directory not found at ${taskmasterPath}`);
         console.error('Please provide a valid path to your Taskmaster directory.');
         process.exit(1);
      }

      console.log(`Starting Task Studio...`);
      console.log(`Watching: ${taskmasterPath}`);
      console.log(`Port: ${port}`);

      // Determine if we're in standalone mode (published package) or development
      const packageRoot = path.resolve(__dirname, '..');
      const standaloneDir = path.join(packageRoot, '.next', 'standalone');
      const isStandalone = fs.existsSync(standaloneDir);

      let serverProcess;

      if (isStandalone) {
         // Running from published package - use standalone server
         const serverPath = path.join(standaloneDir, 'server.js');

         if (!fs.existsSync(serverPath)) {
            console.error(
               'Error: Standalone server not found. The package may not have been built correctly.'
            );
            process.exit(1);
         }

         // Start the standalone Next.js server directly
         serverProcess = spawn('node', [serverPath], {
            cwd: standaloneDir,
            stdio: 'inherit',
            env: {
               ...process.env,
               TASKMASTER_DIR: taskmasterPath,
               PORT: port,
               NEXT_PUBLIC_WS_PORT: wsPort,
               ...(options.wsUrl && { NEXT_PUBLIC_WS_URL: options.wsUrl }),
               USER_CWD: getRealCwd(),
               HOSTNAME: '0.0.0.0',
            },
         });

         // Also start WebSocket server
         const wsPath = path.join(packageRoot, 'scripts', 'ws.js');
         // Only start WebSocket server if not using external URL
         if (!options.wsUrl) {
            spawn('node', [wsPath], {
               stdio: 'inherit',
               env: {
                  ...process.env,
                  TASKMASTER_DIR: taskmasterPath,
                  WS_PORT: wsPort,
                  NEXT_PUBLIC_WS_PORT: wsPort,
                  USER_CWD: getRealCwd(),
               },
            });
         }
      } else {
         // Development mode - use npm/pnpm
         const packageManager = fs.existsSync(path.join(packageRoot, 'pnpm-lock.yaml'))
            ? 'pnpm'
            : fs.existsSync(path.join(packageRoot, 'yarn.lock'))
              ? 'yarn'
              : 'npm';

         serverProcess = spawn(packageManager, ['run', 'start'], {
            cwd: packageRoot,
            stdio: 'inherit',
            shell: true,
            env: {
               ...process.env,
               TASKMASTER_DIR: taskmasterPath,
               PORT: port,
               NEXT_PUBLIC_WS_PORT: wsPort,
               ...(options.wsUrl && { NEXT_PUBLIC_WS_URL: options.wsUrl }),
               USER_CWD: getRealCwd(),
            },
         });
      }

      // Handle process termination
      process.on('SIGINT', () => {
         console.log('\nShutting down Task Studio...');
         serverProcess.kill('SIGINT');
         process.exit(0);
      });

      process.on('SIGTERM', () => {
         serverProcess.kill('SIGTERM');
         process.exit(0);
      });

      // Open browser after a short delay
      if (options.open) {
         setTimeout(async () => {
            try {
               // Dynamic import for ESM module
               const { default: open } = await import('open');
               await open(`http://localhost:${port}`);
            } catch (err) {
               console.error('Failed to open browser:', err.message);
            }
         }, 1000);
      }

      // Handle server process exit
      serverProcess.on('exit', (code) => {
         console.log(`Task Studio exited with code ${code}`);
         process.exit(code);
      });
   });

program.parse(process.argv);
