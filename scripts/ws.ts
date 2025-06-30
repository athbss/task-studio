import { createTaskmasterWebSocketServer } from '../lib/websocket-server';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.NEXT_PUBLIC_WS_PORT ? parseInt(process.env.NEXT_PUBLIC_WS_PORT) : 5566;

// Start the WebSocket server
const { server, wss, watcher } = createTaskmasterWebSocketServer(PORT);

// Handle graceful shutdown
process.on('SIGINT', () => {
   console.log('\nShutting down WebSocket server...');

   watcher.close();
   wss.close();
   server.close(() => {
      console.log('WebSocket server shut down');
      process.exit(0);
   });
});

process.on('SIGTERM', () => {
   console.log('\nShutting down WebSocket server...');

   watcher.close();
   wss.close();
   server.close(() => {
      console.log('WebSocket server shut down');
      process.exit(0);
   });
});
