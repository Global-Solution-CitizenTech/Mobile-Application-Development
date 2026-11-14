export type StatusChamado = 'PENDENTE' | 'EM_ANALISE' | 'EM_EXECUCAO' | 'CONCLUIDO' | 'REJEITADO';

export interface CategoriaResponse {
  id: number;
  nome: string;
}
