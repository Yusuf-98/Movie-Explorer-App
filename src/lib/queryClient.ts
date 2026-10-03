import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './axios';

export function shouldRetry(failureCount: number, error: unknown) {
  const isClientError = error instanceof ApiError && error.status >= 400 && error.status < 500;
  return !isClientError && failureCount < 1;
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
    },
  });
}
