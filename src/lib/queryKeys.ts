import type { FiltroChamados } from '@/types/filters';

export const queryKeys = {
  chamados: {
    all: ['chamados'] as const,
    lists: () => ['chamados', 'list'] as const,
    list: (filtros: FiltroChamados, usuarioId?: number | null) =>
      ['chamados', 'list', { filtros, usuarioId: usuarioId ?? null }] as const,
    infiniteList: (filtros: FiltroChamados, usuarioId?: number | null) =>
      ['chamados', 'list', 'infinite', { filtros, usuarioId: usuarioId ?? null }] as const,
    detail: (id?: number | null) => ['chamados', 'detail', id ?? null] as const,
    estatisticas: () => ['chamados', 'estatisticas'] as const,
    recusa: (usuarioId?: number | null) => ['chamados', 'recusa', usuarioId ?? null] as const,
    categorias: () => ['chamados', 'categorias'] as const,
  },
  ai: {
    insights: (bairro?: string | null) => ['ai', 'insights', bairro?.trim() || 'geral'] as const,
    sessions: () => ['ai', 'sessions'] as const,
  },
} as const;
