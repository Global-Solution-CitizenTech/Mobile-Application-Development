import type { EnderecoRequest, EnderecoResponse } from '@/types/auth';
import type { StatusChamado } from '@/types/categoria';

export interface HistoricoChamado {
  id: number;
  data: string;
  status: StatusChamado;
  observacao: string;
  autorNome: string;
}

export interface TriagemIa {
  prioridade: string;
  orgao: string;
  parecer: string;
}

export interface ChamadoResponse {
  idChamado: number;
  titulo: string;
  descricao: string;
  dtAbertura: string;
  categoriaId: number;
  categoriaNome: string;
  usuarioId: number;
  usuarioNome: string;
  endereco: EnderecoResponse;
  foto: string | null;
  status: StatusChamado;
  totalVotos: number;
  apoiadoPorMim: boolean;
  historico: HistoricoChamado[];
}

export interface Chamado extends Omit<ChamadoResponse, 'foto'> {
  fotoUrl?: string;
  triagemIa?: TriagemIa;
}

export interface ChamadoRequest {
  titulo: string;
  descricao: string;
  categoriaId: number;
  endereco: EnderecoRequest;
  fotoBase64?: string;
}

export interface ChamadoStatusRequest {
  status: StatusChamado;
  observacao: string;
}

export interface FiltroChamados {
  status?: StatusChamado;
  categoria?: string;
  busca?: string;
  apenasMeus?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface EstatisticasChamados {
  total: number;
  abertos: number;
  emAndamento: number;
  resolvidos: number;
  rejeitados: number;
  totalApoios: number;
}
