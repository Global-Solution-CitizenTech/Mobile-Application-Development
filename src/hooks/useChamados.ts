import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { queryKeys } from '@/lib/queryKeys';
import { chamadoService } from '@/services/chamadoService';
import type { Chamado } from '@/types/chamado';
import type { FiltroChamados } from '@/types/filters';
import { getApiErrorMessage } from '@/utils/apiError';

const EMPTY_CHAMADOS: Chamado[] = [];

function isValidChamadoId(id?: number): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0;
}

const chamadoQueries = {
  list: (filtros: FiltroChamados, usuarioId?: number | null) =>
    queryOptions({
      queryKey: queryKeys.chamados.list(filtros, usuarioId),
      queryFn: ({ signal }) => chamadoService.listar(filtros, signal),
    }),

  infiniteList: (filtros: Omit<FiltroChamados, 'page'>, usuarioId?: number | null) =>
    infiniteQueryOptions({
      queryKey: queryKeys.chamados.infiniteList(filtros, usuarioId),
      queryFn: ({ pageParam, signal }) =>
        chamadoService.listar({ ...filtros, page: pageParam }, signal),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const currentPage = lastPage.page?.number;
        const totalPages = lastPage.page?.totalPages;
        if (typeof currentPage !== 'number' || typeof totalPages !== 'number') {
          return undefined;
        }
        const next = currentPage + 1;
        return next < totalPages ? next : undefined;
      },
    }),

  detail: (id?: number) => {
    const validId = isValidChamadoId(id);
    return queryOptions({
      queryKey: queryKeys.chamados.detail(id),
      queryFn: ({ signal }) => {
        if (!validId) throw new Error('ID de chamado inválido.');
        return chamadoService.buscarPorId(id, signal);
      },
    });
  },

  estatisticas: () =>
    queryOptions({
      queryKey: queryKeys.chamados.estatisticas(),
      queryFn: ({ signal }) => chamadoService.obterEstatisticas(signal),
    }),
};

export function useChamadosList(filtros: FiltroChamados = {}, enabled = true) {
  const { usuario } = useAuth();

  const query = useQuery({
    ...chamadoQueries.list(filtros, usuario?.id),
    enabled: enabled && Boolean(usuario),
  });

  const chamados = query.data?.content ?? EMPTY_CHAMADOS;
  return {
    chamados,
    pageInfo: query.data?.page ?? null,
    totalElements: query.data?.page?.totalElements ?? chamados.length,
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
  const chamados = pages ? pages.flatMap((page) => page.content ?? EMPTY_CHAMADOS) : EMPTY_CHAMADOS;
  const totalElements = pages?.[0]?.page?.totalElements ?? chamados.length;

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
  const hasValidId = isValidChamadoId(id);

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
  const { usuario } = useAuth();

  const query = useQuery({
    ...chamadoQueries.estatisticas(),
    enabled: Boolean(usuario),
  });

  return {
    estatisticas: query.data ?? null,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}
