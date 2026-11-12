export type CargoUsuario = 'CIDADAO' | 'GESTOR' | 'ADMIN';

export interface EnderecoRequest {
  cep: string;
  numero: string;
  referencia: string;
  rua?: string;
}

export interface EnderecoResponse {
  id: number;
  cep: string;
  numero: string;
  rua: string;
  referencia: string;
  bairro: string;
  cidade: string;
  estado: string;
}

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

export type RegisterData = UsuarioRequest;
export type UpdateProfilePayload = UsuarioRequest;
