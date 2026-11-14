import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '../src/types/api.ts';
import {
  ApiError,
  getApiErrorMessage,
  getAuthErrorMessage,
  normalizeHttpError,
} from '../src/utils/apiError.ts';

function makeAxiosError(params: {
  status?: number;
  data?: ApiErrorResponse;
  code?: string;
  message?: string;
}): AxiosError<ApiErrorResponse> {
  const response =
    params.status !== undefined
      ? ({
          status: params.status,
          data: params.data ?? {},
          statusText: '',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        } as AxiosResponse<ApiErrorResponse>)
      : undefined;

  return new AxiosError<ApiErrorResponse>(
    params.message ?? 'Request failed',
    params.code,
    {} as InternalAxiosRequestConfig,
    undefined,
    response
  );
}

describe('apiError', () => {
  it('formats Spring Bean Validation campo/mensagem arrays', () => {
    const err = makeAxiosError({
      status: 400,
      data: {
        erros: [
          { campo: 'titulo', mensagem: 'O título é obrigatório.' },
          { campo: 'cep', mensagem: 'CEP inválido.' },
        ],
      },
    });

    const normalized = normalizeHttpError(err);
    assert.equal(normalized.status, 400);
    assert.equal(normalized.code, 'VALIDATION_ERROR');
    assert.equal(normalized.message, 'titulo: O título é obrigatório.\ncep: CEP inválido.');
  });

  it('prefers explicit backend message from Spring Boot or detail from FastAPI', () => {
    const springErr = makeAxiosError({
      status: 404,
      data: { error: 'Not Found', message: 'Chamado #99 não encontrado.' },
    });

    const normalizedSpring = normalizeHttpError(springErr);
    assert.equal(normalizedSpring.status, 404);
    assert.equal(normalizedSpring.message, 'Chamado #99 não encontrado.');

    const fastApiErr = makeAxiosError({
      status: 503,
      data: { detail: 'Chave GROQ_API_KEY ausente na configuração do servidor.' },
    });

    const normalizedFastApi = normalizeHttpError(fastApiErr);
    assert.equal(normalizedFastApi.status, 503);
    assert.equal(
      normalizedFastApi.message,
      'Chave GROQ_API_KEY ausente na configuração do servidor.'
    );
  });

  it('maps gateway cold start and empty-body HTTP statuses', () => {
    const coldStart = normalizeHttpError(makeAxiosError({ status: 502 }));
    assert.equal(coldStart.code, 'SERVER_STARTING');
    assert.equal(coldStart.status, 502);
    assert.match(coldStart.message, /inicializando/);

    const authErr = makeAxiosError({ status: 401 });
    assert.equal(getAuthErrorMessage(authErr), 'E-mail ou senha incorretos.');
    assert.equal(normalizeHttpError(authErr).code, 'UNAUTHORIZED');
  });

  it('handles timeout, network failure, and plain ApiError instances', () => {
    const timeout = normalizeHttpError(
      makeAxiosError({ code: 'ECONNABORTED', message: 'timeout of 40000ms exceeded' })
    );
    assert.equal(timeout.code, 'TIMEOUT');
    assert.equal(timeout.status, 408);

    const network = normalizeHttpError(makeAxiosError({ code: 'ERR_NETWORK' }));
    assert.equal(network.code, 'NETWORK_ERROR');
    assert.equal(network.status, 0);

    const existing = new ApiError('CUSTOM', 'Erro customizado', 409);
    assert.equal(getApiErrorMessage(existing), 'Erro customizado');
  });
});
