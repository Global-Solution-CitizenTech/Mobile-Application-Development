import { FiltroChamados } from '../types';

/**
 * Fábrica centralizada de Query Keys do TanStack Query (Padrão Challenge_Clyvo_4)
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },
  chamados: {
    all: ['chamados'] as const,
    list: (filtros?: FiltroChamados, usuarioId?: string) =>
      [
        'chamados',
        'list',
        filtros?.categoria ?? 'Todas',
        filtros?.status ?? 'Todos',
        filtros?.busca ?? '',
        Boolean(filtros?.apenasMeus),
        usuarioId ?? 'anon',
      ] as const,
    detail: (id?: string) => ['chamados', 'detail', id ?? ''] as const,
  },
};
