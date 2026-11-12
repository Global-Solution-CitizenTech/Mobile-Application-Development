import type { FiltroChamados } from '@/types/chamado';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => ['auth', 'me'] as const,
  },
  chamados: {
    all: ['chamados'] as const,
    lists: () => ['chamados', 'list'] as const,
    list: (filtros: FiltroChamados, usuarioId?: number | null) => ['chamados', 'list', { filtros, usuarioId: usuarioId ?? null }] as const,
    details: () => ['chamados', 'detail'] as const,
    detail: (id?: number | null) => ['chamados', 'detail', id ?? null] as const,
    estatisticas: () => ['chamados', 'estatisticas'] as const,
    categorias: () => ['chamados', 'categorias'] as const,
  },
  ai: {
    all: ['ai'] as const,
    insights: (bairro?: string | null) => ['ai', 'insights', bairro?.trim() || 'geral'] as const,
    sessions: () => ['ai', 'sessions'] as const,
  },
};
