interface SpringPageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface SpringPageResponse<T> {
  content: T[];
  page: SpringPageInfo;
}

interface ApiFieldError {
  campo: string;
  mensagem: string;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  detail?: string;
  path?: string;
  erros?: ApiFieldError[];
}

export interface ActionCallbacks<TData = void> {
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}
