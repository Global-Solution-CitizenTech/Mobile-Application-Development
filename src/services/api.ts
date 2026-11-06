/**
 * Cliente HTTP Axios Centralizado
 * Configurado com baseURL, interceptors de Bearer Token e tratamento global de erros
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storageService';

// URL base da API REST - Configurável via variável de ambiente ou fallback para nuvem/localhost
export const DEFAULT_API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://api-citizentech.fiap.com.br/api';

export const api = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Listener opcional para expiração de sessão (401)
type UnauthorizedCallback = () => void;
let onUnauthorizedCallback: UnauthorizedCallback | null = null;

export const registerUnauthorizedHandler = (callback: UnauthorizedCallback) => {
  onUnauthorizedCallback = callback;
};

/**
 * Request Interceptor: Injeta automaticamente o Bearer Token JWT do Storage em cada requisição
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await storageService.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Falha ao injetar token de autenticação:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Trata respostas e formata mensagens amigáveis de erro
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    if (!error.response) {
      // Erro de rede / servidor indisponível / timeout
      const networkError = new Error(
        'Não foi possível conectar ao servidor. Verifique sua conexão com a internet ou o endereço da API.'
      );
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
    }

    const status = error.response.status;
    const responseData = error.response.data;

    // Se o token expirou ou é inválido
    if (status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
      const unauthorizedError = new Error(
        responseData?.message || 'Sua sessão expirou. Faça login novamente para continuar.'
      );
      return Promise.reject(unauthorizedError);
    }

    // Erros 400, 403, 404, 500
    const message =
      responseData?.message ||
      responseData?.error ||
      `Erro no servidor (${status}). Tente novamente mais tarde.`;

    const customError = new Error(message);
    (customError as any).status = status;
    return Promise.reject(customError);
  }
);

