/**
 * Cliente HTTP Axios Centralizado (Padrão Challenge_Clyvo_4)
 * Configurado para integrar com o Backend Java (Spring Boot + Spring Security JWT + Spring AI)
 * e .NET Minimal API, com normalização de erros e health-check warmup.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storageService';
import { env } from '../config/env';
import { ApiErrorResponse } from '../types/api';
import { normalizeHttpError } from '../utils/apiError';

export const DEFAULT_API_URL = env.apiUrl;

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 4500,
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

    if (status === 401) {
      try {
        await storageService.clearSession();
      } catch {
        // ignore
      }
      onUnauthorizedCallback?.();
    }

    return Promise.reject(normalizeHttpError(error));
  }
);

export const HttpService = {
  /**
   * Dispara ping assíncrono para o endpoint de saúde do Spring Boot (/actuator/health)
   * ou .NET (/health) para aquecer a instância em nuvem quando disponível.
   */
  async warmup(): Promise<boolean> {
    try {
      await api.get('/actuator/health', {
        timeout: 2500,
        headers: { 'X-Warmup-Ping': 'true' },
      });
      return true;
    } catch {
      return false;
    }
  },
};
