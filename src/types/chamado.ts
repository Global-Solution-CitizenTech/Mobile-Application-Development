import type { StatusChamado } from '@/types/categoria';
import type { EnderecoRequest, EnderecoResponse } from '@/types/endereco';

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

export interface ChamadoTriagemRequest {
  titulo?: string;
  descricao?: string;
  bairro?: string;
  fotoBase64: string;
}

export interface ChamadoTriagemPreview {
  categoriaId: number;
  categoriaNome: string;
  prioridade: string;
  orgaoResponsavel: string;
  parecerIa: string;
}

export interface ChamadoStatusRequest {
  status: StatusChamado;
  observacao: string;
}

export interface EstatisticasChamados {
  total: number;
  abertos: number;
  emAndamento: number;
  resolvidos: number;
  rejeitados: number;
  totalApoios: number;
}
