import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoriasChamado, useChamadosList, useEstatisticasChamados } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';

export function useHomeData() {
  const { usuario } = useAuth();
  const statsQuery = useEstatisticasChamados();
  const recentQuery = useChamadosList({ page: 0, size: 5, sort: 'dtAbertura,desc' });
  const categoriasQuery = useCategoriasChamado();
  const { apoiarChamado } = useChamadoMutations();

  const estatisticas = statsQuery.estatisticas;

  const taxaResolucao = useMemo(() => {
    if (!estatisticas || estatisticas.total <= 0) return 0;
    return Math.round((estatisticas.resolvidos / estatisticas.total) * 100);
  }, [estatisticas]);

  const onRefresh = useCallback(async () => {
    await Promise.all([statsQuery.refetch(), recentQuery.refetch(), categoriasQuery.refetch()]);
  }, [categoriasQuery, recentQuery, statsQuery]);

  return {
    usuario,
    estatisticas,
    taxaResolucao,
    chamadosRecentes: recentQuery.chamados,
    categorias: categoriasQuery.categorias,
    isLoading: statsQuery.isLoading || recentQuery.isLoading,
    isRefreshing: statsQuery.isRefetching || recentQuery.isRefetching,
    error: statsQuery.error || recentQuery.error,
    onRefresh,
    apoiarChamado,
  };
}
