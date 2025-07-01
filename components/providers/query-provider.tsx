'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: Infinity,
                  refetchOnMount: false, // Disable refetch on mount
               },
            },
         })
   );

   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
