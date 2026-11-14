import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { queryKeys } from '@/lib/queryKeys';
import { chamadoService } from '@/services/chamadoService';
import type { Chamado } from '@/types/chamado';
import type { FiltroChamados } from '@/types/filters';
import { getApiErrorMessage } from '@/utils/apiError';

const EMPTY_CHAMADOS: Chamado[] = [];

export const chamadoQueries = {
  list: (filtros: FiltroChamados, usuarioId?: number | null) =>
    queryOptions({
      queryKey: queryKeys.chamados.list(filtros, usuarioId),
      queryFn: () => chamadoService.listar(filtros),
    }),

  infiniteList: (filtros: Omit<FiltroChamados, 'page'>, usuarioId?: number | null) =>
    infiniteQueryOptions({
      queryKey: queryKeys.chamados.infiniteList(filtros, usuarioId),
      queryFn: ({ pageParam }) => chamadoService.listar({ ...filtros, page: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const next = lastPage.page.number + 1;
        return next < lastPage.page.totalPages ? next : undefined;
      },
    }),

  detail: (id?: number) => {
    const hasValidId = typeof id === 'number' && id > 0;
    return queryOptions({
      queryKey: queryKeys.chamados.detail(id),
      queryFn: () => {
        if (!hasValidId) throw new Error('ID de chamado inválido.');
        return chamadoService.buscarPorId(id);
      },
    });
  },

  estatisticas: () =>
    queryOptions({
      queryKey: queryKeys.chamados.estatisticas(),
      queryFn: () => chamadoService.obterEstatisticas(),
    }),
};

export function useChamadosList(filtros: FiltroChamados = {}, enabled = true) {
  const { usuario } = useAuth();

  const query = useQuery({
    ...chamadoQueries.list(filtros, usuario?.id),
    enabled: enabled && Boolean(usuario),
  });

  return {
    chamados: query.data?.content ?? EMPTY_CHAMADOS,
    pageInfo: query.data?.page ?? null,
    totalElements: query.data?.page.totalElements ?? 0,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useInfiniteChamadosList(filtros: Omit<FiltroChamados, 'page'> = {}, enabled = true) {
  const { usuario } = useAuth();

  const query = useInfiniteQuery({
    ...chamadoQueries.infiniteList(filtros, usuario?.id),
    enabled: enabled && Boolean(usuario),
  });

  const pages = query.data?.pages;
  const chamados = pages ? pages.flatMap((page) => page.content) : EMPTY_CHAMADOS;
  const totalElements = pages?.[0]?.page.totalElements ?? 0;

  return {
    chamados,
    totalElements,
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching && !query.isFetchingNextPage,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useChamadoDetail(id?: number) {
  const { usuario } = useAuth();
  const hasValidId = typeof id === 'number' && id > 0;

  const query = useQuery({
    ...chamadoQueries.detail(id),
    enabled: Boolean(usuario) && hasValidId,
  });

  return {
    chamado: query.data ?? null,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useEstatisticasChamados() {
  const query = useQuery(chamadoQueries.estatisticas());

  return {
    estatisticas: query.data ?? null,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}
