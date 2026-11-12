/**
 * Cliente HTTP Axios Centralizado (Padrão Challenge_Clyvo_4)
 * Configurado para integrar com o Backend Java (Spring Boot zelafix-api)
 * com injeção automática de token JWT, normalização de erros e timeout tolerante.
 */

import { create as createAxios, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageService } from '@/services/storageService';
import { env } from '@/config/env';
import { ApiErrorResponse } from '@/types/api';
import { normalizeHttpError } from '@/utils/apiError';

export const DEFAULT_API_URL = env.apiUrl;

export function createThrottledPing(
  action: () => Promise<unknown>,
  cooldownMs = 10 * 60 * 1000
): () => Promise<boolean> {
  let inFlight: Promise<boolean> | null = null;
  let lastTimestamp = 0;

  return async (): Promise<boolean> => {
    const now = Date.now();

    if (now - lastTimestamp < cooldownMs) {
      return true;
    }

    if (inFlight) {
      return inFlight;
    }

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

export const buildApiAssetUrl = (path?: string | null): string | undefined => {
  if (!path || path.trim() === '') return undefined;
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = (api.defaults.baseURL || env.apiUrl).replace(/\/+$/, '');
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${normalizedPath}`;
};

export const api = createAxios({
  baseURL: env.apiUrl,
  timeout: 40000, // 40s para tolerar cold starts no Azure App Service e upload de imagens Base64
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

type UnauthorizedCallback = () => void;
let onUnauthorizedCallback: UnauthorizedCallback | null = null;

export const registerUnauthorizedHandler = (callback: UnauthorizedCallback) => {
  onUnauthorizedCallback = callback;
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
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
      await storageService.clearSession().catch(() => undefined);
      onUnauthorizedCallback?.();
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
