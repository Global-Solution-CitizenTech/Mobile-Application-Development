import { AxiosError, isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

function normalizeAxiosError(axiosError: AxiosError<ApiErrorResponse>): ApiError {
  const status = axiosError.response?.status ?? 0;
  const data = axiosError.response?.data;

  // 1. Erros de validação do Spring Boot (GlobalExceptionHandler.ValidationErrorDetail)
  if (data?.erros && Array.isArray(data.erros) && data.erros.length > 0) {
    const validationMessage = data.erros
      .map((e) => (e.campo ? `${e.campo}: ${e.mensagem}` : e.mensagem))
      .join('\n');
    return new ApiError(data.error ?? 'VALIDATION_ERROR', validationMessage, status);
  }

  // 2. Mensagem explícita do Spring Boot (@RestControllerAdvice) ou FastAPI (detail)
  const customMessage =
    (typeof data?.message === 'string' && data.message.trim()) ||
    (typeof data?.detail === 'string' && data.detail.trim()) ||
    undefined;
  if (customMessage) {
    return new ApiError(data?.error ?? 'API_ERROR', customMessage, status);
  }

  // 3. Fallbacks por status HTTP canônicos
  if (status === 401) {
    return new ApiError(
      'UNAUTHORIZED',
      'Sessão expirada ou credenciais inválidas. Faça login novamente.',
      401
    );
  }

  if (status === 403) {
    return new ApiError('FORBIDDEN', 'Você não possui permissão para realizar esta ação.', 403);
  }

  if (status === 404) {
    return new ApiError('NOT_FOUND', 'Ocorrência ou recurso não encontrado no servidor.', 404);
  }

  if (status === 429) {
    return new ApiError(
      'RATE_LIMITED',
      'Muitas solicitações simultâneas. Aguarde alguns segundos e tente novamente.',
      429
    );
  }

  if (status === 502 || status === 503 || status === 504) {
    return new ApiError(
      'SERVER_STARTING',
      'O servidor em nuvem está inicializando. Aguarde alguns instantes e tente novamente.',
      status
    );
  }

  if (status >= 500) {
    return new ApiError(
      'INTERNAL_SERVER_ERROR',
      'Servidor temporariamente indisponível. Tente novamente mais tarde.',
      status
    );
  }

  if (
    axiosError.code === 'ECONNABORTED' ||
    axiosError.code === 'ETIMEDOUT' ||
    axiosError.message?.toLowerCase().includes('timeout')
  ) {
    return new ApiError(
      'TIMEOUT',
      'O servidor demorou para responder. Verifique sua conexão e tente novamente.',
      status || 408
    );
  }

  if (!axiosError.response || axiosError.code === 'ERR_NETWORK') {
    return new ApiError('NETWORK_ERROR', 'Sem conexão direta com o servidor backend.', 0);
  }

  return new ApiError(
    axiosError.code ?? 'HTTP_ERROR',
    axiosError.message || 'Ocorreu um erro ao processar a requisição.',
    status
  );
}

/**
 * Normaliza qualquer erro (AxiosError, ApiError, Error nativo ou desconhecido)
 * em uma instância canônica de ApiError com código semântico, status HTTP e mensagem amigável.
 */
export function normalizeHttpError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (isAxiosError<ApiErrorResponse>(error)) {
    return normalizeAxiosError(error);
  }

  if (error instanceof Error && error.message) {
    return new ApiError('UNKNOWN_ERROR', error.message, 0);
  }

  return new ApiError('UNKNOWN_ERROR', 'Ocorreu um erro ao processar a requisição.', 0);
}

export function getApiErrorMessage(
  error: unknown,
  defaultMessage = 'Ocorreu um erro ao processar a requisição.'
): string {
  const normalized = normalizeHttpError(error);
  return normalized.message.trim() || defaultMessage;
}

export function getAuthErrorMessage(
  error: unknown,
  defaultMessage = 'Falha na autenticação. Verifique suas credenciais.'
): string {
  const normalized = normalizeHttpError(error);
  if (normalized.status === 401) {
    return 'E-mail ou senha incorretos.';
  }
  return normalized.message.trim() || defaultMessage;
}
