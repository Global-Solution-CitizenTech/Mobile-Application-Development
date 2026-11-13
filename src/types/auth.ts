import type { EnderecoFormInput, EnderecoRequest, EnderecoResponse } from '@/types/endereco';

export type CargoUsuario = 'CIDADAO' | 'GESTOR' | 'ADMIN';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: CargoUsuario;
  ddd: string;
  numeroTelefone: string;
  endereco: EnderecoResponse;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  ddd: string;
  numeroTelefone: string;
  endereco: EnderecoRequest;
}

export interface UsuarioFormInput extends EnderecoFormInput {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface AuthContextData {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: UsuarioRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UsuarioRequest) => Promise<Usuario>;
}
