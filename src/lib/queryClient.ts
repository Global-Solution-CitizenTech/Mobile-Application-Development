import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { normalizeHttpError } from '@/utils/apiError';

const NON_RETRYABLE_STATUS = new Set([400, 401, 403, 404, 422]);

function shouldRetry(failureCount: number, error: unknown, maxRetries: number): boolean {
  const normalized = normalizeHttpError(error);
  if (normalized.code === 'VALIDATION_ERROR' || NON_RETRYABLE_STATUS.has(normalized.status)) {
    return false;
  }
  return failureCount < maxRetries;
}

export function bindReactNativeQueryLifecycle(): () => void {
  const appStateSub = AppState.addEventListener('change', (status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  });

  onlineManager.setEventListener((setOnline) => {
    const subscription = Network.addNetworkStateListener((state) => {
      const reachable = state.isConnected === true && state.isInternetReachable !== false;
      setOnline(reachable);
    });
    return () => subscription.remove();
  });

  return () => {
    appStateSub.remove();
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 15,
      retry: (failureCount, error: unknown) => shouldRetry(failureCount, error, 1),
      retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 5000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
