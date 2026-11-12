import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { queryKeys } from '@/lib/queryKeys';
import { chamadoService } from '@/services/chamadoService';
import type { FiltroChamados } from '@/types/chamado';
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
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useChamadoDetail(id?: number) {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.chamados.detail(id),
    queryFn: () => chamadoService.buscarPorId(id as number),
    enabled: Boolean(usuario) && typeof id === 'number' && id > 0,
  });

  const prefetchChamado = useCallback(
    (chamadoId: number) => {
      if (!usuario) return;
      void queryClient.prefetchQuery({
        queryKey: queryKeys.chamados.detail(chamadoId),
        queryFn: () => chamadoService.buscarPorId(chamadoId),
      });
    },
    [queryClient, usuario]
  );

  return {
    chamado: query.data ?? null,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error ? getApiErrorMessage(query.error) : null,
    refetch: query.refetch,
    prefetchChamado,
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
