/**
 * Definições de Tipos e Entidades de Domínio
 * CitizenTech - FIAP Global Solution 2026/2
 */

export type StatusChamado = 'Aberto' | 'Em Andamento' | 'Resolvido';

export type PrioridadeChamado = 'Baixa' | 'Média' | 'Alta' | 'Crítica';

export type CategoriaChamado =
  | 'Buraco na Rua'
  | 'Bueiro Entupido'
  | 'Iluminação Pública'
  | 'Entulho e Descarte Irregular'
  | 'Poda de Árvore'
  | 'Sinalização e Trânsito'
  | 'Vazamento de Água'
  | 'Outros';

export interface Localizacao {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  pontoReferencia?: string;
  latitude: number;
  longitude: number;
}

export interface HistoricoChamado {
  id: string;
  data: string;
  statusAnterior?: StatusChamado;
  novoStatus: StatusChamado;
  observacao: string;
  autorNome: string;
}

export interface Chamado {
  id: string;
  protocolo: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaChamado;
  status: StatusChamado;
  prioridade: PrioridadeChamado;
  apoiosCount: number;
  apoiadoPeloUsuario?: boolean;
  parecerIa?: string;
  orgaoResponsavel?: string;
  localizacao: Localizacao;
  fotoUrl?: string;
  dataAbertura: string;
  dataAtualizacao: string;
  autorId: string;
  autorNome: string;
  feedbackResolucao?: string;
  historico?: HistoricoChamado[];
}

export interface CreateChamadoDTO {
  titulo: string;
  descricao: string;
  categoria: CategoriaChamado;
  prioridade?: PrioridadeChamado;
  parecerIa?: string;
  orgaoResponsavel?: string;
  localizacao: Localizacao;
  fotoUrl?: string;
}

export interface UpdateChamadoDTO {
  titulo?: string;
  descricao?: string;
  categoria?: CategoriaChamado;
  prioridade?: PrioridadeChamado;
  localizacao?: Localizacao;
  status?: StatusChamado;
  feedbackResolucao?: string;
  fotoUrl?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  bairro: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  bairro: string;
}

export interface FiltroChamados {
  categoria?: CategoriaChamado | 'Todas';
  status?: StatusChamado | 'Todos';
  busca?: string;
  apenasMeus?: boolean;
}

export interface EstatisticasChamados {
  total: number;
  abertos: number;
  emAndamento: number;
  resolvidos: number;
  taxaResolucao: number;
}

export interface IntegranteGrupo {
  nome: string;
  rm: string;
  turma?: string;
  funcao: string;
  github?: string;
  linkedin?: string;
}
