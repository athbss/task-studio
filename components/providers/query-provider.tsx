'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: Infinity, // Consider data stale after 1 minute
                  refetchOnMount: false, // Refetch on mount to ensure fresh data
                  refetchOnWindowFocus: false, // Don't refetch on window focus
               },
            },
         })
   );

   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
