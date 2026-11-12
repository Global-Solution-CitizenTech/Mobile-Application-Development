import { api } from '@/services/api';
import type { LoginCredentials, LoginResponse, Usuario, UsuarioRequest } from '@/types/auth';
import { buildEnderecoRequest } from '@/utils/chamadoMappers';
import { splitPhoneDigits } from '@/utils/formatters';

export interface UsuarioFormInput {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  rua?: string;
  numero: string;
  referencia: string;
  senha: string;
}

export function buildUsuarioRequest(input: UsuarioFormInput): UsuarioRequest {
  const { ddd, numeroTelefone } = splitPhoneDigits(input.telefone);
  return {
    nome: input.nome.trim(),
    email: input.email.trim().toLowerCase(),
    senha: input.senha,
    ddd,
    numeroTelefone,
    endereco: buildEnderecoRequest(input),
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/login', {
      email: credentials.email.trim().toLowerCase(),
      senha: credentials.senha,
    });
    return data;
  },

  async register(payload: UsuarioRequest): Promise<Usuario> {
    const { data } = await api.post<Usuario>('/usuarios', payload);
    return data;
  },

  async getMe(): Promise<Usuario> {
    const { data } = await api.get<Usuario>('/usuarios/me');
    return data;
  },

  async updateProfile(payload: UsuarioRequest): Promise<{ usuario: Usuario; novoToken?: string }> {
    const response = await api.put<Usuario>('/usuarios/me', payload);
    const headerToken = response.headers['x-novo-token'];
    const novoToken = typeof headerToken === 'string' && headerToken.trim() ? headerToken.trim() : undefined;
    return { usuario: response.data, novoToken };
  },
};
