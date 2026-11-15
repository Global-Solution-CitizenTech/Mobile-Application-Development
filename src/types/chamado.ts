import type { InfiniteData } from '@tanstack/react-query';
import type { SpringPageResponse } from '@/types/api';
import type { StatusChamado } from '@/types/categoria';
import type { EnderecoRequest, EnderecoResponse } from '@/types/endereco';
import type { ChamadoFormData } from '@/types/form';

export interface HistoricoChamado {
  id: number;
  data: string;
  status: StatusChamado;
  observacao: string;
  autorNome: string;
}

export interface ChamadoResponse {
  idChamado: number;
  titulo: string;
  descricao: string;
  dtAbertura: string;
  categoriaId: number;
  categoriaNome: string;
  prioridadeId: number;
  prioridadeNome: string;
  orgaoId: number;
  orgaoNome: string;
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
}

export interface FotoUpload {
  uri: string;
  name: string;
  type: string;
}

export interface ChamadoCreateRequest {
  endereco: EnderecoRequest;
  foto: FotoUpload;
}

export interface ChamadoRequest {
  titulo: string;
  descricao: string;
  categoria: string;
  endereco: EnderecoRequest;
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

export type ChamadoFormState = ChamadoFormData & { foto?: FotoUpload };

export type UseChamadoFormOptions =
  | { mode: 'create' }
  | { mode: 'edit'; chamadoId: number };

export type ChamadoListCache =
  | SpringPageResponse<Chamado>
  | InfiniteData<SpringPageResponse<Chamado>>
  | undefined;
