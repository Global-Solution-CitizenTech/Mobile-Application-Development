import { useCallback } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { queryKeys } from '@/lib/queryKeys';
import { chamadoService } from '@/services/chamadoService';
import type { RecusaIaResponse } from '@/types/chamado';
import type { FiltroChamados } from '@/types/filters';
import { getApiErrorMessage } from '@/utils/apiError';

export function useChamadosList(filtros: FiltroChamados = {}, enabled = true) {
  const { usuario } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.chamados.list(filtros, usuario?.id),
    queryFn: () => chamadoService.listar(filtros),
    enabled: enabled && Boolean(usuario),
  });

  return {
    chamados: query.data?.content ?? [],
    pageInfo: query.data?.page ?? null,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useInfiniteChamadosList(filtros: Omit<FiltroChamados, 'page'> = {}, enabled = true) {
  const { usuario } = useAuth();

  const query = useInfiniteQuery({
    queryKey: queryKeys.chamados.infiniteList(filtros, usuario?.id),
    queryFn: ({ pageParam }) => chamadoService.listar({ ...filtros, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.page.number + 1;
      return next < lastPage.page.totalPages ? next : undefined;
    },
    enabled: enabled && Boolean(usuario),
  });

  const chamados = query.data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = query.data?.pages[0]?.page.totalElements ?? 0;

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
    queryKey: queryKeys.chamados.detail(id),
    queryFn: () => {
      if (!hasValidId) {
        throw new Error('ID de chamado inválido.');
      }
      return chamadoService.buscarPorId(id);
    },
    enabled: Boolean(usuario) && hasValidId,
  });

  return {
    chamado: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useCategoriasChamado() {
  const query = useQuery({
    queryKey: queryKeys.chamados.categorias(),
    queryFn: () => chamadoService.listarCategorias(),
    staleTime: 1000 * 60 * 30,
  });

  return {
    categorias: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useEstatisticasChamados() {
  const query = useQuery({
    queryKey: queryKeys.chamados.estatisticas(),
    queryFn: () => chamadoService.obterEstatisticas(),
  });

  return {
    estatisticas: query.data ?? null,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useRecusaRecente() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const key = queryKeys.chamados.recusa(usuario?.id);

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await chamadoService.obterRecusaRecente();
      if (res.motivo) return res;
      return queryClient.getQueryData<RecusaIaResponse>(key) ?? res;
    },
    enabled: Boolean(usuario),
    staleTime: 0,
  });

  const clear = useCallback(() => {
    queryClient.setQueryData<RecusaIaResponse>(key, { motivo: null });
  }, [key, queryClient]);

  return {
    motivo: query.data?.motivo ?? null,
    clear,
    refetch: query.refetch,
  };
}
