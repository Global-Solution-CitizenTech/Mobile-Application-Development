export interface SpringPageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface SpringPageResponse<T> {
  content: T[];
  page: SpringPageInfo;
}

export interface ApiFieldError {
  campo?: string;
  mensagem?: string;
  field?: string;
  message?: string;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  mensagem?: string;
  path?: string;
  erros?: ApiFieldError[];
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export interface ActionCallbacks<TData = void> {
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}
