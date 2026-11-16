/**
 * Cliente HTTP Axios centralizado.
 * Integra com o backend Java (Spring Boot zelafix-api), injeta o JWT
 * automaticamente e normaliza todos os erros da API.
 */

import { AxiosError, create } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { storageService } from '@/services/storageService';
import type { ApiErrorResponse, UnauthorizedCallback } from '@/types/api';
import { normalizeHttpError } from '@/utils/apiError';

export function createThrottledPing(
  action: () => Promise<unknown>,
  cooldownMs = 10 * 60 * 1000
): () => Promise<boolean> {
  let inFlight: Promise<boolean> | null = null;
  let lastTimestamp = 0;

  return async (): Promise<boolean> => {
    const now = Date.now();
    if (now - lastTimestamp < cooldownMs) return true;
    if (inFlight) return inFlight;

    inFlight = (async () => {
      try {
        await action();
        lastTimestamp = Date.now();
        return true;
      } catch {
        return false;
      } finally {
        inFlight = null;
      }
    })();

    return inFlight;
  };
}

export const api: AxiosInstance = create({
  baseURL: env.apiUrl,
  timeout: 65000, // 65s para cobrir o timeout assíncrono do Spring Boot (60s) e cold starts
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let onUnauthorizedCallback: UnauthorizedCallback | null = null;
let unauthorizedHandlingPromise: Promise<void> | null = null;

function handleUnauthorizedSession(): Promise<void> {
  if (!unauthorizedHandlingPromise) {
    unauthorizedHandlingPromise = (async () => {
      try {
        await storageService.clearSession().catch(() => undefined);
        onUnauthorizedCallback?.();
      } finally {
        unauthorizedHandlingPromise = null;
      }
    })();
  }
  return unauthorizedHandlingPromise;
}

export function registerUnauthorizedHandler(callback: UnauthorizedCallback): () => void {
  onUnauthorizedCallback = callback;
  return () => {
    if (onUnauthorizedCallback === callback) {
      onUnauthorizedCallback = null;
    }
  };
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData && config.headers) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete config.headers['Content-Type'];
      }
    }
    try {
      const token = await storageService.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Falha silenciosa ao recuperar token do storage
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? 0;
    const isLoginAttempt = error.config?.url?.includes('/login') ?? false;

    if (status === 401 && !isLoginAttempt) {
      await handleUnauthorizedSession();
    }

    return Promise.reject(normalizeHttpError(error));
  }
);

const pingAzureHealth = createThrottledPing(async () => {
  await api.get('/actuator/health', {
    timeout: 20000,
    headers: { 'X-Warmup-Ping': 'true' },
  });
});

export const HttpService = {
  /**
   * Dispara ping com throttling e deduplicação para /actuator/health do Azure App Service
   * evitando cold starts nas ações subsequentes do cidadão.
   */
  warmup: pingAzureHealth,
};
