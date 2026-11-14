import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoriasChamado, useInfiniteChamadosList } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useDebounce } from '@/hooks/useDebounce';
import type { LocationFilterLevel, RadarLocationFilter, RadarSortOption, StatusFiltro } from '@/types/filters';

function uniqueSorted(values: (string | undefined | null)[]): string[] {
  const map = new Map<string, string>();
  for (const raw of values) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!map.has(key)) {
      map.set(key, trimmed);
    }
  }
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function useRadarData(initialCategoria?: string) {
  const { usuario } = useAuth();
  const userCity = usuario?.endereco?.cidade?.trim() ?? '';

  const routeCategoria = initialCategoria || 'TODAS';
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('TODOS');
  const [manualCategoria, setManualCategoria] = useState<{ forRoute: string; value: string } | null>(null);
  const [busca, setBusca] = useState('');
  const [sortBy, setSortBy] = useState<RadarSortOption>('RECENTES');
  const [locationFilter, setLocationFilter] = useState<RadarLocationFilter>({
    nivel: 'CIDADE',
    valor: null,
  });

  const trimmedBusca = busca.trim();
  const debouncedBusca = useDebounce(trimmedBusca, 350);
  const buscaEfetiva = trimmedBusca === '' ? '' : debouncedBusca;

  const categoriaFiltro = manualCategoria?.forRoute === routeCategoria ? manualCategoria.value : routeCategoria;

  const setCategoriaFiltro = useCallback(
    (categoria: string) => {
      setManualCategoria({ forRoute: routeCategoria, value: categoria });
    },
    [routeCategoria]
  );

  const locationValue = locationFilter.valor?.trim() || undefined;

  const { categorias } = useCategoriasChamado();
  const listQuery = useInfiniteChamadosList({
    status: statusFiltro === 'TODOS' ? undefined : statusFiltro,
    categoria: categoriaFiltro === 'TODAS' ? undefined : categoriaFiltro,
    busca: buscaEfetiva || undefined,
    cidade: locationFilter.nivel === 'CIDADE' ? locationValue : undefined,
    bairro: locationFilter.nivel === 'BAIRRO' ? locationValue : undefined,
    estado: locationFilter.nivel === 'ESTADO' ? locationValue : undefined,
    size: 10,
    sort: 'dtAbertura,desc',
  });
  const { apoiarChamado, supportError, clearSupportError } = useChamadoMutations();

  const locationOptions = useMemo<Record<LocationFilterLevel, string[]>>(() => {
    const items = listQuery.chamados;
    return {
      CIDADE: uniqueSorted([usuario?.endereco?.cidade, ...items.map((c) => c.endereco.cidade)]),
      BAIRRO: uniqueSorted([usuario?.endereco?.bairro, ...items.map((c) => c.endereco.bairro)]),
      ESTADO: uniqueSorted([usuario?.endereco?.estado, ...items.map((c) => c.endereco.estado)]),
    };
  }, [listQuery.chamados, usuario?.endereco?.bairro, usuario?.endereco?.cidade, usuario?.endereco?.estado]);

  const chamadosFiltrados = useMemo(() => {
    if (sortBy === 'MAIS_APOIADOS') {
      return [...listQuery.chamados].sort((a, b) => b.totalVotos - a.totalVotos);
    }
    return listQuery.chamados;
  }, [listQuery.chamados, sortBy]);

  const loadMore = useCallback(() => {
    if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
      void listQuery.fetchNextPage();
    }
  }, [listQuery]);

  const isUsingCustomLocation =
    locationFilter.nivel !== 'CIDADE' || locationFilter.valor !== null;

  const hasActiveFilters =
    statusFiltro !== 'TODOS' ||
    categoriaFiltro !== 'TODAS' ||
    busca.trim().length > 0 ||
    isUsingCustomLocation;

  const limparFiltros = useCallback(() => {
    setStatusFiltro('TODOS');
    setManualCategoria({ forRoute: routeCategoria, value: 'TODAS' });
    setBusca('');
    setLocationFilter({ nivel: 'CIDADE', valor: null });
  }, [routeCategoria]);

  return {
    chamados: chamadosFiltrados,
    totalCount: listQuery.totalElements,
    categorias,
    statusFiltro,
    setStatusFiltro,
    categoriaFiltro,
    setCategoriaFiltro,
    locationFilter,
    setLocationFilter,
    locationOptions,
    userCity,
    busca,
    setBusca,
    sortBy,
    setSortBy,
    hasActiveFilters,
    limparFiltros,
    isLoading: listQuery.isLoading,
    isRefreshing: listQuery.isRefetching,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    hasNextPage: listQuery.hasNextPage,
    loadMore,
    error: listQuery.error,
    refetch: listQuery.refetch,
    apoiarChamado,
    supportError,
    clearSupportError,
  };
}
