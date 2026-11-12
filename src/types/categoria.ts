export type StatusChamado = 'PENDENTE' | 'ABERTO' | 'EM_ANALISE' | 'EM_EXECUCAO' | 'CONCLUIDO' | 'REJEITADO';

export type CategoriaChamado = string;

export interface CategoriaResponse {
  id: number;
  nome: string;
}

export interface StatusResponse {
  id: number;
  nome: StatusChamado;
}
