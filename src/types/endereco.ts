export interface EnderecoFormInput {
  cep: string;
  numero: string;
  referencia: string;
  rua?: string;
}

export type EnderecoRequest = EnderecoFormInput;

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

export type EnderecoResumo = Partial<Pick<EnderecoResponse, 'bairro' | 'cidade' | 'rua' | 'referencia'>>;

export interface LocalizacaoCapturada {
  cep: string;
  rua: string;
  numero: string;
  referencia: string;
  bairro: string;
  cidade: string;
}
