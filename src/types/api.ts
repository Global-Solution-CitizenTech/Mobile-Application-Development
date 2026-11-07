/**
 * Contratos de Resposta, Paginação (Spring Data JPA Pageable) e Erros da API Backend (Java / .NET)
 */

export interface FieldValidationError {
  campo?: string;
  field?: string;
  mensagem?: string;
  message?: string;
}

export interface ApiErrorResponse {
  status?: number;
  error?: string;
  message?: string;
  mensagem?: string;
  timestamp?: string;
  path?: string;
  erros?: FieldValidationError[];
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(code: string, message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export interface ActionCallbacks<TData = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

/**
 * Contrato padrão de paginação retornado pelo Spring Data JPA (`Page<T>`)
 */
export interface SpringPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
