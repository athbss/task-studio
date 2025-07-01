'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseTaskmasterWebSocketOptions {
   url?: string;
   enabled?: boolean;
   onMessage?: (data: any) => void;
}

export function useTaskmasterWebSocket({
   url = process.env.NEXT_PUBLIC_WS_URL ||
      `ws://localhost:${process.env.NEXT_PUBLIC_WS_PORT || '5566'}`,
   enabled = true,
   onMessage,
}: UseTaskmasterWebSocketOptions = {}) {
   const [isConnected, setIsConnected] = useState(false);
   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
   const wsRef = useRef<WebSocket | null>(null);
   const queryClient = useQueryClient();

   useEffect(() => {
      if (!enabled) return;

      const connectWebSocket = () => {
         try {
            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
               console.log('WebSocket connected');
               setIsConnected(true);
            };

            ws.onmessage = (event) => {
               try {
                  const data = JSON.parse(event.data);
                  // Update React Query cache
                  if (data.type === 'file-change' || data.type === 'initial-data') {
                     setLastUpdate(new Date());

                     // Invalidate queries to refetch data
                     queryClient.invalidateQueries({ queryKey: ['taskmaster'] });
                     queryClient.invalidateQueries({ queryKey: ['current-tag'] });
                     queryClient.invalidateQueries({ queryKey: ['all-tasks'] });

                     // Call custom handler if provided
                     onMessage?.(data);
                  }
               } catch (error) {
                  console.error('Error parsing WebSocket message:', error);
               }
            };

            ws.onerror = (error) => {
               console.error('WebSocket error:', error);
               setIsConnected(false);
            };

            ws.onclose = () => {
               console.log('WebSocket disconnected');
               setIsConnected(false);

               // Attempt to reconnect after 5 seconds
               setTimeout(connectWebSocket, 5000);
            };
         } catch (error) {
            console.error('Error connecting WebSocket:', error);
            setIsConnected(false);
         }
      };

      connectWebSocket();

      // Cleanup
      return () => {
         if (wsRef.current) {
            wsRef.current.close();
         }
      };
   }, [enabled, url, queryClient, onMessage]);

   return {
      isConnected,
      lastUpdate,
   };
}
