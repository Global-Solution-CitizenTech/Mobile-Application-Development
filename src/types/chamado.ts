import type { InfiniteData } from '@tanstack/react-query';
import type { SpringPageResponse } from '@/types/api';
import type { CategoriaResponse, StatusChamado } from '@/types/categoria';
import type { EnderecoRequest, EnderecoResponse, LocalizacaoCapturada } from '@/types/endereco';
import type {
  ChamadoCreateFormData,
  EditarChamadoFormData,
  FieldBinder,
  FormErrors,
} from '@/types/form';

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

export interface ReactNativeFormFile {
  uri: string;
  name: string;
  type: string;
}

export interface ReactNativeMultipartFormData {
  append(name: string, value: string | ReactNativeFormFile): void;
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

export type NovoChamadoFormState = Omit<ChamadoCreateFormData, 'foto'> & {
  foto?: FotoUpload;
};

export interface UseNovoChamadoFormReturn {
  values: NovoChamadoFormState;
  errors: FormErrors<ChamadoCreateFormData>;
  setFieldValue: <K extends keyof NovoChamadoFormState>(
    field: K,
    value: NovoChamadoFormState[K]
  ) => void;
  field: FieldBinder<NovoChamadoFormState>;
  submitting: boolean;
  capturandoGps: boolean;
  erroGps: string | null;
  localizacaoPreview: LocalizacaoCapturada | null;
  localizacaoResumo: string | null;
  handleUsarGps: () => Promise<void>;
  resetForm: () => void;
  submit: (onSuccess: (chamado: Chamado) => void) => void;
}

export interface UseEditarChamadoFormReturn {
  values: EditarChamadoFormData;
  errors: FormErrors<EditarChamadoFormData>;
  setFieldValue: <K extends keyof EditarChamadoFormData>(
    field: K,
    value: EditarChamadoFormData[K]
  ) => void;
  field: FieldBinder<EditarChamadoFormData>;
  categorias: readonly CategoriaResponse[];
  loadingChamado: boolean;
  loadError: string | null;
  submitting: boolean;
  capturandoGps: boolean;
  erroGps: string | null;
  localizacaoPreview: LocalizacaoCapturada | null;
  localizacaoResumo: string | null;
  handleUsarGps: () => Promise<void>;
  submit: (onSuccess: (chamado: Chamado) => void) => void;
}

export interface UseImageEvidencePickerOptions {
  onChangeFoto: (foto?: FotoUpload) => void;
  maxBytes?: number;
}

export interface UseImageEvidencePickerReturn {
  processing: 'camera' | 'library' | null;
  pickFromCamera: () => Promise<void>;
  pickFromLibrary: () => Promise<void>;
  removeFoto: () => void;
}

export type ChamadoListCache =
  | SpringPageResponse<Chamado>
  | InfiniteData<SpringPageResponse<Chamado>>
  | undefined;
