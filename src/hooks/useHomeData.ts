import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChamadosList, useEstatisticasChamados } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';

export function useHomeData() {
  const { usuario } = useAuth();
  const statsQuery = useEstatisticasChamados();
  const recentQuery = useChamadosList({ page: 0, size: 3, sort: 'dtAbertura,desc' });
  const { apoiarChamado, isSupportingId } = useChamadoMutations();

  const estatisticas = statsQuery.estatisticas;
  const taxaResolucao =
    !estatisticas || estatisticas.total <= 0
      ? 0
      : Math.round((estatisticas.resolvidos / estatisticas.total) * 100);

  const onRefresh = useCallback(async () => {
    await Promise.all([statsQuery.refetch(), recentQuery.refetch()]);
  }, [recentQuery, statsQuery]);

  return {
    usuario,
    estatisticas,
    taxaResolucao,
    chamadosRecentes: recentQuery.chamados,
    categorias: CATEGORIA_CATALOG,
    isLoading: statsQuery.isLoading || recentQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    isLoadingRecent: recentQuery.isLoading,
    isRefreshing: statsQuery.isRefetching || recentQuery.isRefetching,
    statsError: statsQuery.error,
    recentError: recentQuery.error,
    error: statsQuery.error || recentQuery.error,
    onRefresh,
    apoiarChamado,
    isSupportingId,
  };
}
