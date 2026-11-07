import { QueryClient } from '@tanstack/react-query';
import { normalizeHttpError } from '../utils/apiError';

function shouldRetry(failureCount: number, error: unknown, maxRetries: number): boolean {
  const normalized = normalizeHttpError(error);
  const status = normalized.status;

  // Não retenta erros determinísticos de cliente (400, 401, 403, 404, 422)
  if (status === 400 || status === 401 || status === 403 || status === 404 || status === 422) {
    return false;
  }

  return failureCount < maxRetries;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos
      gcTime: 1000 * 60 * 15, // 15 minutos
      retry: (failureCount, error: unknown) => shouldRetry(failureCount, error, 1),
      retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 5000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error: unknown) => shouldRetry(failureCount, error, 1),
      retryDelay: 1500,
    },
  },
});
