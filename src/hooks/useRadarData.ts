import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCategoriasChamado, useChamadosList } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import type { StatusChamado } from '@/types/categoria';

export type RadarSortOption = 'RECENTES' | 'MAIS_APOIADOS';

export function useRadarData(initialCategoria?: string) {
  const routeCategoria = initialCategoria || 'TODAS';
  const [statusFiltro, setStatusFiltro] = useState<StatusChamado | 'TODOS'>('TODOS');
  const [manualCategoria, setManualCategoria] = useState<{ forRoute: string; value: string } | null>(null);
  const [busca, setBusca] = useState('');
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [sortBy, setSortBy] = useState<RadarSortOption>('RECENTES');

  const categoriaFiltro = manualCategoria?.forRoute === routeCategoria ? manualCategoria.value : routeCategoria;

  const setCategoriaFiltro = useCallback(
    (categoria: string) => {
      setManualCategoria({ forRoute: routeCategoria, value: categoria });
    },
    [routeCategoria]
  );

  useEffect(() => {
    const timer = setTimeout(() => setBuscaDebounced(busca.trim()), 350);
    return () => clearTimeout(timer);
  }, [busca]);

  const { categorias } = useCategoriasChamado();
  const listQuery = useChamadosList({
    status: statusFiltro === 'TODOS' ? undefined : statusFiltro,
    categoria: categoriaFiltro === 'TODAS' ? undefined : categoriaFiltro,
    busca: buscaDebounced || undefined,
    page: 0,
    size: 50,
    sort: 'dtAbertura,desc',
  });
  const { apoiarChamado } = useChamadoMutations();

  const chamadosOrdenados = useMemo(() => {
    const lista = [...listQuery.chamados];
    if (sortBy === 'MAIS_APOIADOS') {
      lista.sort((a, b) => b.totalVotos - a.totalVotos);
    }
    return lista;
  }, [listQuery.chamados, sortBy]);

  const hasActiveFilters = statusFiltro !== 'TODOS' || categoriaFiltro !== 'TODAS' || busca.trim().length > 0;

  const limparFiltros = useCallback(() => {
    setStatusFiltro('TODOS');
    setManualCategoria({ forRoute: routeCategoria, value: 'TODAS' });
    setBusca('');
    setBuscaDebounced('');
  }, [routeCategoria]);

  return {
    chamados: chamadosOrdenados,
    totalElements: listQuery.pageInfo?.totalElements ?? chamadosOrdenados.length,
    categorias,
    statusFiltro,
    setStatusFiltro,
    categoriaFiltro,
    setCategoriaFiltro,
    busca,
    setBusca,
    sortBy,
    setSortBy,
    hasActiveFilters,
    limparFiltros,
    isLoading: listQuery.isLoading,
    isRefreshing: listQuery.isRefetching,
    error: listQuery.error,
    refetch: listQuery.refetch,
    apoiarChamado,
  };
}
