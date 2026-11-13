import type { StatusChamado } from '@/types/categoria';

export interface FiltroChamados {
  status?: StatusChamado;
  categoria?: string;
  busca?: string;
  apenasMeus?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export type MeusChamadosTab = 'TODOS' | 'ATIVOS' | 'CONCLUIDOS';

export type RadarSortOption = 'RECENTES' | 'MAIS_APOIADOS';

export type StatusFiltro = StatusChamado | 'TODOS';

export type LocationFilterLevel = 'CIDADE' | 'BAIRRO' | 'ESTADO';

export interface RadarLocationFilter {
  nivel: LocationFilterLevel;
  valor: string | null;
}

export interface RadarLocationPreference extends RadarLocationFilter {
  userId: number;
  userCity: string;
}

export interface SelectPickerOption<T extends string = string> {
  value: T;
  label: string;
  subtitle?: string;
}
