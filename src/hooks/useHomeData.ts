import { useAuth } from '@/contexts/AuthContext';
import { useChamadosList, useEstatisticasChamados } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';

export function useHomeData() {
  const { usuario } = useAuth();
  const statsQuery = useEstatisticasChamados();
  const recentQuery = useChamadosList({ page: 0, size: 3, sort: 'dtAbertura,desc' });
  const { apoiarChamado } = useChamadoMutations();

  const estatisticas = statsQuery.estatisticas;
  const taxaResolucao =
    !estatisticas || estatisticas.total <= 0
      ? 0
      : Math.round((estatisticas.resolvidos / estatisticas.total) * 100);

  const onRefresh = async () => {
    await Promise.all([statsQuery.refetch(), recentQuery.refetch()]);
  };

  return {
    usuario,
    estatisticas,
    taxaResolucao,
    chamadosRecentes: recentQuery.chamados,
    categorias: CATEGORIA_CATALOG,
    isLoading: statsQuery.isLoading || recentQuery.isLoading,
    isRefreshing: statsQuery.isRefetching || recentQuery.isRefetching,
    error: statsQuery.error || recentQuery.error,
    onRefresh,
    apoiarChamado,
  };
}
