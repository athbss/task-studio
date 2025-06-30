'use client';

import { useTaskmasterWebSocket } from '@/hooks/use-taskmaster-websocket';

export function TaskmasterWebSocketProvider({ children }: { children: React.ReactNode }) {
   useTaskmasterWebSocket({
      enabled: true,
   });

   return <>{children}</>;
}
