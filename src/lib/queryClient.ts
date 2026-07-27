import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack QueryClient instance configured for ClaimFlow platform.
 * Sets sensible defaults for caching, retries, and stale time.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
