import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInfiniteChamadosList } from '@/hooks/useChamados';
import { useChamadoMutations } from '@/hooks/useChamadoMutations';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIA_CATALOG } from '@/theme/semanticConfig';
import type { LocationFilterLevel, RadarLocationFilter, RadarSortOption, StatusFiltro } from '@/types/filters';

function uniqueSorted(values: (string | undefined | null)[]): string[] {
  const map = new Map<string, string>();
  for (const raw of values) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!map.has(key)) map.set(key, trimmed);
  }
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function useRadarData(
  routeCategoria: string | undefined,
  onChangeRouteCategoria: (categoria?: string) => void
) {
  const { usuario } = useAuth();
  const userCity = usuario?.endereco?.cidade?.trim() ?? '';

  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('TODOS');
  const [busca, setBusca] = useState('');
  const [sortBy, setSortBy] = useState<RadarSortOption>('RECENTES');
  const [locationFilter, setLocationFilter] = useState<RadarLocationFilter>({
    nivel: 'CIDADE',
    valor: null,
  });

  const categoriaFiltro = routeCategoria || 'TODAS';
  const trimmedBusca = busca.trim();
  const debouncedBusca = useDebounce(trimmedBusca, 350);
  const buscaEfetiva = trimmedBusca === '' ? '' : debouncedBusca;
  const locationValue = locationFilter.valor?.trim() || undefined;

  const setCategoriaFiltro = (categoria: string) => {
    onChangeRouteCategoria(categoria === 'TODAS' ? undefined : categoria);
  };

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
  const { apoiarChamado } = useChamadoMutations();

  const items = listQuery.chamados;
  const locationOptions: Record<LocationFilterLevel, string[]> = {
    CIDADE: uniqueSorted([usuario?.endereco?.cidade, ...items.map((c) => c.endereco.cidade)]),
    BAIRRO: uniqueSorted([usuario?.endereco?.bairro, ...items.map((c) => c.endereco.bairro)]),
    ESTADO: uniqueSorted([usuario?.endereco?.estado, ...items.map((c) => c.endereco.estado)]),
  };

  const chamados = sortBy === 'MAIS_APOIADOS'
    ? [...items].sort((a, b) => b.totalVotos - a.totalVotos)
    : items;

  const loadMore = () => {
    if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
      void listQuery.fetchNextPage();
    }
  };

  const isUsingCustomLocation =
    locationFilter.nivel !== 'CIDADE' || locationFilter.valor !== null;

  const hasActiveFilters =
    statusFiltro !== 'TODOS' ||
    categoriaFiltro !== 'TODAS' ||
    trimmedBusca.length > 0 ||
    isUsingCustomLocation;

  const limparFiltros = () => {
    setStatusFiltro('TODOS');
    onChangeRouteCategoria(undefined);
    setBusca('');
    setLocationFilter({ nivel: 'CIDADE', valor: null });
  };

  return {
    chamados,
    totalCount: listQuery.totalElements,
    categorias: CATEGORIA_CATALOG,
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
  };
}
