#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { spawn } = require('child_process');
const path = require('path');

// Determine if we're in standalone or development mode
const isStandalone = __dirname.includes('.next/standalone');
const rootDir = isStandalone ? path.resolve(__dirname, '..', '..') : __dirname;
const standaloneDir = isStandalone ? __dirname : path.join(__dirname, '.next', 'standalone');
const serverPath = path.join(standaloneDir, 'server.js');
const wsPath = path.join(rootDir, 'scripts', 'ws.js');

// Start Next.js server
const nextProcess = spawn('node', [serverPath], {
   stdio: 'inherit',
   env: process.env,
   cwd: standaloneDir,
});

// Start WebSocket server
const wsProcess = spawn('node', [wsPath], {
   stdio: 'inherit',
   env: process.env,
});

// Handle termination
process.on('SIGINT', () => {
   nextProcess.kill('SIGINT');
   wsProcess.kill('SIGINT');
   process.exit(0);
});

process.on('SIGTERM', () => {
   nextProcess.kill('SIGTERM');
   wsProcess.kill('SIGTERM');
   process.exit(0);
});

nextProcess.on('exit', (code) => {
   wsProcess.kill();
   process.exit(code);
});

wsProcess.on('exit', (code) => {
   if (code !== 0) {
      nextProcess.kill();
      process.exit(code);
   }
});
